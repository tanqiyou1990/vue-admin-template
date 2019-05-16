<template>
  <div class="app-container">
    <el-form ref="form" 
    :model="form" 
    v-loading="listLoading"
    label-width="120px">
      <el-form-item>
          <div class="upload">
            <input type="file" multiple ref="upload" capture="capture" id="file" name="file" accept="image/*" v-on:change="uploadImage($event)">
            <div class="photo"><img :src="form.avatar" alt=""></div>
          </div>
      </el-form-item>
      <el-form-item label="ID">
        <el-input v-model="form.uid" :disabled="true"/>
      </el-form-item>        
      <el-form-item label="姓名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { doUpload } from '@/api/common'
import { getInfo, updateInfo } from '@/api/user'
export default {
  data() {
    return {
      listLoading: false,
      canCrop:false,
      nid: undefined,
      form: {
        id: '',
        avatar: '',
        email: '',
        username: '',
        phone: '',
        uid: '',
        roles: ''
      }
    }
  },
  created() {
    this.initProfile()
  },
  methods: {
    onSubmit() {
      this.listLoading = true
      updateInfo(this.form).then(res => {
        this.listLoading = false
        if(res.code === 20000){
          this.$message({
            message: '资料保存成功!',
            type: 'success'
          })
          this.initProfile()
          this.$store.dispatch('user/getInfo')
        }else{
          this.$message({
            message: '资料保存失败，请稍后再试!',
            type: 'warning'
          })
        }
      })
      .catch(err => {
        this.listLoading = false
        this.$message({
          message: '新闻保存出现异常，请稍后再试!',
          type: 'warning'
        })               
      })
    },
    onCancel() {
      this.$router.push({ path: '/' })
    },
    //上传新图片
    uploadImage(avatar){
      var params = new FormData()
      params.append('myFile',this.$refs.upload.files[0])
      this.listLoading = true
      doUpload(params)
      .then(res => {
        this.listLoading = false
        if(res.code === 20000){
          this.form.avatar = res.data.filename
        }else{
          this.$message({
            message: '头像保存失败，请稍后再试',
            type: 'warning'
          })
        }
      }).catch(err => {
        this.listLoading = false
        this.$message({
          message: '头像保存出现异常，请稍后再试',
          type: 'warning'
        })
      })
    },
    initProfile(){
      this.listLoading = true
      getInfo().then(res => {
        this.listLoading = false
        if(res.code === 20000){
          this.form = res.data
        }else{
        }
      })
      .catch(err => {
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

