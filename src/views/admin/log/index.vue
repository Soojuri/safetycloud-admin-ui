

<template>
  <div class="log">
    <basic-container>
      <avue-crud ref="crud" :page.sync="page" :data="tableData" :table-loading="tableLoading" :option="tableOption"
                 :permission="permissionList" @search-reset="handleClear" @on-load="getList"
                 @search-change="searchChange" @refresh-change="refreshChange" @size-change="sizeChange"
                 @current-change="currentChange" @row-del="handleDel" />
    </basic-container>
  </div>
</template>

<script>
import { delObj, fetchList } from '@/api/admin/log'
import { tableOption } from '@/const/crud/admin/log'
import { mapGetters } from 'vuex'

export default {
  name: 'Log',
  data() {
    return {
      tableData: [],
      searchForm: {},
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        delBtn: this.vaildData(this.permissions.sys_log_del, false),
      }
    },
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchList(
        Object.assign(
          {
            descs: 'create_time',
            current: page.currentPage,
            size: page.pageSize,
          },
          params,
          this.searchForm
        )
      ).then((response) => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    handleDel(row) {
      if (!this.permissions.log_del) return this.msgWarn('权限不足')
      this.$confirm('是否确认删除标题为"' + row.title + '"的日志?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delObj(row.id)
        })
        .then(() => {
          this.getList(this.page)
          this.msgSuccess('删除成功')
        })
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    handleClear() {
      this.searchForm = {}
      this.page.currentPage = 1
      this.getList(this.page)
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    refreshChange() {
      this.getList(this.page)
    },
  },
}
</script>
<style lang='scss' scoped>
::v-deep .el-col-md-6 {
  width: auto;
}
::v-deep .avue-crud__menu {
  display: none;
}
::v-deep .el-icon-search {
  display: none;
}
::v-deep .el-icon-delete {
  display: none;
}
</style>