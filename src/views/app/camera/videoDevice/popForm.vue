<!-- 视频设备-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='设备名称' prop='deviceName'>
              <el-input size='small' v-model='form.deviceName' placeholder='请输入设备名称'></el-input>
            </el-form-item>
            <el-form-item label='设备编号' prop='deviceNo'>
              <el-input size='small' v-model='form.deviceNo' placeholder='请输入设备编号'></el-input>
            </el-form-item>
            <el-form-item label='接入类型' prop='protocolType'>
              <el-select v-model="form.protocolType" placeholder="请选择接入类型">
                <el-option v-for="item in dict.protocolType" :key="item.value" :label="item.label"
                           :value="parseInt(item.value)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='rtsp流地址' prop='rtspAddress'
                          :rules="[form.protocolType == 4? $formRules.checkNecessary(' 请输入rtsp流地址') :'']">
              <el-input size='small' v-model='form.rtspAddress' placeholder='请输入rtsp流地址'></el-input>
            </el-form-item>
            <el-form-item label='flv播放地址' prop='flvAddress'>
              <el-input size='small' v-model='form.flvAddress' placeholder='请输入flv播放地址'></el-input>
            </el-form-item>
            <el-form-item label="设备类型" prop="videoDeviceType">
              <el-select v-model="form.videoDeviceType" placeholder="请选择设备类型">
                <el-option v-for="item in dict.cameraType" :key="item.value" :label="item.label"
                           :value="parseInt(item.value)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备厂商" prop="producer">
              <el-select v-model="form.producer" placeholder="请选择设备厂商">
                <el-option v-for="item in dict.producer" :key="item.value" :label="item.label"
                           :value="parseInt(item.value)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='设备国标ID' prop='gbCode'>
              <el-input size='small' v-model='form.gbCode' placeholder='请输入设备国标ID'></el-input>
            </el-form-item>
            <el-form-item label='设备IP' prop='deviceIp'>
              <el-input size='small' v-model='form.deviceIp' placeholder='请输入设备IP'></el-input>
            </el-form-item>
            <el-form-item label='设备端口' prop='devicePort'>
              <el-input size='small' v-model='form.devicePort' placeholder='请输入设备端口'></el-input>
            </el-form-item>
            <el-form-item label="所属空间目录" prop="spaceId">
              <el-select v-model="form.spaceId" placeholder="请选择空间目录">
                <el-option v-for="item in dict.spaceList" :key="item.spaceId" :label="item.spaceName"
                           :value="item.spaceId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='设备用户名' prop='deviceUsername'>
              <el-input size='small' v-model='form.deviceUsername' placeholder='请输入设备用户名'></el-input>
            </el-form-item>
            <el-form-item label='设备用户密码' prop='devicePassword'>
              <el-input size='small' v-model='form.devicePassword' placeholder='请输入设备用户密码'></el-input>
            </el-form-item>
            <el-form-item label="经纬度获取方式" prop="locationGetType">
              <el-radio-group class="mt-s" v-model="form.locationGetType">
                <el-radio :label="2">订阅（自动获取）</el-radio>
                <el-radio :label="1">录入</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label='经纬度' prop='latLng' v-if="form.locationGetType == 1">
              <el-input size='small' v-model='form.latLng' placeholder='请输入经纬度'>
                <i slot="suffix" @click="handleSelectPosition"
                   class="blue el-input__icon el-icon-location-information"></i>
              </el-input>
              <dt class="mt-s">单位“度”，纬度在前，请保留小数点后10位，若南纬、西经，在数值值前加“-”，如“25.0988,119.63547”，“-25.0988,119.63547”</dt>
            </el-form-item>
            <el-form-item label="订阅频度" prop="subscriptionFrequency">
              <el-input-number v-model="form.subscriptionFrequency" :max="60" :min="0"></el-input-number>
              <dt class="mt-s">订阅频度，支持1~60秒</dt>
            </el-form-item>
            <el-form-item label="添加启动拉流" prop="streamingSwitch">
              <el-switch class="mt-s" v-model="form.streamingSwitch" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="设备状态" prop="status">
              <el-switch class="mt-s" v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="设备描述" prop="remark">
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
    <el-dialog title="选择地图点位" width="940px" v-if="amapVisible" :visible.sync="amapVisible">
      <div>
        <component :is="currentComp" @updateLocation="updateLocation">
        </component>
      </div>
      <div slot="footer">
        <el-button @click="cancelMapDialog">取 消</el-button>
        <el-button type="primary" @click="confirmMapDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { putVideoDevice, addVideoDevice, getVideoDeviceInfo } from '@/api/app/camera/videoDevice'
