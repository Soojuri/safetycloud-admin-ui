
<template>
  <div class="execution">
    <basic-container>
      <avue-crud ref="crud" :page.sync="page" :data="tableData" :permission="permissionList"
                 :table-loading="tableLoading" :before-open="beforeOpen" :option="tableOption" @on-load="getList"
                 @search-change="searchChange" @search-reset="searchReset" @refresh-change="refreshChange"
                 @size-change="sizeChange" @current-change="currentChange" @row-update="handleUpdate"
                 @row-save="handleSave" @row-del="rowDel">
        <template slot="publicNameSearch" slot-scope="{row,size}">
          <el-input placeholder="请输入 名称" :size="size" v-model.trim="searchForm.publicName"
                    @keyup.native="trimInput(searchForm,'publicName')"></el-input>
        </template>
        <template slot="systemSearch" slot-scope="{row,size}">
          <el-select v-model="searchForm.system" placeholder="请选择">
            <el-option v-for="item in dict.dictType" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj } from '@/api/admin/sys-public-param'
import { tableOption } from '@/const/crud/admin/sys-public-param'
import { mapGetters } from 'vuex'
import { validatenull } from '@/util/validate'
import { pickBy } from 'lodash'

export default {
  name: 'Syspublicparam',
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
      dict: {},
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.admin_syspublicparam_add, false),
        delBtn: this.vaildData(this.permissions.admin_syspublicparam_del, false),
        editBtn: this.vaildData(this.permissions.admin_syspublicparam_edit, false),
      }
    },
  },
  mounted() {
    this.getDicts('dict_type').then((res) => {
      this.dict.dictType = res.data.data
    })
    this.getList()
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
      this.$confirm('是否确认删除ID为' + row.publicId, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delObj(row.publicId)
        })
        .then((data) => {
          this.getList(this.page)
          this.msgSuccess('删除成功')
          this.getList(this.page)
        })
    },
    beforeOpen(show, type) {
      window.boxType = type
      show()
    },
    /**
     * @title 数据更新
     * @param row 为当前的数据
     * @param index 为当前更新数据的行数
     * @param done 为表单关闭函数
     *
     **/
    handleUpdate: function (row, index, done, loading) {
      putObj(row)
        .then((data) => {
          this.msgSuccess('修改成功')
          done()
          this.getList(this.page)
        })
        .catch(() => {
          loading()
        })
    },
    /**
     * @title 数据添加
     * @param row 为当前的数据
     * @param done 为表单关闭函数
     *
     **/
    handleSave: function (row, done, loading) {
      addObj(row)
        .then((data) => {
          this.msgSuccess('添加成功')
          done()
          this.getList(this.page)
        })
        .catch(() => {
          loading()
        })
    },
    searchChange(form, done) {
      // this.searchForm = form
      this.searchForm = pickBy({
        ...this.searchForm,
      })
      this.page.currentPage = 1
      this.getList(this.page, this.searchForm)
      done()
    },
    searchReset() {
      this.page.currentPage = 1
      this.searchForm = {}
      this.getList(this.page)
    },
    refreshChange() {
      this.getList(this.page)
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
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
::v-deep .el-icon-edit {
  display: none;
}
</style>
