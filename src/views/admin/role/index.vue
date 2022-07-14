

<template>
  <div class=" calendar-list-container">
    <basic-container>
      <avue-crud ref="crud" :option="tableOption" :data="list" :page.sync="page" v-model="form"
                 :table-loading="listLoading" :before-open="handleOpenBefore" @on-load="getList"
                 @search-change="searchChange" @refresh-change="refreshChange" @size-change="sizeChange"
                 @current-change="currentChange" @row-update="update" @search-reset="handleClear" @row-save="create">

        <template slot="menuLeft">
          <el-button v-if="roleManager_btn_add" class="filter-item" type="primary" icon="el-icon-plus"
                     @click="handleCreate">添加
          </el-button>
        </template>
        <template slot="dsScopeForm" slot-scope="scope">
          <div v-if="form.dsType == 1">
            <el-tree ref="scopeTree" :data="dsScopeData" :check-strictly="true" :props="defaultProps"
                     :default-checked-keys="checkedDsScope" class="filter-tree" node-key="id" highlight-current
                     show-checkbox />
          </div>
        </template>

        <template slot="menu" slot-scope="scope">
          <el-button v-if="roleManager_btn_edit" type="text" size="small" @click="handleUpdate(scope.row,scope.index)">
            编辑
          </el-button>
          <el-button v-if="roleManager_btn_del" type="text" size="small" @click="handleDelete(scope.row,scope.index)">删除
          </el-button>
          <el-button v-if="roleManager_btn_perm" type="text" size="small"
                     @click="handlePermission(scope.row,scope.index)">权限
          </el-button>
        </template>
        <template slot="roleNameSearch" slot-scope="{row,size}">
          <el-input placeholder="请输入 角色名称" :size="size" v-model="searchForm.roleName" @keyup.native="trimInput(searchForm,'roleName')"></el-input>
        </template>
        <template slot="roleCodeSearch" slot-scope="{row,size}">
          <el-input placeholder="请输入 角色标识" :size="size" v-model="searchForm.roleCode" @keyup.native="trimInput(searchForm,'roleCode')"></el-input>
        </template>
        <template slot="dsTypeSearch" slot-scope="{row,size}">
          <el-select v-model="searchForm.dsType" placeholder="请选择 数据权限" >
            <el-option v-for="item in dict.dictType" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog :visible.sync="dialogPermissionVisible" :close-on-click-modal="false" title="分配权限">
      <div class="dialog-main-tree">
        <el-tree ref="menuTree" :data="treeData" :default-checked-keys="checkedKeys" check-strictly @check="handleCheck"
                 @check-change="handleCheckChange" :props="defaultProps" :filter-node-method="filterNode"
                 class="filter-tree" node-key="id" highlight-current show-checkbox default-expand-all />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="updatePermession(roleId)">更 新
        </el-button>
        <el-button type="default" size="small" @click="cancal()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, fetchRoleTree, permissionUpd, putObj } from '@/api/admin/role'
import { tableOption } from '@/const/crud/admin/role'
import { fetchTree } from '@/api/admin/dept'
import { fetchMenuTree } from '@/api/admin/menu'
import { mapGetters } from 'vuex'
import {pickBy} from "lodash";
import {validatenull} from "@/util/validate";

