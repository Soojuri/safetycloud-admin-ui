<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='公告类型' prop='noticeType'>
              <el-select v-model="form.noticeType" placeholder="请选择">
                <el-option label="通知" :value="1" />
                <el-option label="公告" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label='发布时间' prop='releaseTime'>
              <el-date-picker v-model="form.releaseTime" type="datetime" value-format="timestamp" placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label='公告标题' prop='noticeTitle'>
              <el-input size='small' v-model.trim='form.noticeTitle' placeholder='请输入公告标题'></el-input>
            </el-form-item>
            <el-form-item label="公告内容" prop="noticeContent">
              <editor :value="form.noticeContent" :height="200" v-model="form.noticeContent"></editor>
            </el-form-item>
            <el-form-item label="发布状态" prop="status">
              <el-switch class="mt-s" size="small" v-model="form.status" :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label='公告附件'>
              <el-upload action="api/notifyMessage/sysnotice/upload" :on-error="handleUploadError"
                         :on-success="handleUploadSuccess" :headers="headers">
                <el-button type="primary" icon="el-icon-upload">上传文件</el-button>
                </el-button>
              </el-upload>
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
import store from '@/store'
import { addAnnouncement, putAnnouncement, getAnnouncement } from '@/api/app/news/news.js'
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
      headers: {
        Authorization: 'Bearer ' + store.getters.access_token,
        'TENANT-ID': 2
      },
      form: {
        noticeTitle: null,
        noticeType: null,
        noticeContent: null,
        releaseTime: null,
        releaseStatus: null,
      },

      id: null,
      show: null,
      rules: {
        noticeTitle: [this.$formRules.checkLen(50), this.$formRules.checkNecessary('请输入公告标题')],
        noticeType: [this.$formRules.checkNecessary('请选择公告类型')],
        releaseTime: [this.$formRules.checkNecessary('请选择发布时间')],
        // releaseStatus: [this.$formRules.checkNecessary('请选择状态')],
        noticeContent: [this.$formRules.checkLen(200), this.$formRules.checkNecessary('请输入公告内容')],
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
        getAnnouncement(this.id).then((res) => {
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
            putAnnouncement(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addAnnouncement(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('新增成功')
              }
            })
          }
        }
      })
    },
    handleUploadError() {
      this.$notify({
        type: 'error',
        message: '上传失败',
      })
      this.loading.close()
    },
    handleUploadSuccess(res, file) {
      this.loading.close()
      if (res.code == 1) {
        return this.msgError(res.msg)
      } else {
        this.$message.success('上传成功')
      }
    },
    //上传成功
    handleSuccess(res, file, fileList) {
      if (res.code == 0) {
        this.visible = false
        this.$emit('refreshDataList')
        this.msgSuccess('上传成功!')
      } else {
        this.msgWarn('上传失败')
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
