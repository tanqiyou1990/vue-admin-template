<template>
  <div class="app-container">
    <el-form
    ref="form"
    :rules="rules"
    :model="form"
    v-loading="listLoading"
    label-width="120px">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" />
      </el-form-item>
      <el-form-item label="新闻分类" prop="type">
        <el-select v-model="form.type" placeholder="请选择新闻分类">
          <el-option label="久零" value="久零" />
          <el-option label="产品" value="产品" />
          <el-option label="服务" value="服务" />
        </el-select>
      </el-form-item>
      <el-form-item label="新闻图片">
          <div class="upload">
            <input type="file" multiple ref="upload" capture="capture" id="file" name="file" accept="image/*" v-on:change="uploadImage($event)">
            <div class="photo"><img :src="form.img_url" alt=""></div>
          </div>
      </el-form-item>
      <el-form-item prop="content">
        <div class="edit_container">
          <editor ref="myTextEditor" :fileName="'myFile'" v-model="form.content" :canCrop="canCrop" />
        </div>
      </el-form-item>

      <el-form-item label="立即发布">
        <el-switch v-model="form.isPublished" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addNews, newsDtl, updateNews } from '@/api/news'
import { doUpload } from '@/api/common'
import editor from './components/Quilleditor.vue'

const defaultForm = {
  title: '',
  desc: '',
  type: '',
  content: '',
  isPublished: false,
  img_url: ''
}

export default {
  components: {
    editor
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        let message = ''
        switch (rule.field) {
          case 'desc':
            message = '描述'
            break
          case 'title':
            message = '标题'
            break
          case 'content':
            message = '内容'
            break
          case 'type':
            message = '分类'
            break
          default:
            break
        }
        // this.$message({
        //   message: message + '为必填项',
        //   type: 'error'
        // })
        callback(new Error(message + '为必填项'))
      } else {
        callback()
      }
    }
    return {
      form: Object.assign({}, defaultForm),
      listLoading: false,
      canCrop: false,
      nid: undefined,
      rules: {
        desc: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        type: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    this.nid = this.$route.query.nid
    if (this.nid) {
      this.selectNewsDtl(this.nid)
    }
  },
  methods: {
    addNewsSubmit() {
      this.listLoading = true
      addNews(this.form)
        .then(res => {
          this.listLoading = false
          if (res.success) {
            this.$message({
              message: '保存成功!',
              type: 'success'
            })
            this.$router.push({ path: '/news/list' })
          } else {
            this.$message({
              message: '新闻保存失败，请稍后再试!',
              type: 'warning'
            })
            this.form = {}
            this.$router.go(0)
          }
        })
        .catch(() => {
          this.listLoading = false
          this.$message({
            message: '新闻保存出现异常，请稍后再试!',
            type: 'warning'
          })
          this.form = {}
          this.$router.go(0)
        })
    },
    updateNewsSubmit() {
      this.listLoading = true
      this.form.id = this.nid
      updateNews(this.form)
        .then(res => {
          this.listLoading = false
          if (res.success) {
            this.$message({
              message: '保存成功!',
              type: 'success'
            })
            this.$router.push({ path: '/news/list' })
          } else {
            this.$message({
              message: '新闻保存失败，请稍后再试!',
              type: 'warning'
            })
            this.form = {}
            this.$router.go(0)
          }
        })
        .catch(() => {
          this.listLoading = false
          this.$message({
            message: '新闻保存出现异常，请稍后再试!',
            type: 'warning'
          })
          this.form = {}
          this.$router.go(0)
        })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.nid) {
            this.updateNewsSubmit()
          } else {
            this.addNewsSubmit()
          }
        } else {
          return
        }
      })
    },
    onCancel() {
      this.$router.push({ path: '/news/list' })
    },
    /**
     * 上传图片
     */
    uploadImage(avatar) {
      var params = new FormData()
      params.append('myFile', this.$refs.upload.files[0])
      this.listLoading = true
      doUpload(params)
        .then(res => {
          this.listLoading = false
          if (res.success) {
            this.form.img_url = res.data
          } else {
            this.$message({
              message: '图片保存失败，请稍后再试',
              type: 'warning'
            })
          }
        })
        .catch(() => {
          this.listLoading = false
          this.$message({
            message: '图片保存出现异常，请稍后再试',
            type: 'warning'
          })
        })
    },
    selectNewsDtl(nid) {
      this.listLoading = true
      newsDtl(nid).then(res => {
        this.listLoading = false
        if (res.success) {
          this.form = {
            title: res.data.title,
            desc: res.data.desc,
            type: res.data.type,
            content: res.data.content,
            isPublished: res.data.isPublished === '1',
            img_url: res.data.imgUrl
          }
        } else {
          this.$message({
            message: '查询新闻详情失败，请稍后再试',
            type: 'warning'
          })
          this.$router.push({ path: '/news/list' })
        }
      })
        .catch(() => {
          this.$message({
            message: '查询新闻详情出现异常，请稍后再试',
            type: 'warning'
          })
          this.$router.push({ path: '/news/list' })
        })
    }
  }
}
</script>

<style lang="less">
  .line{
    text-align: center;
  }
  .edit_container {
    .quill-editor {
      .ql-container.ql-snow {
        height: 240px;
      }
    }
  }
  .upload {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #ccc;
    overflow: hidden;

    .photo {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 6;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 10;
    }
  }
</style>

