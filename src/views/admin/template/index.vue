<template>
  <div class="mod-config">
    <basic-container>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form>

      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <el-table-column prop="id" align="center" header- label="编号">
          </el-table-column>
          <el-table-column prop="templateName" align="center" header- label="模板名称">
          </el-table-column>
          <el-table-column prop="fileSize" align="center" header- label="文件大小">
          </el-table-column>
          <el-table-column prop="createUser" align="center" header- label="创建用户">
          </el-table-column>
          <el-table-column prop="createTime" align="center" header- label="上传时间">
          </el-table-column>
          <el-table-column header- label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="avue-crud__pagination">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                       :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <table-form v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></table-form>
    </basic-container>
  </div>
</template>

<script>
import { getTemplateList, delTemplate } from '@/api/admin/template'
import TableForm from './dataForm'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dataForm: {
        key: '',
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
    }
  },
  components: {
    TableForm,
  },
  created() {
    this.getDataList()
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getTemplateList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
        })
      ).then((response) => {
        this.dataList = response.data.data.records
        this.totalPage = response.data.data.total
      })
      this.dataListLoading = false
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      // if (!this.permissions.template_add) return this.msgWarn('权限不足')
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(row) {
      if (!this.permissions.template_delete) return this.msgWarn('权限不足')
      this.$confirm(`是否确认删除:${row.templateName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delTemplate(row.id)
        })
        .then((data) => {
          this.$message.success('删除成功')
          this.currentChangeHandle(1)
        })
    },
  },
}
</script>
