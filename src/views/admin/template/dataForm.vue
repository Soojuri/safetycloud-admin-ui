<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="模板名称" prop="templateName">
        <el-input v-model="dataForm.templateName" placeholder="模板名称"></el-input>
      </el-form-item>
      <el-form-item label='模板上传'>
        <el-upload action="/api/admin/systemplate/upload" :limit="1" :data="dataForm" ref="upload"
                   :before-upload="handleBeforeUpload" :on-success="handleSuccess" :headers="headers">
          <el-button type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xlsx,xls格式的模板</div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import store from '@/store'
import { getStore, setStore } from '@/util/store'
export default {
  data() {
    return {
      visible: false,
      canSubmit: false,
      headers: {
        Authorization: 'Bearer ' + store.getters.access_token,
        'TENANT-ID': getStore({ name: 'tenantId_video' }),
        'SYSTEM-TYPE': 2,
      },
      dataForm: {
        templateName: '',
      },
      dataRule: {
        templateName: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    //上传成功
    handleSuccess(res, file, fileList) {
      if (res.code == 0) {
        this.resetForm('dataForm')
        this.visible = false
        this.$refs.upload.clearFiles()
        this.$emit('refreshDataList')
        this.msgSuccess('上传成功!')
      } else {
        this.msgWarn('上传失败')
      }
    },
    handleClose() {
      this.resetForm('dataForm')
      this.visible = false
    },
    handleBeforeUpload(file) {
      let res = false
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const typeList = ['.xlsx', '.xls']
          const isExcel = typeList.find((item) => file.name.indexOf(item) != -1) ? true : false
          if (!isExcel) {
            this.msgError('请上传xlsx,xls格式的模板！')
          }
          res = isExcel
        } else {
          res = false
        }
      })
      return res
    },
    handleUploadError() {
      this.$notify({
        type: 'error',
        message: '上传失败',
      })
    },
  },
}
</script>
