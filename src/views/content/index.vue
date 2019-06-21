<template>
  <div class="app-container">
    <el-row style="margin-bottom: 15px;">
      <el-button type="primary" @click="getEditor">新增</el-button>

        <el-select style="width:150px" v-model="searchObj.publishFlag" placeholder="请选择发布状态" @change="searchList">
          <el-option label="显示所有" value=''></el-option>
          <el-option label="已发布" value="1"></el-option>
          <el-option label="未发布" value="0"></el-option>
        </el-select>

        <el-cascader style="width:200px" placeholder="请选择主题/板块"
          :options="themeOptions"
          v-model="selectedThemeCatgoryOptions"
          @change="handleChange">
        </el-cascader>
        <el-input style="width:300px" v-model="searchObj.searchStr" placeholder="请输入关键字搜索"></el-input>
        <el-button type="primary" @click="searchList" plain>搜索</el-button>
        <el-button type="text" @click="clearSearchObj">清除条件</el-button>
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
      <el-table-column label="主题" align="center">
        <template slot-scope="scope">
          {{ scope.row.themeName }}
        </template>
      </el-table-column>
      <el-table-column label="板块" align="center">
        <template slot-scope="scope">
          {{ scope.row.categoryName }}
        </template>
      </el-table-column>
      <el-table-column label="内容标题" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缩略图" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl" width="100">
        </template>
      </el-table-column>
      <el-table-column label="内容作者" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="发布状态"  align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.publishFlag | statusTypeFilter">{{ scope.row.publishFlag | statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.publishTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="阅读次数" align="center">
        <template slot-scope="scope">
           <span>{{ scope.row.creadCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有用" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usefulCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="无用" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.uselessCount }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
       <!-- <el-table-column align="center" prop="created_at" label="更新时间">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.publishFlag === '0'"
            size="mini"
            @click="handlePublish(scope.$index, scope.row)"
          >发布</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleRead(scope.$index, scope.row)"
          >查看</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
            type="text"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.$index, scope.row)"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            @click="loadComments(scope.row.id)"
          >查看评论</el-button>
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

    <el-dialog title="内容评论" :visible.sync="commentDialog.dialogFormVisible">
      <el-collapse v-loading="commentDialog.commentLoading">
        <el-collapse-item :title="item.name+' 评论:'+item.comment" :name="index" v-for="(item,index) in commentDialog.commentList" :key="index">
          <div v-for="(ritem,rindex) in item.replyList" :key="rindex">{{ritem.name}} 回复:{{ritem.comment}}</div>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer" class="dialog-footer">
        <el-button @click="commentDialog.dialogFormVisible = false">返回</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getList, deleteContent, publishContent } from '@/api/content'
import { getComments } from '@/api/comment'
import { getThemeCategory } from '@/api/theme'
import { getCategoryOptions } from '@/api/category'

export default {
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'gray'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        1: '已发布',
        0: '未发布'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      currentPage: 1,
      pagesize: 10,
      total: 0,
      list: [],
      listLoading: true,
      loading: false,
      searchObj: {
        searchStr: '',
        publishFlag: '',
        themeId: '',
        categoryId: ''
      },
      themeOptions: [],
      selectedThemeCatgoryOptions: null,
      formLabelWidth: '120px',
      commentDialog: {
        pageSize:100,
        pageNum:1,
        total:0,
        dialogFormVisible: false,
        commentLoading: false,
        commentList: []
      }
    }
  },
  created() {
    this.fetchData()
    this.loadTheme()
  },
  methods: {
    /**
     * 清除搜索条件
     */
    clearSearchObj(){
      this.selectedThemeCatgoryOptions = ['']
      this.searchObj = {}
    },
    handleChange(val){
      this.searchObj.themeId = val[0]
      if(val[1]){
        this.searchObj.categoryId = val[1]
      }
    },
    /**
     * 加载评论信息
     */
    loadComments(cid){
      this.commentDialog.dialogFormVisible = true
      this.commentDialog.commentLoading = true
      getComments({cid,limit:this.commentDialog.pageSize,page:this.commentDialog.pageNum})
      .then(res => {
        console.log(res)
        this.commentDialog.commentLoading = false
        this.commentDialog.commentList = res.data.records
        this.commentDialog.total = res.data.total
      })
    },
    /**
     * 加载主题板块联级
     */
    loadTheme(){
      getThemeCategory().then(response => {
        this.themeOptions = [{
          value: null,
          label: "显示所有"
        }]
        this.themeOptions = this.themeOptions.concat(response.data)
      })
    },
    getEditor(){
      this.$router.push({path:'/content/editor'})
    },
    handleRead(index, row){
      this.$router.push({path:`/content/editor?id=${row.id}&type=read`})
    },
    handleEdit(index, row) {
      this.$router.push({path:`/content/editor?id=${row.id}`})
    },
    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteContent(row.id).then(response => {
          this.fetchData()
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    handlePublish(index, row) {
      this.$confirm('你确定要发布该内容吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        publishContent(row.id).then(response => {
          this.fetchData()
        })
        this.$message({
          type: 'success',
          message: '发布成功!'
        })
      })
    },
    searchList(){
      this.listLoading = true
      getList(this.searchObj).then(response => {
        this.list = response.data.records
        this.listLoading = false
      })
    },
    handleSizeChange: function(size) {
      this.pagesize = size
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
.page{
  margin-top: 10px;
}
</style>
