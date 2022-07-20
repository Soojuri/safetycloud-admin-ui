<!-- 算法分类购买订单-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='算法订单ID' prop='orderId'>
              <el-input size='small' v-model='form.orderId' :disabled="!validatenull(id)" placeholder='请输入算法订单ID'>
              </el-input>
            </el-form-item>
            <el-form-item label='视频流路数' prop='streamingCount'>
              <el-input-number size='small' v-model='form.streamingCount' :min="0" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label='过期日期' prop='expirationTime'>
              <el-date-picker v-model="form.expirationTime" type="date" placeholder="选择日期" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label='适用算法' prop='algorithmIds'>
              <el-select v-model="form.algorithmIds" multiple placeholder="请选择适用算法">
                <el-option v-for="item in dict.algorithmUse" :key="item.algorithmId" :label="item.algorithmName"
                           :value="item.algorithmId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='计费模式' prop='chargeMode'>
              <el-select v-model="form.chargeMode" placeholder="请选择计费模式">
                <el-option label="包年包月" :value="1" />
                <el-option label="按量计费" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="正常" :value="1" />
                <el-option label="过期" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="订单描述" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入至少五个字符" show-word-limit minlength="5" maxlength="200"
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
import { validatenull } from '@/util/validate'
import { getOrderInfo, addOrder, putOrder } from '@/api/app/algorithm/bag.js'
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
        orderId: null,
        streamingCount: null,
        chargeMode: null,
        remark: null,
        // packageId: null,
        expirationTime: null,
        algorithmUse: null,
      },
      id: null,
      rules: {
        orderId: [this.$formRules.checkLen(50), this.$formRules.checkNecessary('请输入订单ID')],
        streamingCount: [this.$formRules.checkNecessary('请输入视频流路数')],
        expirationTime: [this.$formRules.checkNecessary('请选择过期时间')],
        chargeMode: [this.$formRules.checkNecessary('请选择计费模式')],
        status: [this.$formRules.checkNecessary('请选择状态')],
        algorithmIds: [this.$formRules.checkNecessary('请选择适用算法', 'blur')],
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
      // this.form.packageId = this.$route.query.id
      if (this.id) {
        getOrderInfo(this.id).then((res) => {
          this.form = res.data.data
          this.form.algorithmIds = this.form.algorithmIds.split(',')
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
          this.form.algorithmIds = this.form.algorithmIds.toString()
          if (that.id) {
            putOrder(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addOrder(this.form).then((res) => {
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