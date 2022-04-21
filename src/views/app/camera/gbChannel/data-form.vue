<!-- 视频设备编辑 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" title="编辑" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="5" :span="14">
          <el-form :rules="rules" :model='form' label-width='150px' ref='form'>
            <el-form-item label='国标设备编号' prop='gbCode'>
              <el-input disabled size='small' v-model='form.gbCode' placeholder="请输入国标设备编号"></el-input>
            </el-form-item>
            <el-form-item label='设备名称' prop='name'>
              <el-input size='small' v-model='form.name' placeholder='请输入设备名称'></el-input>
            </el-form-item>
            <!-- <el-form-item label='设备厂家' prop='producer'>
              <el-select v-model="form.producer" placeholder="请选择设备厂家">
                <el-option v-for="item in producerOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="流传输模式" prop="streamedTransferMode">
              <el-radio-group v-model="form.streamedTransferMode" size="small">
                <el-radio-button v-for="item in streamedTransferMode" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="信令传输方式" prop="signalingTransport">
              <el-select v-model="form.signalingTransport" placeholder="请选择信令传输方式">
                <el-option :value="1" label="UDP" />
                <el-option :value="2" label="TCP" />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label='通道数' prop='channelsNum'>
              <el-input-number size='small' v-model='form.channelsNum'></el-input-number>
            </el-form-item> -->
            <!-- <el-form-item label='设备IP' prop='deviceIp'>
              <el-input size='small' v-model='form.deviceIp' placeholder='请输入设备IP'></el-input>
            </el-form-item> -->
            <!-- <el-form-item label='设备端口' prop='devicePort'>
              <el-input-number size='small' v-model='form.devicePort'></el-input-number>
            </el-form-item> -->
            <el-form-item label="字符集" prop="characterSet">
              <el-select v-model="form.characterSet" placeholder="请选择字符集">
                <el-option :value="0" label="自动识别" />
                <el-option :value="1" label="GB2312" />
                <el-option :value="2" label="UTF-8" />
              </el-select>
            </el-form-item>
            <el-form-item label='通道更新周期(秒)' prop='deviceCatalogInterval'>
              <el-input-number size='small' v-model='form.deviceCatalogInterval'></el-input-number>
            </el-form-item>
            <!-- <el-form-item label='订阅周期(秒)' prop='subscriptionInterval'>
              <el-input-number size='small' v-model='form.subscriptionInterval'></el-input-number>
            </el-form-item> -->
            <el-form-item label='备注' prop='remark'>
              <el-input size='small' maxlength="255" show-word-limit type="textarea" :rows="5" v-model='form.remark'
                        placeholder='请输入备注'></el-input>
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
import { getDeviceInfo, putVideo } from '@/api/app/camera/gbChannel'
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
        deviceCatalogInterval: 3600,
      },
      id: null,
      streamedTransferMode: [],
      rules: {
        deviceName: [this.$formRules.checkNecessary('请输入设备名称'), this.$formRules.checkLen()],
        streamedTransferMode: [this.$formRules.checkNecessary('请选择流传输模式')],
        characterSet: [this.$formRules.checkNecessary('请选择字符集')],
        gbCode: [this.$formRules.checkNecessary('国标设备编号不能为空'), this.$formRules.checkLen()],
      },
      producerOptions: [],
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
    this.getDicts('video_device_producer').then((res) => {
      this.producerOptions = res.data.data
    })
    this.getDicts('streamed_transfer_mode').then((res) => {
      this.streamedTransferMode = res.data.data
    })
    this.id = this.data.id
  },

  methods: {
    getList() {
      getDeviceInfo(this.data.id).then((res) => {
        this.form = res.data.data
        this.form.producer = this.form.producer.toString()
      })
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleComfire() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          putVideo(this.form).then((res) => {
            if (res.data.data) {
              this.handleClose()
              this.msgSuccess('保存成功')
            }
          })
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