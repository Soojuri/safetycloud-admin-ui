<!-- 国标级联编辑 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="data.title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-form ref="form" :rules="rules" :model="form" label-width="160px">
        <el-row :gutter="24">
          <el-col :span="11">
            <el-form-item label="平台名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="SIP服务国标编码" prop="serverGbId">
              <el-input v-model="form.serverGbId" clearable></el-input>
            </el-form-item>
            <el-form-item label="SIP服务国标域" prop="serverGbDomain">
              <el-input v-model="form.serverGbDomain" clearable></el-input>
            </el-form-item>
            <el-form-item label="SIP服务IP" prop="serverIp">
              <el-input v-model="form.serverIp" clearable></el-input>
            </el-form-item>
            <el-form-item label="SIP服务端口" prop="serverPort">
              <el-input v-model="form.serverPort" clearable></el-input>
            </el-form-item>
            <el-form-item label="设备国标编号" prop="deviceGbId">
              <el-input v-model="form.deviceGbId" clearable></el-input>
            </el-form-item>
            <el-form-item label="本地IP" prop="deviceIp">
              <el-input v-model="form.deviceIp" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="本地端口" prop="devicePort">
              <el-input v-model="form.devicePort" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SIP认证用户名" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="SIP认证密码" prop="password">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="注册周期(秒)" prop="expires">
              <el-input-number :max="360000" :min="0" v-model="form.expires"></el-input-number>
            </el-form-item>
            <el-form-item label="心跳周期(秒)" prop="keepTimeout">
              <el-input-number :max="360000" :min="0" v-model="form.keepTimeout"></el-input-number>
            </el-form-item>
            <el-form-item label="信令传输" prop="transport">
              <el-select v-model="form.transport" style="width: 100%" placeholder="请选择信令传输方式">
                <el-option label="UDP" value="UDP"></el-option>
                <el-option label="TCP" value="TCP"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="字符集" prop="characterSet">
              <el-select v-model="form.characterSet" style="width: 100%" placeholder="请选择字符集">
                <el-option label="GB2312" value="GB2312"></el-option>
                <el-option label="UTF-8" value="UTF-8"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="其他选项">
              <el-checkbox label="启用" :true-label="1" :false-label="0" v-model="form.enable" @change="checkExpires">
              </el-checkbox>
              <el-checkbox label="云台控制" :true-label="1" :false-label="0" v-model="form.ptz"></el-checkbox>
              <el-checkbox label="RTCP保活" :true-label="1" :false-label="0" v-model="form.rtcp"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleComfire">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPlatformInfo, exitPlatform, getServeConfig, savePlatform } from '@/api/app/camera/gbCascade'
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
    var deviceGbIdRules = async (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('请输入设备国标编号'))
      } else {
        var exit = await this.deviceGbIdExit(value)
        console.log(exit)
        if (exit == 'true') {
          callback(new Error('设备国标编号已存在'))
        } else {
          callback()
        }
      }
    }
    return {
      form: {
        id: null,
        enable: 1,
        ptz: 1,
        rtcp: 0,
        name: null,
        serverGbId: null,
        serverGbDomain: null,
        serverIp: null,
        serverPort: null,
        deviceGbId: null,
        deviceIp: null,
        devicePort: null,
        username: null,
        password: null,
        expires: 300,
        keepTimeout: 60,
        transport: 'UDP',
        characterSet: 'GB2312',
      },
      id: null,
      rules: {
        name: [{ required: true, message: '请输入平台名称', trigger: 'blur' }, this.$formRules.checkLen()],
        serverGbId: [
          { required: true, message: '请输入SIP服务国标编码', trigger: 'blur' },
          { validator: this.$formRules.checkNumber, trigger: 'blur' },
          this.$formRules.checkLen(),
        ],
        serverGbDomain: [
          { required: true, message: '请输入SIP服务国标域', trigger: 'blur' },
          { validator: this.$formRules.checkNumber, trigger: 'blur' },
          this.$formRules.checkLen(),
        ],
        serverIp: [
          { required: true, message: '请输入SIP服务IP', trigger: 'blur' },
          { validator: this.$formRules.checkIP, trigger: 'blur' },
        ],
        serverPort: [
          { required: true, message: '请输入SIP服务端口', trigger: 'blur' },
          { validator: this.$formRules.checkPort, trigger: 'blur' },
        ],
        deviceGbId: [
          { validator: deviceGbIdRules, trigger: 'blur' },
          { validator: this.$formRules.checkNumber, trigger: 'blur' },
          this.$formRules.checkLen(),
        ],
        username: [{ required: false, message: '请输入SIP认证用户名', trigger: 'blur' }, this.$formRules.checkLen(50)],
        password: [{ required: false, message: '请输入SIP认证密码', trigger: 'blur' }, this.$formRules.checkLen(255)],
        expires: [{ required: true, message: '请输入注册周期', trigger: 'blur' }],
        keepTimeout: [{ required: true, message: '请输入心跳周期', trigger: 'blur' }],
        transport: [{ required: true, message: '请选择信令传输', trigger: 'blur' }],
        characterSet: [{ required: true, message: '请选择编码字符集', trigger: 'blur' }],
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
    this.getDicts('streamed_transfer_mode').then((res) => {
      this.streamedTransferMode = res.data.data
    })
    this.id = this.data.id
  },

  methods: {
    getList() {
      if (this.data.id) {
        getPlatformInfo(this.data.id).then((res) => {
          this.form = res.data.data
        })
      } else {
        getServeConfig().then((res) => {
          this.form.deviceGbId = res.data.data.username
          this.form.deviceIp = res.data.data.deviceIp
          this.form.devicePort = res.data.data.devicePort
          this.form.username = res.data.data.username
          this.form.password = res.data.data.password
        })
      }
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleComfire() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          savePlatform(this.form).then((res) => {
            if (res.data.data == 'true') {
              this.handleClose()
              this.msgSuccess('保存成功')
            } else {
              this.msgError('保存失败')
            }
          })
        }
      })
    },
    async deviceGbIdExit(deviceGbId) {
      let result = false
      await exitPlatform(deviceGbId)
        .then(function (res) {
          result = res.data.data
        })
        .catch(function (error) {
          console.log(error)
        })
      return result
    },
    checkExpires: function () {
      if (this.form.enable && this.form.expires == '0') {
        this.form.expires = '300'
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