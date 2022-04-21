<!-- 事件重复规则 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='配置名称' prop='ruleName'>
              <el-input size='small' v-model.trim='form.ruleName' placeholder='请输入配置名称'></el-input>
            </el-form-item>
            <el-form-item label='配置状态' prop='status'>
              <el-switch class="mt-s" v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label='重复规则' prop='repeatRule'>
              <el-select @change="handleChangeRule" v-model="form.repeatRule" multiple placeholder="请选择">
                <el-option v-for="item in dict.repeatRule" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发现时间" prop="detectTime">
              <el-radio-group v-model="form.detectTime">
                <el-radio-button size="small" v-for="item in dict.detectTime" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label='适用算法' prop='algorithmUse'>
              <el-radio-group class="mt-s" v-model="form.algorithmUse">
                <el-radio label="1">全部算法</el-radio>
                <el-radio label="2">部分算法</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.algorithmUse == 2" label='选择算法' prop='algorithmIds'>
              <el-select v-model="form.algorithmIds" multiple placeholder="请选择">
                <el-option v-for="item in dict.algorithmUse" :key="item.algorithmId" :label="item.algorithmName"
                           :value="item.algorithmId">
                </el-option>
              </el-select>
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
import { addReEvent, getReEventInfo, putReEvent } from '@/api/app/rules/reEvent'
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
        repeatRule: null,
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
        getReEventInfo(this.id).then((res) => {
          this.form = res.data.data
          this.form.repeatRule = this.form.repeatRule.split(',')
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
          this.form.repeatRule = this.form.repeatRule.join()
          if (that.id) {
            putReEvent(this.form)
              .then((res) => {
                if (res.data.data) {
                  that.handleClose()
                  that.msgSuccess('修改成功')
                }
              })
              .catch(() => {
                this.form.repeatRule = this.form.repeatRule.split(',')
              })
          } else {
            addReEvent(this.form)
              .then((res) => {
                if (res.data.data) {
                  that.handleClose()
                  that.msgSuccess('新增成功')
                }
              })
              .catch(() => {
                this.form.repeatRule = this.form.repeatRule.split(',')
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