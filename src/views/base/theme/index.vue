<template>
  <div class="app-container">
    <el-row style="margin-bottom: 15px;">

        <el-button type="primary" @click="showDialog(form, null)">新增</el-button>
        <el-input style="width:200px" placeholder="请输入主题关键字" v-model="keyword" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchList"></el-button>
        </el-input>
    </el-row>


    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="主题名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="主题说明">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主题图片" width="220" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" width="100">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="update_at" label="更新时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pagesize"
        :current-page="currentPage"
        :total="total"
      />
    </div>


    <el-dialog title="新增主题" :visible.sync="dialogFormVisible">
      <el-form ref="form" :rules="rules" :model="form">
        <el-input v-show="false" v-model="form.id" autocomplete="off" />
        <el-form-item label="主题名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="主题说明" prop="desc" :label-width="formLabelWidth">
          <el-input v-model="form.desc" autocomplete="off" />
        </el-form-item>
        <el-form-item label="主题图片" prop="imgUrl" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="serverUrl"
            :show-file-list="false"
            accept='image/*'
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { getList, addTheme, getTheme, editTheme, deleteTheme } from '@/api/theme'

export default {
  data() {
    return {
      currentPage: 1,
      pagesize: 5,
      total: 0,
      list: [],
      listLoading: true,
      dialogFormVisible: false,
      keyword: '',
      form: {
        id: '',
        name: '',
        desc: '',
        imgUrl: ''
      },
      formLabelWidth: '120px',
      serverUrl: `${process.env.VUE_APP_BASE_API}/user/upload`,
      rules: {
        name: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入主题说明', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请选择主题图片', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleUploadSuccess(res, file) {
      this.form.imgUrl = res.data.filename
    },
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    showDialog(form, data) {
      if (data === null || data === '') {
        form.id = ''
        form.name = ''
        form.desc = ''
        form.imgUrl = ''
      } else {
        form.id = data.id
        form.name = data.name
        form.desc = data.desc
        form.imgUrl = data.imgUrl
      }
      this.dialogFormVisible = true
    },
    handleEdit(index, row) {
      getTheme(row.id).then(response => {
        this.showDialog(this.form, response.data)
      })
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTheme(row.id).then(response => {
          this.fetchData()
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    handleAddOrUpdate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          this.listLoading = true
          if (this.form.id === null || this.form.id === '') {
            addTheme(this.form).then(response => {
              this.fetchData()
            })
          } else {
            editTheme(this.form).then(response => {
              this.fetchData()
            })
          }
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        } else {
          return false
        }
      })
    },
    searchList(){
      this.listLoading = true
      getList({'name': this.keyword}).then(response => {
        this.list = response.data.records
        this.listLoading = false
      })
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage
    },
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
<style>
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

.page{
  margin-top: 10px;
}
</style>
