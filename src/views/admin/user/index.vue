

<template>
  <div class="user">
    <basic-container>
      <el-row :span="24">
        <el-col :xs="24" :sm="24" :md="5" class="user__tree">
          <avue-tree :option="treeOption" :data="treeData" @node-click="nodeClick">
            <span class="el-tree-node__label" slot-scope="{ node, data }">
              <el-tooltip class="item" effect="dark" content="无数据权限" placement="right-start" v-if="data.isLock">
                <span>{{node.label}} <i class="el-icon-lock"></i></span>
              </el-tooltip>
              <span v-if="!data.isLock">{{node.label}}</span>
            </span>
          </avue-tree>
        </el-col>
        <el-col :xs="24" :sm="24" :md="19" class="user__main">
          <avue-crud ref="crud" :option="option" v-model="form" :page.sync="page" :table-loading="listLoading"
                     :before-open="handleOpenBefore" :data="list" @on-load="getList" @search-change="searchChange"
                     @refresh-change="refreshChange" @size-change="sizeChange" @current-change="currentChange"
                     @row-update="update" @row-save="create" @search-reset="handleSearchReset">
            <template slot="menuLeft">
              <el-button v-if="sys_user_add" class="filter-item" type="primary" size="small" icon="el-icon-edit"
                         @click="$refs.crud.rowAdd()">添加
              </el-button>
            </template>
            <template slot="username" slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
            <template slot="role" slot-scope="scope">
              <span v-for="(role,index) in scope.row.roleList" :key="index">
                <el-tag>{{ role.roleName }} </el-tag>&nbsp;&nbsp;
              </span>
            </template>
            <template slot="deptId" slot-scope="scope">
              {{ scope.row.deptName }}
            </template>
            <template slot="lockFlag" slot-scope="scope">
              <el-tag>{{ scope.label }}</el-tag>
            </template>
            <template slot="menu" slot-scope="scope">
              <el-button v-if="sys_user_edit" type="text" size="small" icon="el-icon-edit"
                         @click="handleUpdate(scope.row,scope.index)">编辑
              </el-button>
              <el-button type="text" size="small" icon="el-icon-edit" @click="handlePasswd(scope.row,scope.index)">重置密码
              </el-button>
              <el-button v-if="sys_user_del" type="text" size="small" icon="el-icon-delete"
                         @click="deletes(scope.row,scope.index)">删除
              </el-button>
            </template>
            <template slot="deptIdForm" slot-scope="scope">
              <avue-input-tree v-model="form.deptId" :node-click="getNodeData" :dic="treeDeptData" :props="defaultProps"
                               placeholder="请选择所属部门" />
            </template>
            <template slot="roleForm" slot-scope="scope">
              <avue-select v-model="role" :dic="rolesOptions" :props="roleProps" multiple placeholder="请选择角色" />
            </template>
          </avue-crud>
        </el-col>
      </el-row>
    </basic-container>
    <!-- 重置密码弹窗 -->
    <el-dialog title="重置密码" :close-on-click-modal="false" :visible.sync="visible" width="width">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <!-- <el-form-item label="原密码" prop="password">
          <el-input v-model="ruleForm.password" type="password" auto-complete="off" />
        </el-form-item> -->
        <el-form-item label="新密码" prop="newpassword1">
          <el-input :type="passwordType" v-model="ruleForm.newpassword1" auto-complete="off">
            <i slot="suffix" class="el-icon-view el-input__icon"
               @click="passwordType == '' ? (passwordType = 'password') : (passwordType = '')" />
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newpassword2">
          <el-input :type="passwordType1" v-model="ruleForm.newpassword2" auto-complete="off">
            <i slot="suffix" class="el-icon-view el-input__icon"
               @click="passwordType1 == '' ? (passwordType1 = 'password') : (passwordType1 = '')" />
          </el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class="dialog-footer">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm()">清 空</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { addObj, delObj, fetchList, putObj } from '@/api/admin/user'
