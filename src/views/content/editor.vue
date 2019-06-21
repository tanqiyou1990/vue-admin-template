<template>
  <div class="app-container">
    <el-form 
    ref="form" 
    :rules="rules" 
    :model="form"
    v-loading="listLoading"
    label-width="120px">
      <el-input v-show="false" v-model="form.id" autocomplete="off" />
      <el-form-item label="主题板块" prop="cid">
        <el-input v-show="false" v-model="form.cid" autocomplete="off" />
        <el-cascader style="width:300px" placeholder="请选择主题/板块" :disabled="read"
          :options="themeOptions"
          v-model="selectedThemeCatgoryOptions"
          @change="handleChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="内容标题" prop="title">
        <el-input style="width:300px" v-model="form.title" autocomplete="off" :disabled="read" />
      </el-form-item>
      <el-form-item label="内容描述" prop="desc">
        <el-input style="width:700px" v-model="form.desc" autocomplete="off" :disabled="read" />
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input style="width:300px" v-model="form.author" autocomplete="off" :disabled="read" />
      </el-form-item>
     
        <el-form-item label="列表图片" prop="imgUrl">
          <el-upload
            class="avatar-uploader"
            :action="serverUrl"
            :with-credentials='true'
            :name="'myFile'"
            :show-file-list="false"
            accept="image/*"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            :disabled="read"
          >
            <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>

      <el-form-item prop="content" label="文章内容">
        <div class="edit_container">
          <editor ref="myTextEditor" :fileName="'myFile'" v-model="form.content" :canCrop="canCrop" />
        </div>
      </el-form-item>

    </el-form>
     
    <br>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="goContent()">返 回</el-button>
      <el-button type="primary" @click="handleAddOrUpdate()" v-show="!read">确 定</el-button>
    </div>
  </div>
</template>

<script>
import editor from '@/components/Richtext/Quilleditor.vue'
import { getThemeCategory } from '@/api/theme'
import { addContent, getContent, editContent } from '@/api/content'

export default {
  components: {
    editor
  },
  data() {
    return {
      listLoading: false,
      canCrop: false,
      read: false,
      themeOptions: [],
      selectedThemeCatgoryOptions: null,
      form: {
        id: '',
        cid: '',
        title: '',
        desc: '',
        imgUrl: '',
        content: '',
        author: ''
      },
      rules: {
        cid: [
          { required: true, message: '请选择板块名称', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入内容标题', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入文章简述', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请选择列表图片', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者名称', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      serverUrl: `${process.env.VUE_APP_BASE_API}/common/upload`,  // 这里写你要上传的图片服务器地址
    }
  },
  created() {
    
    this.init()
  },
  methods: {
    /**
     * 加载主题板块联级
     */
    loadTheme(){
      return getThemeCategory().then(response => {
        this.themeOptions = response.data
      })
    },
    handleChange(val){
      this.form.cid = val[1]
    },
    handleUploadSuccess(res, file) {
      this.form.imgUrl = res.data.filename
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleAddOrUpdate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          if (this.form.id === null || this.form.id === '') {
            addContent(this.form)
          } else {
            editContent(this.form)
          }
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$router.push({path:'/content'})
        } else {
          return false
        }
      })
    },
    goContent(){
      this.$router.push({path:'/content'})
    },
    /**
     * 根据ID获取文章详情
     */
    loadDtl(id){
      getContent(id)
      .then(response => {
        let data = response.data
        this.form.id = data.id
        this.form.cid = data.cid
        this.form.title = data.title
        this.form.desc = data.desc
        this.form.imgUrl = data.imgUrl
        this.form.content = data.content
        this.form.author = data.author

        this.checkThemeCatgory(data.cid)


        this.listLoading = false
      })
      .catch(err => {
        this.$message.error("查询数据出错:",err)
        this.listLoading = false
      })
    },
    /**
     * 数据初始化
     */
    init() {
      this.listLoading = true
      let id = this.$route.query.id
      let readFlag = this.$route.query.type

      this.loadTheme().then(res => {
        if (id){
          this.loadDtl(id)
        }else{
          this.listLoading = false
        }
      })
      if (readFlag !== undefined && readFlag === 'read') {
        this.read = true
        this.listLoading = false
      }
    },
    /**
     * 根据cid返回联级
     */
    checkThemeCatgory(cid){
      if(this.themeOptions.length>0){
        var obj = this.themeOptions.filter(item => {
          var childObj = item.children.filter(childItem => {
            return childItem.value === cid
          })
          if(childObj.length>0){
            return true
          }
        })
        this.selectedThemeCatgoryOptions = [obj[0].value,cid]
      }
    }
  }
}
</script>

<style lang="less">
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .edit_container {
    .quill-editor {
      .ql-container.ql-snow {
        height: 240px;
      }
    }
  }  
</style>
