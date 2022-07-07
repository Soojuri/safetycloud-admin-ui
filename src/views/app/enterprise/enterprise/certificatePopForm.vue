<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='发证日期' prop='certificateGainDate'>
              <el-date-picker v-model="form.certificateGainDate" type="datetime" value-format="timestamp"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label='有效日期' prop='certificateValidDate'>
              <el-date-picker v-model="form.certificateValidDate" type="datetime" value-format="timestamp"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label='资质名称' prop='certificateName'>
              <el-input size='small' v-model.trim='form.certificateName' placeholder='请输入资质名称'></el-input>
            </el-form-item>
            <el-form-item label='资质类型' prop='certificateType'>
              <el-select v-model="form.certificateType" placeholder="请选择">
                <el-option label="安全生产资质证书" :value="1" />
                <el-option label="其他资质证书" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label='发证单位' prop='certificateInstitution'>
              <el-input size='small' v-model.trim='form.certificateInstitution' placeholder='请输入发证单位'></el-input>
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
import {
  addEnterpriseInfoCertificate,
  putEnterpriseInfoCertificate,
  getEnterpriseInfoCertificate,
} from '@/api/app/enterprise/enterprise.js'
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
    enterpriseId: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      form: {
        certificateValidDate: null,
        certificateGainDate: null,
        certificateInstitution: null,
        certificateName: null,
        certificateType: null,
        enterpriseId: null,
      },
      id: null,
      rules: {
        certificateName: [this.$formRules.checkLen(50), this.$formRules.checkNecessary('请输入资质名称')],
        certificateInstitution: [this.$formRules.checkLen(50), this.$formRules.checkNecessary('请输入发证单位')],
        certificateValidDate: [this.$formRules.checkNecessary('请选择有效日期')],
        certificateGainDate: [this.$formRules.checkNecessary('请选择发证日期')],
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
    this.form.enterpriseId = this.enterpriseId ? this.enterpriseId : null
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.id) {
        getEnterpriseInfoCertificate(this.id).then((res) => {
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
            putEnterpriseInfoCertificate(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addEnterpriseInfoCertificate(this.form).then((res) => {
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