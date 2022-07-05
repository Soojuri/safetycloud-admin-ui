<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label="消息配置类型" prop="messageType">
              <el-select v-model="form.messageType" placeholder="请选择消息配置类型">
                <el-option label="其它消息配置" :value="0" />
                <el-option label="提醒消息配置" :value="1" />
                <el-option label="任务消息配置" :value="2" />
                <el-option label="事件消息配置" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label='消息标题' prop='messageName'>
              <el-input size='small' v-model.trim='form.messageName' placeholder='请输入消息标题'></el-input>
            </el-form-item>
            <el-form-item label='消息标识' prop='flagName'>
              <el-input size='small' v-model.trim='form.flagName' placeholder='请输入消息标识'></el-input>
            </el-form-item>
            <el-form-item label="接收方式" prop='receive'>
              <el-checkbox-group class="mt-s" v-model="receive" @change="handleSaveTypeChange">
                <el-checkbox label="短信">
                </el-checkbox>
                <el-checkbox label="邮箱">
                </el-checkbox>
                <el-checkbox label="站内信">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <!-- <el-form-item label="接收方式" :rules="[$formRules.checkNecessary('请选择接收方式')]">
              <el-checkbox label="短信" :true-label="1" :false-label="0" v-model="form.smsEnable">
              </el-checkbox>
              <el-checkbox label="邮箱" :true-label="1" :false-label="0" v-model="form.emailEnable"></el-checkbox>
              <el-checkbox label="站内信" :true-label="1" :false-label="0" v-model="form.systemEnable"></el-checkbox>
            </el-form-item> -->
            <el-form-item label="消息状态" prop="messageStatus">
              <el-switch class="mt-s" size="small" v-model="form.messageStatus" :active-value="1" :inactive-value="2">
              </el-switch>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div class="mt-m" v-if="id">
        <div class="g-opera">
          <el-button type="primary" @click="handleAdd">添加消息接收人</el-button>
        </div>
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="username" align="center" label="接收人" />
            <el-table-column prop="dept" align="center" label="部门" />
            <el-table-column prop="email" align="center" label="电子邮箱" />
            <el-table-column prop="phone" align="center" label="手机号码" />
            <el-table-column prop="status" align="center" label="状态" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1">
                  <a class="status-success"></a>
                  正常
                </span>
                <span v-if="scope.row.status == 2">
                  <a class="status-info"></a>
                  停用
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <!-- <el-button size="mini" icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑</el-button> -->
                <el-button size="mini" icon="el-icon-delete" type="text" @click="handleDelete(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>
      <!-- 弹窗 -->
      <pop-form v-if="formOptions.visible" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="getReceiver()">
      </pop-form>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PopForm from './receivePopForm.vue'
import { addConfig, putConfig, getConfig, getReceiverList, delReceiver } from '@/api/app/news/news.js'
export default {
  components: { PopForm },
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
      form: {
        messageType: null,
        messageName: null,
        flagName: null,
        smsEnable: null,
        emailEnable: null,
        systemEnable: null,
        messageStatus: null,
        receive: [],
      },
      receive: [],
      queryParams: {
        size: 10,
        current: 1,
        messageConfigId: null,
      },
      id: null,
      show: null,
      tableData: [],
      formOptions: {
        visible: false,
        data: {},
      },
      total: 0,
      loading: false,
      rules: {
        messageName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入消息名称')],
        messageType: [this.$formRules.checkNecessary('请选择配置类型')],
        flagName: [this.$formRules.checkNecessary('请输入消息标识')],
        receive: [{ type: 'array', required: true, message: '请至少选择一个接收方式', trigger: 'blur' }],
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
      if (this.id) {
        getConfig(this.id).then((res) => {
          this.form = res.data.data
          this.receive = []
          this.form.receive = []
          if (res.data.data.smsEnable == 1) {
            this.receive.push('短信')
          }
          if (res.data.data.emailEnable == 1) {
            this.receive.push('邮箱')
          }
          if (res.data.data.systemEnable == 1) {
            this.receive.push('站内信')
          }
          this.form.receive = this.receive
        })
        this.loading = true
        this.queryParams.messageConfigId = this.id
        getReceiverList(this.queryParams)
          .then((res) => {
            this.loading = false
            this.tableData = res.data.data.records
            this.total = res.data.data.total
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    getReceiver() {
      this.loading = true
      this.queryParams.messageConfigId = this.id
      getReceiverList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSaveTypeChange(val) {
      if (val.indexOf('短信') != -1) {
        this.form.smsEnable = 1
      } else {
        this.form.smsEnable = 0
      }
      if (val.indexOf('邮箱') != -1) {
        this.form.emailEnable = 1
      } else {
        this.form.emailEnable = 0
      }
      if (val.indexOf('站内信') != -1) {
        this.form.systemEnable = 1
      } else {
        this.form.systemEnable = 0
      }
      this.form.receive = this.receive
      console.log(this.form.receive)
      // this.form.receive = JSON.parse(JSON.stringify(this.form.receive))
    },
    handleAdd() {
      // if (!this.permissions.notice_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
      this.formOptions.data.id = this.form.configId
    },
    handleEdit(row) {
      // if (!this.permissions.notice_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.id
      this.formOptions.visible = true
    },
    handleDelete(row) {
      // if (!this.permissions.notice_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该消息接收人', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delReceiver(row.id)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.getReceiver()
            // that.handleClear()
          }
        })
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleSave() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (that.id) {
            putConfig(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addConfig(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('新增成功')
              }
            })
          }
        }
      })
    },
  },
}
</script>
<style lang='scss' scoped>
::v-deep .dialog-footer {
  text-align: center;
}
</style>