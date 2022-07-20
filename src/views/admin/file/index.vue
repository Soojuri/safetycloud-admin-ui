
<template>
  <div class="execution">
    <basic-container>
      <avue-crud ref="crud" :page.sync="page" :data="tableData" :permission="permissionList"
                 :table-loading="tableLoading" :option="tableOption" :upload-before="handleBeforeUpload"
                 :upload-after="uploadAfter" @on-load="getList" @search-change="searchChange"
                 @search-reset="handleClear" @refresh-change="refreshChange" @size-change="sizeChange"
                 @current-change="currentChange" @row-del="rowDel">
        <template slot="menu" slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-download" @click="download(scope.row, scope.index)">下载
          </el-button>
        </template>
        <template slot-scope="scope" slot="fileNameSearch">
          <el-form-item>
            <el-input v-model.trim="fileName" placeholder="请输入文件名" size="small" />
          </el-form-item>
        </template>
        <template slot-scope="scope" slot="typeSearch">
          <el-form-item>
            <el-input v-model.trim="type" placeholder="请输入文件类型" size="small" />
          </el-form-item>
        </template>
        <template slot-scope="scope" slot="createUserSearch">
          <el-form-item>
            <el-input v-model.trim="createUser" placeholder="请输入上传人" size="small" />
          </el-form-item>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import store from '@/store'
import { delObj, fetchList } from '@/api/admin/sys-file'
import { tableOption } from '@/const/crud/admin/sys-file'
import { mapGetters } from 'vuex'
import { handleDown } from '@/util/util'
import { validatenull } from '@/util/validate'

export default {
  name: 'sys-file',
  data() {
    return {
      headers: {
        Authorization: 'Bearer ' + store.getters.access_token,
      },
      fileName: null,
      type: null,
      createUser: null,
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
      let fileName = this.fileName
      let type = this.type
      let createUser = this.createUser
      fetchList(
        Object.assign(
          { fileName, type, createUser, descs: 'create_time', current: page.currentPage, size: page.pageSize },
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
    handleBeforeUpload(file, done, loading) {
      // const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const typeList = ['.csv', '.xlsx', '.xls', '.doc', '.jpeg', '.jpg', '.pdf', '.png']
      const isJPG = typeList.find((item) => file.name.indexOf(item) != -1) ? true : false
      const isLt2M = file.size / 1024 / 1024 < 5
      //文件名是否小于50个字符
      const isFileNameLt = file.name.length < 50
      if (!isJPG) {
        this.msgError('请上传csv,xlsx,xls,doc,jpeg,jpg,pdf,png格式的文件！')
        loading()
      } else if (!isLt2M) {
        this.msgError('上传文件大小不能超过 5MB!')
        loading()
      } else if (!isFileNameLt) {
        this.msgError('请上传文件名小于50个字符的摸板！')
        loading()
      }
      if (isJPG && isLt2M && isFileNameLt) {
        done()
      }
      return isJPG && isLt2M && isFileNameLt
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
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    refreshChange() {
      this.searchForm = this.form
      this.getList(this.page)
    },
    handleClear() {
      this.fileName = null
      this.type = null
      this.createUser = null
      this.searchForm = {}
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
