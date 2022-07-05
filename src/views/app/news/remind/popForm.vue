<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='消息标题' prop='messageTitle'>
              <el-input size='small' v-model.trim='form.messageTitle' placeholder='请输入消息标题'></el-input>
            </el-form-item>
            <el-form-item label='消息类型' prop='messageType'>
              <el-select v-model="form.messageType" placeholder="请选择">
                <el-option label="其他消息" :value="0" />
                <el-option label="账号消息" :value="1" />
                <el-option label="订单消息" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="readStatus">
              <el-switch class="mt-s" size="small" v-model="form.readStatus" :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="消息内容" prop="messageContent">
              <el-input v-model="form.messageContent" placeholder="请输入消息内容" maxlength="200" show-word-limit
                        type="textarea" :rows="15">
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
import { addNotice, putNotice, getNoticeInfo } from '@/api/app/news/news.js'
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
      form: {
        messageTitle: null,
        messageType: null,
        messageContent: null,
        readStatus: null,
      },
      id: null,
      show: null,
      rules: {
        messageTitle: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入消息标题')],
        messageType: [this.$formRules.checkNecessary('请选择消息类型')],
        readStatus: [this.$formRules.checkNecessary('请选择状态')],
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
        getNoticeInfo(this.id).then((res) => {
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
            putNotice(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addNotice(this.form).then((res) => {
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