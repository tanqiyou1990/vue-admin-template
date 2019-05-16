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
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ scope.row.createTime | timeFormate }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isPublished | statusFilter">{{ scope.row.isPublished | isPublishedName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="阅读次数" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.readCount }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.isPublished=='0'" size="mini" type="success" @click="handlePublish(scope.row.id)">发布</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="pageNo"
        :total="total"
      />
    </div>
  </div>
</template>
<script>
import { getList, publish, deleteNews } from '@/api/news'
import { formatDate } from '@/utils/date.js'

export default {
  filters: {
    isPublishedName(status) {
      const statusMap = {
        1: '已发布',
        0: '未发布'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'gray'
      }
      return statusMap[status]
    },
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
      pageNo: 1,
      pageSize: 10,
      total: 0,
      searchKey: null,
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData(this.pageNo, this.pageSize, this.searchKey)
  },
  methods: {
    handleCurrentChange(val){
      this.pageNo = val
      this.fetchData(this.pageNo, this.pageSize, this.searchKey)
    },
    fetchData(pageNo, pageSize, searchKey) {
      this.listLoading = true
      getList({ pageNo, pageSize, searchKey }).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$router.push({ path: '/news/form' })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteNews({ id }).then(res => {
          this.listLoading = false
          if (res.success) {
            this.$message({
              message: '删除成功!',
              type: 'success'
            })
          }
          this.fetchData(this.pageNo, this.pageSize, this.searchKey)
        })
      }).catch(() => {})
    },
    handleEdit(nid) {
      this.$router.push({ path: '/news/form', query: { nid }})
    },
    handlePublish(id) {
      this.listLoading = true
      publish({ id }).then(res => {
        this.listLoading = false
        if (res.success) {
          this.$message({
            message: '保存成功!',
            type: 'success'
          })
        }
        this.fetchData(this.pageNo, this.pageSize, this.searchKey)
      })
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
