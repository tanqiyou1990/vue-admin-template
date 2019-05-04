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
      <el-form-item label="联系电话" prop="contactTel">
        <el-input v-model="form.contactTel" />
      </el-form-item>
      <el-form-item label="联系邮箱" prop="contactEmail">
        <el-input v-model="form.contactEmail" />
      </el-form-item>
      <el-form-item label="联系地址" prop="contactLocation">
        <el-input v-model="form.contactLocation" />
      </el-form-item>
      <el-form-item label="Facebook" prop="facebookSite">
        <el-input v-model="form.facebookSite" />
      </el-form-item>
      <el-form-item label="Githup" prop="gitSite">
        <el-input v-model="form.gitSite" />
      </el-form-item>
      <el-form-item label="Telegram" prop="telegramSite">
        <el-input v-model="form.telegramSite" />
      </el-form-item>
      <el-form-item label="Twitter" prop="twitterSite">
        <el-input v-model="form.twitterSite" />
      </el-form-item>
      <el-form-item label="微信二维码">
          <div class="upload">
            <input type="file" multiple ref="upload" capture="capture" id="file" name="file" accept="image/*" v-on:change="uploadImage($event)">
            <div class="photo"><img :src="form.wxQrCode" alt=""></div>
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
import { newFooterRelease, releaseFooterList, loadFooterByRelease, updateFooterRelease } from '@/api/cms'
import { doUpload } from '@/api/common'

const defaultForm = {
  id: null,
  contactEmail: '',
  contactLocation: '',
  contactTel: '',
  facebookSite: '',
  gitSite: '',
  telegramSite: '',
  twitterSite: '',
  wxQrCode: '',
  isNewVersion: true
}

export default {
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        let message = ''
        switch (rule.field) {
          case 'contactEmail':
            message = '联系邮箱'
            break
          case 'contactLocation':
            message = '联系地址'
            break
          case 'contactTel':
            message = '联系电话'
            break
          case 'wxQrCode':
            message = '微信二维码'
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
        contactEmail: [{ validator: validateRequire }],
        contactLocation: [{ validator: validateRequire }],
        contactTel: [{ validator: validateRequire }],
        wxQrCode: [{ validator: validateRequire }]
      }
    }
  },
  created() {
    this.loadReleaseList()
  },
  methods: {

    loadReleaseList() {
      this.listLoading = true
      releaseFooterList()
        .then(res => {
          this.listLoading = false
          this.releaseOptions = res.data
          if (this.releaseOptions.length) {
            const activeRelease = this.releaseOptions.filter(item => {
              return item.isActivated === '1'
            })
            if (activeRelease) {
              this.initByRelease(activeRelease[0].releaseNum)
            }
          }
        })
    },
    initByRelease(releaseNum) {
      this.listLoading = true
      loadFooterByRelease(releaseNum)
        .then(res => {
          this.listLoading = false
          this.form = res.data
        })
    },
    updateSubmit() {
      this.listLoading = true
      updateFooterRelease(this.form)
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
      newFooterRelease(this.form)
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
            this.form.wxQrCode = res.data
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

