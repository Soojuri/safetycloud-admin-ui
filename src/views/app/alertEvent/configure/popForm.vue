<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='规则名称' prop='configName'>
              <el-input size='small' v-model.trim='form.configName' placeholder='请输入规则名称'></el-input>
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
              <el-switch class="mt-s" size="small" v-model="form.status" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="备注" prop="alertDescribe">
              <el-input v-model="form.alertDescribe" placeholder="请输入至少五个字符" show-word-limit maxlength="200"
                        type="textarea" :rows="5">
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Editor from '@/components/Editor'
import { addAlertEventConfig, putAlertEventConfig, getAlertEventConfig } from '@/api/app/alertEvent/alertEvent.js'
export default {
  components: { Editor },
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
        configName: null,
        status: null,
        alertDescribe: null,
      },
      id: null,
      show: null,
      rules: {
        configName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入规则名称')],
        // status: [this.$formRules.checkNecessary('请选择状态')],
        alertDescribe: [this.$formRules.checkNecessary('请输入备注')],
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
        getAlertEventConfig(this.id).then((res) => {
          this.form = res.data.data
        })
      }
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
            putAlertEventConfig(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addAlertEventConfig(this.form).then((res) => {
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