import { deptRoleList } from '@/api/admin/role'
import { fetchTree } from '@/api/admin/dept'
import { tableOption } from '@/const/crud/admin/user'
import { getPublicKey } from '@/api/publicKey.js'
import { encrypt, decrypt, serveEncrypt } from '@/util/jsencrypt'
import { editInfo } from '@/api/admin/user'
import { rule } from '@/util/validateRules'
import { mapGetters } from 'vuex'
export default {
  name: 'SysUser',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.ruleForm.newpassword1) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordType: 'password',
      passwordType1: 'password',
      searchForm: {},
      treeOption: {
        nodeKey: 'id',
        addBtn: false,
        menu: false,
        props: {
          label: 'name',
          value: 'id',
        },
      },
      ruleForm: {
        username: '',
        // password: '',
        newpassword1: '',
        newpassword2: '',
      },
      treeData: [],
      option: tableOption,
      treeDeptData: [],
      checkedKeys: [],
      roleProps: {
        label: 'roleName',
        value: 'roleId',
      },
      defaultProps: {
        label: 'name',
        value: 'id',
      },
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条,
        isAsc: false, // 是否倒序
      },
      list: [],
      listLoading: true,
      role: [],
      form: {},
      rolesOptions: [],
      publicKey: '',
      visible: false,
      rules: {
        // password: [this.$formRules.checkNecessary('请输入原密码')],
        newpassword1: [
          this.$formRules.checkNecessary('请输入新密码'),
          {
            min: 8,
            max: 32,
            message: '长度在 8 到 32 个字符',
            trigger: 'blur',
          },
          {
            validator: rule.checkPassword,
            trigger: 'blur',
          },
        ],
        newpassword2: [
          this.$formRules.checkNecessary('请再次输入新密码'),
          { required: false, validator: validatePass, trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'permissions']),
  },
  watch: {
    role() {
      this.form.role = this.role
    },
  },
  created() {
    this.sys_user_add = this.permissions['sys_user_add']
    this.sys_user_edit = this.permissions['sys_user_edit']
    this.sys_user_del = this.permissions['sys_user_del']
    this.resetForm()
    this.init()
  },
  methods: {
    init() {
      fetchTree().then((response) => {
        this.treeData = response.data.data
      })
      getPublicKey().then((res) => {
        this.publicKey = res.data.data
      })
    },
    nodeClick(data) {
      this.page.currentPage = 1
      this.getList(this.page, { deptId: data.id })
    },
    handleSearchReset() {
      this.searchForm = {}
      this.page.currentPage = 1
      this.page.pageSize = 20
      this.getList(this.page)
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
    getNodeData() {
      deptRoleList().then((response) => {
        this.rolesOptions = response.data.data
      })
    },
    searchChange(param, done) {
      this.searchForm = param
      this.page.currentPage = 1
      this.getList(this.page, param)
      done()
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
    handleOpenBefore(show, type) {
      window.boxType = type
      // 查询部门树
      fetchTree().then((response) => {
        this.treeDeptData = response.data.data
      })
      // 查询角色列表
      deptRoleList().then((response) => {
        this.rolesOptions = response.data.data
      })

      if (['edit', 'views'].includes(type)) {
        this.role = []
        for (let i = 0; i < this.form.roleList.length; i++) {
          this.role[i] = this.form.roleList[i].roleId
        }
      } else if (type === 'add') {
        this.role = []
        this.form.username = undefined
        this.form.phone = undefined
        this.form.password = undefined
      }
      show()
    },
    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index)
      this.form.password = undefined
    },
    handlePasswd(row, index) {
      this.resetForm()
      this.visible = true
      this.ruleForm.username = row.username
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false
        }
        // this.ruleForm.password = serveEncrypt(this.ruleForm.password, this.publicKey)
        this.ruleForm.newpassword1 = serveEncrypt(this.ruleForm.newpassword1, this.publicKey)
        this.ruleForm.newpassword2 = serveEncrypt(this.ruleForm.newpassword2, this.publicKey)
        editInfo(this.ruleForm).then((response) => {
          if (this.userInfo.username == this.ruleForm.username) {
            this.msgSuccess('修改成功,请重新登录')
            this.$store.dispatch('LogOut').then(() => {
              location.reload()
            })
            return
          }
          this.msgSuccess('修改成功')
          this.visible = false
          // 修改后注销当前token,重新登录
          // this.$store.dispatch('LogOut').then(() => {
          //   location.reload()
          // })
        })
      })
    },
    resetForm() {
      // this.ruleForm.password = undefined
      this.ruleForm.newpassword1 = undefined
      this.ruleForm.newpassword2 = undefined
    },
    create(row, done, loading) {
      if (this.form.phone && this.form.phone.indexOf('*') > 0) {
        this.form.phone = undefined
      }
      this.form.password = serveEncrypt(this.form.password, this.publicKey)
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
      if (this.form.phone && this.form.phone.indexOf('*') > 0) {
        this.form.phone = undefined
      }
      // this.form.password = serveEncrypt(this.form.password, this.publicKey)
      putObj(this.form)
        .then(() => {
          if (this.userInfo.username == this.form.username && this.form.lockFlag === '9') {
            this.msgSuccess('修改成功,请重新登录')
            this.$store.dispatch('LogOut').then(() => {
              this.$router.push({ path: '/login' })
            })
            return
          }
          this.getList(this.page)
          done()
          this.msgSuccess('修改成功')
        })
        .catch(() => {
          loading()
        })
    },
    deletes(row, index) {
      this.$confirm('此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delObj(row.userId)
          .then(() => {
            this.list.splice(index, 1)
            this.msgSuccess('删除成功')
          })
          .catch(() => {
            this.msgError('删除失败')
          })
      })
    },
  },
}
</script>
<style lang="scss">
.user {
  height: 100%;

  &__tree {
    padding-top: 3px;
    padding-right: 20px;
  }

  &__main {
    .el-card__body {
      padding-top: 0;
    }
  }
}
</style>

