<template>
  <div class="app-container">
    <el-row class="btnRow">
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
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
      <el-table-column label="终端名称">
        <template slot-scope="scope">
          {{ scope.row.serverName }}
        </template>
      </el-table-column>
      <el-table-column label="终端TOKEN">
        <template slot-scope="scope">
          {{ scope.row.token }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ scope.row.createTime | timeFormate }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="limit"
        :current-page="page"
        :total="total"
      />
    </div>

    <el-dialog title="新增终端" :visible.sync="dialogFormVisible">
      <el-form ref="form" :rules="rules" :model="form">
        <el-input v-show="false" v-model="form.id" autocomplete="off" />
        <el-form-item label="终端名称" prop="serverName" :label-width="formLabelWidth">
          <el-input style="width:50%" v-model="form.serverName" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getList, addClient, deleteClient } from '@/api/client'
import { formatDate } from '@/utils/date.js'

export default {
  filters: {
    timeFormate(val) {
      if (!val) {
        return ''
      }
      const date = new Date(val)
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      form: {
        serverName: ''
      },
      formLabelWidth: '120px',
      rules: {
        serverName: [
          { required: true, message: '请输入终端名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData(this.page, this.limit)
  },
  methods: {
    handleCurrentChange(val){
      this.page = val
      this.fetchData(this.page, this.limit)
    },
    fetchData(page, limit) {
      this.listLoading = true
      getList({ page, limit }).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
    },
    handleSubmit(){
      this.$refs['form'].validate((valid) => {
        if(valid){
          addClient(this.form)
          .then(res => {
            if(res.code === 20000){
              this.form = {}
              this.dialogFormVisible = false
              this.$message.success("终端创建成功!")
            }else{
              this.$message({
                message: '保存失败，请稍后再试!',
                type: 'warning'
              })
            }
            this.fetchData()
          })
        }
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteClient(id).then(res => {
          this.listLoading = false
          if (res.success) {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
          }
          this.fetchData(this.page, this.limit)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style>
  .btnRow{
    margin-top: 20px;
    margin-bottom: 10px;
    padding-left: 10px;
  }
  .page{
    margin-top: 10px;
  }
</style>
