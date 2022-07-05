<template>
  <div>
    <el-dialog :visible="visible" width="1000px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">

      <div class="sub-page">
        <div class="g-card">
          <el-form ref="queryParams" :model="queryParams" inline>
            <el-form-item label="用户名称" prop="username" :rules="[$formRules.checkLen()]">
              <el-input v-model="queryParams.username" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="queryParams.phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>

            <el-form-item class="ml-xl">
              <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
              <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
            </el-form-item>
          </el-form>
          <div class="mt-m">
            <div class="g-table">
              <el-table v-loading="loading" border :data="tableData" highlight-current-row
                        @current-change="handleCurrentChange">
                <el-table-column type="index" align="center" width="50">
                </el-table-column>
                <el-table-column prop="deptName" align="center" label="所属部门" />
                <el-table-column prop="username" align="center" label="用户姓名" />
                <el-table-column prop="phone" align="center" label="用户手机" />
              </el-table>
            </div>
            <div class="g-page-x mt-m">
              <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                          :limit.sync="queryParams.size" @pagination="getList" />
            </div>
          </div>
        </div>
      </div>

      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addReceiver, putReceiver, getReceiver } from '@/api/app/news/news.js'
import { fetchList } from '@/api/admin/user'
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        username: null,
        phone: null,
      },
      form: {
        userName: null,
        dept: null,
        phone: null,
        status: null,
        configId: null,
        userId: null,
      },
      id: null,
      tableData: [],
      loading: false,
      rules: {
        userName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入接收人')],
      },
    }
  },
  computed: {
    title() {
      return this.id ? '编辑' : '新增'
    },
  },
  watch: {},
  created() {
    this.id = this.data ? this.data.id : null
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      // if (this.id) {
      //   getReceiver(this.id).then((res) => {
      //     this.form = res.data.data
      //   })
      // }
      this.loading = true
      fetchList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.form.userName = val.username
      this.form.phone = val.phone
      this.form.dept = val.deptName
      this.form.configId = this.id
      this.form.userId = val.userId
      this.form.status = val.lockFlag === '9' ? '1' : '2'
    },
    handleQuery() {
      const that = this
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          that.getList()
        }
      })
    },
    handleClear() {
      this.resetForm('queryParams')
      this.getList()
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleSave() {
      const that = this

      if (that.id) {
        addReceiver(this.form).then((res) => {
          if (res.data.data) {
            that.handleClose()
            that.msgSuccess('添加成功')
          }
        })
      }
    },
  },
}
</script>
<style lang='scss' scoped>
::v-deep .dialog-footer {
  text-align: center;
}
</style>