export default {
  name: 'TableRole',
  data() {
    return {
      searchForm: {},
      tableOption: tableOption,
      dsScopeData: [],
      treeData: [],
      checkedKeys: [],
      checkedDsScope: [],
      defaultProps: {
        label: 'name',
        value: 'id',
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      menuIds: '',
      list: [],
      listLoading: true,
      form: {},
      roleId: undefined,
      roleCode: undefined,
      rolesOptions: undefined,
      dialogPermissionVisible: false,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false,
      dict:{
        dictType:[{
          label: '全部',
          value: '0'
        }, {
          label: '自定义',
          value: '1'
        }, {
          label: '本级及子级',
          value: '2'
        }, {
          label: '本级',
          value: '3'
        }]
      }
    }
  },
  created() {
    this.roleManager_btn_add = this.permissions['sys_role_add']
    this.roleManager_btn_edit = this.permissions['sys_role_edit']
    this.roleManager_btn_del = this.permissions['sys_role_del']
    this.roleManager_btn_perm = this.permissions['sys_role_perm']
  },
  computed: {
    ...mapGetters(['elements', 'permissions']),
  },
  methods: {
    selectChildren(data) {
      data &&
        data.children &&
        data.children.map((item) => {
          this.$refs.menuTree.setChecked(item.id, true)
          if (data.children) {
            this.selectChildren(item)
          }
        })
    },
    handleCheck(data, { checkedKeys }) {
      if (checkedKeys.includes(data.id)) {
        //如果当前节点有子集
        this.selectChildren(data)
      }
    },
    handleCheckChange(data, checked, indeterminate) {
      // 节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
      //如果为取消
      if (checked === false) {
        //如果当前节点有子集
        if (data.children) {
          //循环子集将他们的选中取消
          data.children.map((item) => {
            this.$refs.menuTree.setChecked(item.id, false)
          })
        }
      } else {
        //否则(为选中状态)
        //判断父节点id是否为空
        if (data.parentId !== 0) {
          //如果不为空则将其选中
          this.$refs.menuTree.setChecked(data.parentId, true)
        }
      }
    },
    getList(page, params) {
      this.listLoading = true
      fetchList(
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
          this.list = response.data.data.records
          this.page.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    refreshChange() {
      this.getList(this.page)
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
    handleCreate() {
      this.$refs.crud.rowAdd()
    },
    handleOpenBefore(show) {
      fetchTree().then((response) => {
        this.dsScopeData = response.data.data
        if (this.form.dsScope) {
          this.checkedDsScope = this.form.dsScope.split(',')
        } else {
          this.checkedDsScope = []
        }
      })
      show()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    cancal() {
      this.dialogPermissionVisible = false
    },
    handlePermission(row) {
      fetchRoleTree(row.roleId)
        .then((response) => {
          this.checkedKeys = response.data.data
          return fetchMenuTree()
        })
        .then((response) => {
          this.treeData = response.data.data
          // 解析出所有的太监节点
          this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
          this.dialogPermissionVisible = true
          this.roleId = row.roleId
          this.roleCode = row.roleCode
        })
    },
    /**
     * 解析出所有的太监节点id
     * @param json 待解析的json串
     * @param idArr 原始节点数组
     * @param temp 临时存放节点id的数组
     * @return 太监节点id数组
     */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        temp.push(idArr.filter((id) => id === item.id))
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        }
      }
      return temp
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData(data, done) {
      done()
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除名称为"' + row.roleName + '"' + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delObj(row.roleId)
        })
        .then(() => {
          this.getList(this.page)
          this.msgSuccess('删除成功')
        })
    },
    create(row, done, loading) {
      if (this.form.dsType === 1) {
        this.form.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      addObj(this.form)
        .then(() => {
          this.getList(this.page)
          done()
          this.msgSuccess('创建成功')
        })
        .catch(() => {
          loading()
        })
    },
    update(row, index, done, loading) {
      if (this.form.dsType === 1) {
        this.form.dsScope = this.$refs.scopeTree.getCheckedKeys().join(',')
      }
      putObj(this.form)
        .then(() => {
          this.getList(this.page)
          done()
          this.msgSuccess('修改成功')
        })
        .catch(() => {
          loading()
        })
    },
    updatePermession(roleId) {
      this.menuIds = ''
      this.menuIds = this.$refs.menuTree
        .getCheckedKeys()
        .join(',')
        .concat(',')
        .concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
      permissionUpd(roleId, this.menuIds).then(() => {
        this.dialogPermissionVisible = false
        this.getUserInfo()
        this.msgSuccess('修改成功')
      })
    },
    getUserInfo() {
      // 更新sessionStore 权限信息
      this.$store.dispatch('GetUserInfo')
      this.$store.dispatch('GetMenu', { type: true }).then((data) => {
        if (data.length !== 0) {
          this.$router.$avueRouter.formatRoutes(data, true)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.el-dialog__wrapper {
  .el-dialog {
    width: 61% !important;
    .dialog-main-tree {
      max-height: 400px;
      overflow-y: auto;
    }
  }
  .el-form-item__label {
    width: 20% !important;
    padding-right: 20px;
  }
  .el-form-item__content {
    margin-left: 20% !important;
  }
}
::v-deep .el-icon-search {
  display: none;
}
::v-deep .el-icon-delete {
  display: none;
}
::v-deep .el-icon-view {
  display: none;
}
</style>
