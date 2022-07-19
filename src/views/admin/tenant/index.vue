
<template>
  <div class="execution">
    <basic-container>
      <avue-crud ref="crud" :page.sync="page" :data="tableData" :permission="permissionList"
                 :table-loading="tableLoading" :option="tableOption" @on-load="getList" @search-change="searchChange"
                 @refresh-change="refreshChange" @search-reset="handleClear" @size-change="sizeChange"
                 @current-change="currentChange" @row-update="handleUpdate" @row-save="handleSave" @row-del="rowDel" >
        <template slot="nameSearch" slot-scope="{row,size}">
          <el-input placeholder="请输入 租户名称" :size="size" v-model="searchForm.name" @keyup.native="trimInput(searchForm,'name')"></el-input>
        </template>
        <template slot="tenantTypeSearch" slot-scope="{row,size}">
          <el-select v-model="searchForm.tenantType" placeholder="请选择 租户类型" >
            <el-option v-for="item in dict.tenantType" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </template>
        <template slot="statusSearch" slot-scope="{row,size}">
          <el-select v-model="searchForm.status" placeholder="请选择 状态" >
            <el-option v-for="item in dict.statusType" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchPage, putObj } from '@/api/admin/tenant'
import { tableOption } from '@/const/crud/admin/tenant'
import { mapGetters } from 'vuex'
import {validatenull} from "@/util/validate";
import {pickBy} from "lodash";

export default {
  name: 'Tenant',
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
      dict:{
        tenantType:[{
          label: '个人',
          value: 1
        }, {
          label: '企业',
          value: 2
        }, {
          label: '主管部门',
          value: 3
        }]
      }
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permissions.admin_systenant_add, false),
        delBtn: this.vaildData(this.permissions.admin_systenant_del, false),
        editBtn: this.vaildData(this.permissions.admin_systenant_edit, false),
      }
    },
  },
  mounted() {
    this.getDicts('status_type').then((res) => {
      this.dict.statusType = res.data.data
    })
    this.getList()
  },
  methods: {
    getList(page, params) {
      this.tableLoading = true
      fetchPage(
        Object.assign(
          {
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
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
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
    refreshChange() {
      this.getList(this.page)
    },
    handleClear() {
      this.searchForm = {}
      this.getList(1)
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
