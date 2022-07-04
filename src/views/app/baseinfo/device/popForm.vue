<!-- 设备管理-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='设备编号' prop='deviceId'>
              <el-input size='small' v-model.trim='form.deviceId' placeholder='请输入设备编号'></el-input>
            </el-form-item>
            <el-form-item label='设备名称' prop='deviceName'>
              <el-input size='small' v-model.trim='form.deviceName' placeholder='请输入设备名称'></el-input>
            </el-form-item>
            <el-form-item label='设备类型' prop='deviceType'>
              <el-select v-model="form.deviceType" placeholder="请选择设备类型">
                <el-option v-for="item in deviceTypeOptions" :label="item.label" :value="parseInt(item.value)"
                           :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='企业' prop='enterpriseId'>
              <el-select v-model="form.enterpriseId" placeholder="请选择企业">
                <el-option v-for="item in enterpriseList" :key="item.enterpriseId" :label="item.enterpriseName"
                           :value="item.enterpriseId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='物联产品' prop='productId'>
              <el-select v-model="form.productId" placeholder="请选择物联产品" @change="whChange">
                <el-option v-for="item in productAllList" :key="item.productId" :label="item.productName"
                           :value="item.productId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="省市区" prop="selectedOptions">
              <el-cascader style="width:100%" size="large" :options="options" v-model="form.selectedOptions">
              </el-cascader>
            </el-form-item>
            <el-form-item label="设备地址" prop="deviceAddress">
              <el-input v-model="form.deviceAddress" maxlength="255" @focus="openAmap" placeholder="请选择设备地址" />
            </el-form-item>
            <el-form-item label='空间目录' prop='spaceId'>
              <el-select v-model="form.spaceId" placeholder="请选择">
                <el-option v-for="item in arr" :key="item.spaceId" :label="item.spaceName" :value="item.spaceId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入至少五个字符" show-word-limit maxlength="200" type="textarea"
                        :rows="5">
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
        <amap @updateLocation="updateLocation" />
      </div>
      <div slot="footer">
        <el-button @click="cancelMapDialog">取 消</el-button>
        <el-button type="primary" @click="confirmMapDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addDeviceInfo, putDeviceInfo, getDeviceInfo, getProductList } from '@/api/app/baseinfo/device.js'
import { getEnterpriseList } from '@/api/app/enterprise/enterprise.js'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import amap from '@/components/Amap'
import { getSpaceList } from '@/api/app/camera/space.js'
export default {
  components: { amap },
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
        deviceId: null,
        deviceName: null,
        deviceType: null,
        spaceId: null,
        remark: null,
        deviceAddress: null,
        productId: null,
        productName: null,
      },
      lng: '',
      lat: '',
      address: '',
      id: null,
      amapVisible: false,
      options: regionData,
      deviceTypeOptions: [],
      productAllList: [],
      enterpriseList: [],
      arr: [], //表格数据
      rules: {
        deviceName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入设备名称')],
        deviceType: [this.$formRules.checkNecessary('请选择设备类型')],
        deviceId: [this.$formRules.checkNecessary('请输入设备编号'), this.$formRules.checkLen(32)],
        selectedOptions: [this.$formRules.checkNecessary('请选择省市区')],
        deviceAddress: [this.$formRules.checkNecessary('请选择设备地址')],
        productId: [this.$formRules.checkNecessary('请选择物联产品')],
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
    getSpaceList({ size: 1000, current: 1 }).then((res) => {
      this.arr = res.data.data.records
    })
    getProductList({ size: 1000, current: 1 }).then((res) => {
      this.productAllList = res.data.data.records
    })
    getEnterpriseList({ size: 1000, current: 1 }).then((res) => {
      this.enterpriseList = res.data.data.records
    })
    this.getList()
    this.getDicts('device_type').then((res) => {
      this.deviceTypeOptions = res.data.data
    })
  },
  methods: {
    getList() {
      if (this.id) {
        getDeviceInfo(this.id).then((res) => {
          this.form = res.data.data
          this.form.selectedOptions = [
            TextToCode[this.form.province].code,
            TextToCode[this.form.province][this.form.city].code,
            TextToCode[this.form.province][this.form.city][this.form.county].code,
          ]
        })
      }
    },
    whChange(val) {
      this.form.productName = this.productAllList.find((item) => item.productId == val).productName
    },

    /** 选择地图点位 */
    openAmap() {
      this.amapVisible = true
    },
    // 地图点位回传
    updateLocation(lng, lat, address) {
      this.lng = lng
      this.lat = lat
      this.address = address
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
      this.form.deviceAddress = this.address
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
          this.form.province = CodeToText[this.form.selectedOptions[0]]
          this.form.city = CodeToText[this.form.selectedOptions[1]]
          this.form.county = CodeToText[this.form.selectedOptions[2]]
          if (that.id) {
            putDeviceInfo(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addDeviceInfo(this.form).then((res) => {
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