<!-- 国标级联编辑 -->
<template>
  <div>
    <el-dialog :visible="visible" width="800px" :title="data.title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="平台类型" prop="platformType">
              <el-select v-model="form.platformType" placeholder="请选择">
                <el-option v-for="item in platformType" :label="item.label" :value="parseInt(item.value)"
                           :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="平台名称" prop="platformName">
              <el-input v-model="form.platformName" clearable></el-input>
            </el-form-item>
            <el-form-item label="平台地址" prop="address">
              <el-input v-model="form.address" clearable></el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="port">
              <el-input v-model="form.port" clearable></el-input>
            </el-form-item>
            <el-form-item label="平台key" prop="appKey">
              <el-input v-model="form.appKey" clearable></el-input>
            </el-form-item>
            <el-form-item label="平台secret" prop="appSecret">
              <el-input v-model="form.appSecret" clearable></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择">
                <el-option label="启用" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" :rows="5" show-word-limit maxlength="200" v-model="form.remark"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleComfire">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getVideoPlatformInfo, putVideoPlatform, addVideoPlatform } from '@/api/app/rules/platform'
export default {
  components: {
    // ImageUpload
  },
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
        address: null,
        port: null,
      },
      id: null,
      platformType: [],
      rules: {
        platformType: [{ required: true, message: '请选择平台类型', trigger: 'blur' }],
        platformName: [{ required: true, message: '请输入平台名称', trigger: 'blur' }, this.$formRules.checkLen(100)],
        appKey: [{ required: true, message: '请输入平台KEY', trigger: 'blur' }],
        appSecret: [{ required: true, message: '请输入平台secret', trigger: 'blur' }],
        address: [
          { required: true, message: '请输入平台IP', trigger: 'blur' },
          { validator: this.$formRules.checkIP, trigger: 'blur' },
        ],
        port: [
          { required: true, message: '请输入端口号', trigger: 'blur' },
          { validator: this.$formRules.checkPort, trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
    }
  },
  computed: {},
  watch: {
    visible(val) {
      if (val) {
        this.getList()
      }
    },
  },

  mounted() {
    this.getDicts('video_platform_type').then((res) => {
      this.platformType = res.data.data
    })
    this.id = this.data.id
  },

  methods: {
    getList() {
      if (this.data.id) {
        getVideoPlatformInfo(this.data.id).then((res) => {
          this.form = res.data.data
          const str = res.data.data.host
          const n = str.split(':')
          this.form.address = n[0]
          this.form.port = n[1]
        })
      }
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleComfire() {
      const that = this
      this.form.host = this.form.address + ':' + this.form.port
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (that.data.id) {
            putVideoPlatform(this.form).then((res) => {
              if (res.data.data) {
                this.handleClose()
                this.msgSuccess('修改成功')
              }
            })
          } else {
            addVideoPlatform(this.form).then((res) => {
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