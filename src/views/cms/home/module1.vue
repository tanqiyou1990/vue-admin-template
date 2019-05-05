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
      <el-form-item label="板块标题(en)" prop="titleEn">
        <el-input v-model="form.titleEn" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-card class="box-card" v-for="(item,index) in cardList" :key="index">
            <div slot="header" class="clearfix">
                <span>序号-{{index+1}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="deleteCard(index)">删除</el-button>
            </div>
            <strong>{{item.title}}</strong>
            <div class="upload">
                <div class="photo"><img :src="item.icoUrl" alt=""></div>
            </div>
            <span>{{item.text}}</span>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button style="float: right; padding: 3px 0" type="text" @click="saveCard">保存</el-button>
            </div>
            主题:<el-input v-model="defaultCardInfo.title" />
            <div>图标:</div>
            <div class="upload">
                <div class="upload">
                    <input type="file" multiple ref="upload" capture="capture" id="file" name="file" accept="image/*" v-on:change="uploadImage($event)">
                    <div class="photo"><img :src="defaultCardInfo.icoUrl" alt=""></div>
                </div>
            </div>
            描述:<el-input v-model="defaultCardInfo.text" />
        </el-card>
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
import { newHomeRelease, releaseHomeList, loadHomeByRelease, updateHomeRelease } from '@/api/cms'
import { doUpload } from '@/api/common'

const defaultForm = {
  id: null,
  title: '',
  titleEn: '',
  content: '',
  releaseNum: '',
  isNewVersion: true
}

export default {
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
            message = '主题内容'
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
      defaultCardInfo: {
        icoUrl: '',
        title: '',
        text: ''
      },
      cardList: [],
      releaseOptions: [],
      listLoading: false,
      canCrop: false,
      rules: {
        title: [{ validator: validateRequire }],
        titleEn: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    this.loadReleaseList()
  },
  methods: {
    deleteCard(index) {
      this.cardList.splice(index,1);
    },  
    saveCard() {
      if (this.defaultCardInfo.title == null || this.defaultCardInfo.icoUrl == null || this.defaultCardInfo.text == null || 
      this.defaultCardInfo.title == '' || this.defaultCardInfo.icoUrl == '' || this.defaultCardInfo.text == '') {
        this.$message({
          message: '主题内容为必填项!',
          type: 'warning'
        })
      } else {
        this.cardList.push(this.defaultCardInfo)
        this.form.content = this.cardList
        this.defaultCardInfo = {
          icoUrl: '',
          title: '',
          text: ''
        }
      }
    },
    loadReleaseList() {
      this.listLoading = true
      releaseHomeList(1)
        .then(res => {
          this.listLoading = false
          this.releaseOptions = res.data
          if (this.releaseOptions.length) {
            const activeRelease = this.releaseOptions.filter(item => {
              return item.isActivated === '1'
            })
            if (activeRelease.length) {
              this.initByRelease(activeRelease[0].releaseNum)
            }
          }
        })
    },
    initByRelease(releaseNum) {
      this.listLoading = true
      loadHomeByRelease(releaseNum,1)
        .then(res => {
          this.listLoading = false
          this.form = res.data
          if(this.form.content){
              this.cardList = JSON.parse(this.form.content)
          }
        })
    },
    updateSubmit() {
      this.listLoading = true
      updateHomeRelease(this.form,1)
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
      newHomeRelease(this.form,1)
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
          this.form.content = this.cardList
          if (this.form.isNewVersion) {
            this.addNewsSubmit()
          } else {
            if (this.form.id) {
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
            this.defaultCardInfo.icoUrl = res.data
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
  .box-card {
      margin-bottom: 5px;
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

