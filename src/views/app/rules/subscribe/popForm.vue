<!-- 事件订阅配置 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='配置名称' prop='subscriptionName'>
              <el-input size='small' v-model.trim='form.subscriptionName' placeholder='请输入配置名称'></el-input>
            </el-form-item>

            <el-form-item label='算法分类' prop='algorithmPackageId'>
              <el-select v-model="form.algorithmPackageId" placeholder="请选择">
                <el-option v-for="item in dict.algorithmPackageId" :key="item.packageId" :label="item.packageName"
                           :value="item.packageId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='算法能力' prop='algorithmId'>
              <el-select v-model="form.algorithmId" placeholder="请选择">
                <el-option v-for="item in dict.algorithmId" :key="item.algorithmId" :label="item.algorithmName"
                           :value="item.algorithmId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='订阅类型' prop='subscribeType'>
              <el-select v-model="form.subscribeType" placeholder="请选择">
                <el-option label="URL接口推送" :value="1"></el-option>
                <el-option label="消息服务订阅" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='订阅方URL' prop='subscriberUrl' v-if="form.subscribeType === 1">
              <el-input size='small' v-model='form.subscriberUrl' placeholder='请输入订阅URL'></el-input>
            </el-form-item>
            <el-form-item label='状态' prop='status'>
              <el-switch class="mt-s" v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label='备注' prop='remark'>
              <el-input size='small' type="textarea" :rows="3" show-word-limit maxlength="200" v-model='form.remark'
                        placeholder='请输入备注'></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addSubscribe, getSubscribeInfo, putSubscribe } from '@/api/app/rules/subscribe.js'
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
        subscriptionName: null,
        status: null,
        algorithmId: null,
        algorithmPackageId: null,
        remark: null,
      },
      id: null,
      rules: {
        subscriptionName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入配置名称')],
        status: [this.$formRules.checkNecessary('请选择状态')],
        subscribeType: [this.$formRules.checkNecessary('请选择订阅类型')],
        algorithmId: [this.$formRules.checkNecessary('请选择适用算法', 'blur')],
        algorithmPackageId: [this.$formRules.checkNecessary('请选择算法分类', 'blur')],
        subscriberUrl: [this.$formRules.checkNecessary('请输入订阅方URL')],
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
        getSubscribeInfo(this.id).then((res) => {
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
            putSubscribe(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addSubscribe(this.form).then((res) => {
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