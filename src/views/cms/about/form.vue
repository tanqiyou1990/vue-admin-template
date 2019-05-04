<template>
  <div class="app-container">
    <el-form
    ref="form"
    :rules="rules"
    :model="form"
    v-loading="listLoading"
    label-width="120px">
      <el-form-item label="历史版本">
        <el-select v-model="form.releaseNum" placeholder="可选择历史版本" @change="initByRelease(form.releaseNum)">
          <el-option v-for="(item,index) in releaseOptions" :key="index" :label="'版本-'+item.releaseNum + (item.isActivated === '1' ? '（使用中）' : '')" :value="item.releaseNum"/>
        </el-select>
      </el-form-item>    
      <el-form-item label="板块标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="板块标题(en)" prop="title">
        <el-input v-model="form.titleEn" />
      </el-form-item>
      <el-form-item prop="content" label="描述信息">
        <div class="edit_container">
          <editor ref="myTextEditor" :fileName="'myFile'" v-model="form.content" :canCrop="canCrop" />
        </div>
      </el-form-item>
      <el-form-item label="以新版本号发布">
        <el-switch v-model="form.isNewVersion" />
      </el-form-item>   
      <el-form-item>
        <el-button type="primary" @click="onSubmit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { newAboutRelease, releaseAboutList, loadAboutByRelease, updateAboutRelease } from '@/api/cms'
import editor from '@/components/Richtext/Quilleditor.vue'

const defaultForm = {
  id: null,
  title: '',
  titleEn: '',
  content: '',
  releaseNum: '',
  isNewVersion: true
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
          case 'title':
            message = '板块标题'
            break
          case 'titleEn':
            message = '板块标题(en)'
            break           
          case 'content':
            message = '描述信息'
            break
          default:
            break
        }
        callback(new Error(message + '为必填项'))
      } else {
        callback()
      }
    }
    return {
      form: Object.assign({}, defaultForm),
      releaseOptions: [],
      listLoading: false,
      canCrop: false,
      rules: {
        title: [{ validator: validateRequire }],
        titleEn: [{ validator: validateRequire }],        
        content: [{ validator: validateRequire }],
      }
    }
  },
  created() {
    this.loadReleaseList()
  },
  methods: {

    loadReleaseList() {
      this.listLoading = true
      releaseList()
        .then(res => {
          this.listLoading = false
          this.releaseOptions = res.data
          if(this.releaseOptions.length){
            let activeRelease = this.releaseOptions.filter(item => {
              return item. isActivated === '1'
            })
            if(activeRelease){
              this.initByRelease(activeRelease[0].releaseNum)
            }
          }
        })
    },
    initByRelease(releaseNum) {
      this.listLoading = true
      loadAboutByRelease(releaseNum)
        .then(res => {
          this.listLoading = false
          this.form = res.data
        })
    },
    updateSubmit() {
      this.listLoading = true
      updateAboutRelease(this.form)
        .then(res => {
          this.listLoading = false
          this.$message({
            message: '保存成功!',
            type: 'success'
          })
          this.$router.go(0)
        })
    },
    addNewsSubmit() {
      this.listLoading = true
      newAboutRelease(this.form)
        .then(res => {
          this.listLoading = false
          if (res.success) {
            this.$message({
              message: '保存成功!',
              type: 'success'
            })
            this.$router.go(0)
          } else {
            this.$message({
              message: '保存失败，请稍后再试!',
              type: 'warning'
            })
          }
        })
        .catch(() => {
          this.listLoading = false
          this.$message({
            message: '保存出现异常，请稍后再试!',
            type: 'warning'
          })
        })
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.isNewVersion) {
            this.addNewsSubmit()
          } else {
            if(this.form.id){
              this.updateSubmit()
            } else {
              this.$message({
                message: '非历史版本，请以新版本发布!',
                type: 'warning'
              })
            }
          }
          
        } else {
          return
        }
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

