<!-- 事件重复规则 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='140px' ref='form'>
            <el-form-item label='配置名称' prop='ruleName'>
              <el-input size='small' v-model.trim='form.ruleName' placeholder='请输入配置名称'></el-input>
            </el-form-item>
            <el-form-item label='配置状态' prop='status'>
              <el-switch class="mt-s" v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label='选择算法' prop='algorithmIds'>
              <el-select v-model="form.algorithmIds" multiple placeholder="请选择">
                <el-option v-for="item in dict.algorithmUse" :key="item.algorithmId" :label="item.algorithmName"
                           :value="item.algorithmId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='事件自动提交到城运' prop='autocommitTime'>
              <el-input-number :min="0" :max="360000" v-model="form.autocommitTime"></el-input-number> 分钟
            </el-form-item>
            <el-form-item label="参数错误自动重试" prop="parameterErrorSwitch">
              <el-switch class="mt-s" v-model="form.parameterErrorSwitch" :active-value="1" :inactive-value="0">
              </el-switch>
              <el-form-item class="mt-m" v-if="form.parameterErrorSwitch === 1">
                <el-input-number :min="0" :max="100" v-model="form.parameterErrorCount"></el-input-number> 次，隔
                <el-input-number :min="0" :max="360000" v-model="form.parameterErrorTime"></el-input-number> 分钟
              </el-form-item>
            </el-form-item>
            <el-form-item label="服务异常自动重试" prop="serviceExceptionSwitch">
              <el-switch class="mt-s" v-model="form.serviceExceptionSwitch" :active-value="1" :inactive-value="0">
              </el-switch>
              <el-form-item class="mt-m" v-if="form.serviceExceptionSwitch === 1">
                <el-input-number :min="0" :max="100" v-model="form.serviceExceptionCount"></el-input-number> 次，隔
                <el-input-number :min="0" :max="360000" v-model="form.serviceExceptionTime"></el-input-number> 分钟
              </el-form-item>
            </el-form-item>

            <el-form-item label='配置描述' prop='remark'>
              <el-input size='small' type="textarea" :rows="3" show-word-limit maxlength="200" v-model='form.remark'
                        placeholder='请输入配置描述'></el-input>
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
import { addAutoSubmit, putAutoSubmit, getAutoSubmitInfo } from '@/api/app/rules/autoSubmit'
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
    dict: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      form: {
        ruleName: null,
        status: null,
        autocommitTime: null,
        detectTime: null,
        algorithmUse: null,
        remark: null,
      },
      isMultiple: true,
      id: null,
      rules: {
        ruleName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入配置名称')],
        status: [this.$formRules.checkNecessary('请选择状态')],
        repeatRule: [this.$formRules.checkNecessary('请选择重复规则', 'blur')],
        detectTime: [this.$formRules.checkNecessary('请选择发现时间')],
        algorithmUse: [this.$formRules.checkNecessary('请选择适用算法', 'blur')],
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
        getAutoSubmitInfo(this.id).then((res) => {
          this.form = res.data.data
        })
      }
    },
    handleChangeRule(val) {
      if (val.includes('ALL')) {
        this.form.repeatRule = ['ALL']
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
            putAutoSubmit(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addAutoSubmit(this.form).then((res) => {
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