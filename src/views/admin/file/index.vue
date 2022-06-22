
<template>
  <div class="execution">
    <basic-container>
      <avue-crud ref="crud" :page.sync="page" :data="tableData" :permission="permissionList"
                 :table-loading="tableLoading" :option="tableOption" :upload-after="uploadAfter" @on-load="getList"
                 @search-change="searchChange" @search-reset="handleClear" @refresh-change="refreshChange"
                 @size-change="sizeChange" @current-change="currentChange" @row-del="rowDel">
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-download" @click="download(scope.row, scope.index)">下载
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { delObj, fetchList } from '@/api/admin/sys-file'
import { tableOption } from '@/const/crud/admin/sys-file'
import { mapGetters } from 'vuex'
import { handleDown } from '@/util/util'
import { validatenull } from '@/util/validate'

export default {
  name: 'sys-file',
  data() {
    return {
      searchForm: {},
      tableData: [],
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
        addBtn: this.vaildData(this.permissions.sys_file_add, true),
        delBtn: this.vaildData(this.permissions.sys_file_del, true),
        editBtn: this.vaildData(this.permissions.sys_file_edit, false),
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
      )
        .then((response) => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    rowDel: function (row, index) {
      var _this = this
      this.$confirm('是否确认删除文件：' + row.fileName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delObj(row.id)
        })
        .then((data) => {
          _this.msgSuccess('删除成功')
          this.getList(this.page)
        })
    },
    searchChange(form, done) {
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    refreshChange() {
      this.searchForm = this.form
      this.getList(this.page)
    },
    handleClear() {
      this.searchForm.fileName = null
      this.getList(1)
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    download: function (row, index) {
      handleDown(row.fileName, row.bucketName)
    },
    uploadAfter(res, done, loading) {
      if (!validatenull(res.fileName)) {
        this.msgSuccess('上传成功')
        this.getList(this.page)
      }
      done()
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-icon-search {
  display: none;
}
::v-deep .el-icon-delete {
  display: none;
}
::v-deep .el-icon-download {
  display: none;
}
</style>
