<!-- 通知管理-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='公告标题' prop='noticeTitle'>
              <el-input size='small' v-model.trim='form.noticeTitle' placeholder='请输入公告标题'></el-input>
            </el-form-item>
            <el-form-item label='公告类型' prop='noticeType'>
              <el-select v-model="form.noticeType" placeholder="请选择">
                <el-option v-for="item in arr" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch class="mt-s" size="small" v-model="form.status" active-value="1" inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="内容" prop="noticeContent">
              <el-input v-model="form.noticeContent" placeholder="请输入通知公告内容" maxlength="200" show-word-limit
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
import { addNotice, putNotice, getNoticeInfo } from '@/api/admin/notice'
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
      arr: [
        {
          value: '1',
          label: '通知',
        },
        {
          value: '2',
          label: '公告',
        },
      ],
      form: {
        noticeTitle: null,
        noticeType: null,
        noticeContent: null,
        status: null,
      },
      id: null,
      show: null,
      rules: {
        noticeTitle: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入公告标题')],
        noticeType: [this.$formRules.checkNecessary('请选择公告类型')],
        status: [this.$formRules.checkNecessary('请选择状态')],
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