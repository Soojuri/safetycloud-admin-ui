<!-- 文件储存配置-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='文件存储类型' prop='ossType'>
              <el-radio-group class="mt-s" v-model="form.ossType">
                <el-radio :label="0">系统MINIO</el-radio>
                <el-radio :label="1">华为OBS</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label='endpoint' prop='endpoint'>
              <el-input size='small' v-model.trim='form.endpoint' placeholder='请输入'></el-input>
            </el-form-item>
            <el-form-item label='access-key' prop='accessKey'>
              <el-input size='small' v-model.trim='form.accessKey' placeholder='请输入'></el-input>
            </el-form-item>
            <el-form-item label='secret-key' prop='secretKey'>
              <el-input size='small' v-model.trim='form.secretKey' placeholder='请输入'></el-input>
            </el-form-item>
            <el-form-item label='bucket-name' prop='bucketName'>
              <el-input size='small' v-model.trim='form.bucketName' placeholder='请输入'></el-input>
            </el-form-item>
            <el-form-item label='前缀地址配置' prop='prefixUrl'>
              <el-input size='small' v-model.trim='form.prefixUrl' placeholder='请输入'></el-input>
            </el-form-item>
            <div class="test">
              <el-upload action="/api/iefVasService/ossFromDb/putObject" :on-error="handleUploadError"
                         :on-success="handleUploadSuccess">
                <el-button type="primary">测 试</el-button>
              </el-upload>
            </div>
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
import { addStorage, putStorage, getStorageInfo } from '@/api/admin/storage.js'
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
        ossType: null,
        endpoint: null,
        accessKey: null,
        secretKey: null,
        bucketName: null,
        prefixUrl: null,
        status: 1,
      },
      id: null,
      rules: {
        ossType: [this.$formRules.checkNecessary('请选择文件存储类型')],
        endpoint: [this.$formRules.checkLen(100)],
        accessKey: [this.$formRules.checkLen(100)],
        secretKey: [this.$formRules.checkLen(100)],
        bucketName: [this.$formRules.checkLen(100)],
        prefixUrl: [this.$formRules.checkLen(100)],
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
        getStorageInfo(this.id).then((res) => {
          this.form = res.data.data
        })
      }
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
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
    handleSave() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (that.id) {
            putStorage(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addStorage(this.form).then((res) => {
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
.dialog-footer {
  text-align: center;
}
.test {
  float: right;
}
</style>