import { isVas } from '@/config/env'
export default {
  components: {
    AmapMap: () => import('@/components/Amap'),
    GisMap: () => import('@/components/GisPoint'),
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
        deviceName: null,
        deviceNo: null,
        protocolType: null,
        rtspAddress: null,
        flvAddress: null,
        videoDeviceType: null,
        producer: null,
        gbCode: null,
        deviceIp: null,
        devicePort: null,
        spaceId: null,
        deviceUsername: null,
        devicePassword: null,
        locationGetType: null,
        latLng: null,
        subscriptionFrequency: null,
        streamingSwitch: null,
        status: 1,
        latitude: null,
        longitude: null,
        remark: null,
      },
      options: null,
      id: null,
      areaList: [],
      subdistrictList: [],
      rules: {
        deviceName: [this.$formRules.checkLen(255), this.$formRules.checkNecessary('请输入设备名称')],
        deviceNo: [this.$formRules.checkNecessary('请输入设备编号')],
        protocolType: [this.$formRules.checkNecessary('请选择接入类型')],
        // rtspAddress: [this.form.protocolType = 4 ? this.$formRules.checkNecessary('请输入rtsp流地址') :''],
        producer: [this.$formRules.checkNecessary('请选择设备厂商')],
        spaceId: [this.$formRules.checkNecessary('请选择所属空间目录')],
        deviceIp: [{ validator: this.$formRules.checkIP, trigger: 'blur' }],
        devicePort: [{ validator: this.$formRules.checkPort, trigger: 'blur' }],
      },
      amapVisible: false,
      lng: '',
      lat: '',
      currentComp: isVas ? 'GisMap' : 'AmapMap',
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
        getVideoDeviceInfo(this.id).then((res) => {
          this.form = res.data.data
          if (this.form.latitude && this.form.longitude) {
            this.form.latLng = `${this.form.latitude},${this.form.longitude}`
          }
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
      if (this.form.latLng) {
        if (this.form.latLng.split(',').length === 2) {
          this.form.latitude = this.form.latLng.split(',')[0]
          this.form.longitude = this.form.latLng.split(',')[1]
        } else {
          return this.msgError('经纬度格式错误')
        }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (that.id) {
            putVideoDevice(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addVideoDevice(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('新增成功')
              }
            })
          }
        }
      })
    },
    /** 选择地图点位 */
    handleSelectPosition() {
      this.amapVisible = true
    },
    // 地图点位回传
    updateLocation(lng, lat) {
      this.lng = lng
      this.lat = lat
    },
    // 关闭地图弹窗
    cancelMapDialog() {
      this.amapVisible = false
      this.lng = ''
      this.lat = ''
      this.address = ''
    },
    // 确认点位 关闭弹窗
    confirmMapDialog() {
      this.amapVisible = false
      this.form.longitude = this.lng
      this.form.latitude = this.lat
      this.form.latLng = this.lat + ',' + this.lng
    },
  },
}
</script>
<style lang='scss' scoped>
::v-deep .dialog-footer {
  text-align: center;
}
dt {
  font-size: 12px;
  color: #ccc;
}
</style>