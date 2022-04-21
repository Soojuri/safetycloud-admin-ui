<!-- 空间目录详情页 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <div>
        <span class="ft16">空间目录信息</span>
      </div>
      <div>
        <el-description class="mt-xl" v-loading="loading">
          <el-description-item label="空间编号" :value="tableData.spaceId" :span="8" />
          <el-description-item label="空间名称" :value="tableData.spaceName" :span="8" />
          <el-description-item label="空间状态" :value="tableData.status == 1?'已启用':'未启用'" :span="8" />
          <el-description-item label="创建时间" :value="parseTime(tableData.createTime)" :span="8" />
          <el-description-item label="详细地址" :value="tableData.address" :span="16" />
          <el-description-item label="空间备注" :value="tableData.remark" :span="24" />
        </el-description>
      </div>
      <div class="mt-xl">
        <span class="ft16">视频接入信息</span>
      </div>
      <div>
        <el-description class="mt-xl" v-loading="loading">
          <el-description-item label="协议类型"
                               :value="tableData.protocolType=0? '其他' :tableData.protocolType=1? '国标GB28181' :tableData.protocolType=2? '设备厂商协议':tableData.protocolType=3? 'ONVIF 3RTSP':tableData.protocolType=4? 'RTMP拉流' :''"
                               :span="8" />
          <el-description-item label="当前接入设备数量" :value="tableData.deviceCount" :span="8" />
          <el-description-item label="当前接入平台数量" :value="tableData.platformNum" :span="8" />
          <el-description-item label="按需拉流" :span="8">
            <slot name="content">
              <el-switch v-model="tableData.pushStream" :active-value="1" :inactive-value="0"></el-switch>
            </slot>
          </el-description-item>
          <el-description-item label="当前在线设备数量" :value="tableData.onlineNum" :span="8" />
          <el-description-item label="当前离线设备数量" :value="tableData.offlineNum" :span="8" />
        </el-description>
      </div>
      <div class="mt-xl">
        <span class="ft16">摄像机监控设备列表</span>
      </div>
      <div class="g-table mt-xl" v-loading="loading">
        <el-table :data="list" border>
          <el-table-column prop="deviceNo" label="设备编号" />
          <el-table-column prop="deviceName" label="设备名称" />
          <el-table-column prop="producer" label="设备厂商" :formatter="formatProducer" />
          <el-table-column prop="videoDeviceType" label="设备类型" :formatter="formatDeviceType" />
          <el-table-column prop="channelCount" label="通道数" />
          <el-table-column prop="status" label="状态" :formatter="formatStatus" />
          <el-table-column prop="deviceIp" label="设备IP" />
          <el-table-column prop="spaceName" label="空间目录" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                         @click="$router.push({path: '/app/camera/videoDevice/info/index/',query: {id: scope.row.deviceId}})">
                监控预览</el-button>
              <el-button size="mini" icon="el-icon-info" type="text" @click="handleInfo(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="mt-xl">
        <span class="ft16">模板配置</span>
      </div>
      <div>
        <el-descriptions :column='2' size='medium' border class="mt-xl">
          <el-descriptions-item label="录制模板">
            {{ recordId }}&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button size="medium" type="text" @click="visible1 = true">编辑</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="截图模板">
            {{ captureId }}&nbsp;&nbsp;&nbsp;&nbsp;
            <el-button size="medium" type="text" @click="visible2 = true">编辑</el-button>
          </el-descriptions-item>
        </el-descriptions>
      </div> -->
    </div>
    <!-- 录制模板配置 -->
    <!-- <el-dialog :visible="visible1" width="888px" title="录制模板配置" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='tableData' label-width='120px' ref='tableData'>
            <el-form-item label='空间名称' prop='spaceName'>
              <el-input placeholder="请输入空间名称" v-model="tableData.spaceName" :disabled="true">
              </el-input>
            </el-form-item>
            <el-form-item label='录制模板' prop='recordTemplateId'>
              <el-select v-model="tableData.recordTemplateId" placeholder="请选择">
                <el-option v-for="(item, index) in templateList2" :key="item.templateId" :label="item.templateName"
                           :value="item.templateId">
                </el-option>
              </el-select>
              <div class="record1">录制周期请输入或选择OSS存储路径</div>
            </el-form-item>
            <el-checkbox :true-label="1" :false-label="0" v-model="tableData.recordTemplateStreamSwitch">应用到本空间中的所有流
            </el-checkbox>
            <div class="record1">
              修改模版时，若勾选将覆盖本空间中在流上的差异化录制模板配置。例：空间录制模板配置为record1，流1的的录制模板为record2，空间录制模板配置修改为record3时，若勾选此项，流1的的录制模板也将应用record3，若不勾选，流1的的录制模板依然为record2。
            </div>
          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 认</el-button>
      </div>
    </el-dialog> -->
    <!-- 截图模板配置 -->
    <!-- <el-dialog :visible="visible2" width="888px" title="截图模板配置" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='tableData' label-width='120px' ref='tableData'>
            <el-form-item label='空间名称' prop='spaceName'>
              <el-input placeholder="请输入空间名称" v-model="tableData.spaceName" :disabled="true">
              </el-input>
            </el-form-item>
            <el-form-item label='截图模板' prop='captureTemplateId'>
              <el-select v-model="tableData.captureTemplateId" placeholder="请选择">
                <el-option v-for="item in templateList1" :key="item.templateId" :label="item.templateName"
                           :value="item.templateId">
                </el-option>
              </el-select>
              <div class="record1">录制周期请输入或选择OSS存储路径</div>
            </el-form-item>
            <el-checkbox :true-label="1" :false-label="0" v-model="tableData.captureTemplateStreamSwitch">应用到本空间中的所有流
            </el-checkbox>
            <div class="record1">
              修改模版时，若勾选将覆盖本空间中在流上的差异化录制模板配置。例：空间录制模板配置为record1，流1的的录制模板为record2，空间录制模板配置修改为record3时，若勾选此项，流1的的录制模板也将应用record3，若不勾选，流1的的录制模板依然为record2。
            </div>
          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 认</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { getVideoDeviceList } from '@/api/app/camera/videoDevice'
import { getSpaceInfo, putSpace } from '@/api/app/camera/space'
import ElDescription from '@/components/ElDescription'
import ElDescriptionItem from '@/components/ElDescriptionItem'
import { getRecordList, getTemplateList } from '@/api/app/template/template.js'
export default {
  components: { ElDescription, ElDescriptionItem },
  data() {
    return {
      dict: {
        deviceStatus: [],
        cameraType: [],
        producer: [],
        spaceList: [],
      },
      queryParams: {
        size: 10,
        current: 1,
        spaceId: null,
      },
      recordId: null,
      captureId: null,
      tableData: [],
      list: [],
      templateList1: [],
      templateList2: [],
      visible1: false,
      visible2: false,
      loading: false,
      rules: {
        spaceName: [this.$formRules.checkNecessary('请选择状态')],
      },
    }
  },
  computed: {},
  watch: {
    $route() {
      this.getList()
    },
  },
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getDictList()
    this.getList()
  },
  //方法集合
  methods: {
    getDictList() {
      this.getDicts('video_status').then((res) => {
        this.dict.deviceStatus = res.data.data
      })
      this.getDicts('video_device_producer').then((res) => {
        this.dict.producer = res.data.data
      })
      this.getDicts('camera_device_type').then((res) => {
        this.dict.cameraType = res.data.data
      })
    },
    getList() {
      this.loading = true

      this.queryParams.spaceId = this.$route.query.id
      getSpaceInfo(this.$route.query.id)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data
          this.captureId = this.tableData.captureTemplateId
          this.recordId = this.tableData.recordTemplateId
        })
        .catch(() => {
          this.loading = false
        })
      getVideoDeviceList({ ...this.queryParams })
        .then((res) => {
          this.loading = false
          this.list = res.data.data.records
        })
        .catch(() => {
          this.loading = false
        })
      getTemplateList({
        size: 1000,
        current: 1,
      })
        .then((res) => {
          this.loading = false
          this.templateList1 = res.data.data.records
        })
        .catch(() => {
          this.loading = false
        })
      getRecordList({
        size: 1000,
        current: 1,
      })
        .then((res) => {
          this.loading = false
          this.templateList2 = res.data.data.records
        })
        .catch(() => {
          this.loading = false
        })
    },
    formatStatus(row) {
      return this.selectDictLabel(this.dict.deviceStatus, row.status)
    },
    formatDeviceType(row) {
      return this.selectDictLabel(this.dict.cameraType, row.videoDeviceType)
    },
    formatProducer(row) {
      return this.selectDictLabel(this.dict.producer, row.producer)
    },
    handleInfo(row) {
      this.$router.push({
        path: '/app/camera/videoDevice/info/index/',
        query: {
          id: row.deviceId,
        },
      })
    },
    handleClose() {
      this.visible1 = false
      this.visible2 = false
    },
    handleSave() {
      const that = this
      const spaceId = this.tableData.spaceId
      const recordTemplateId = this.tableData.recordTemplateId
      const captureTemplateId = this.tableData.captureTemplateId
      const recordTemplateStreamSwitch = this.tableData.recordTemplateStreamSwitch
      const captureTemplateStreamSwitch = this.tableData.captureTemplateStreamSwitch
      putSpace({
        spaceId,
        recordTemplateId,
        captureTemplateId,
        captureTemplateStreamSwitch,
        recordTemplateStreamSwitch,
      }).then((res) => {
        if (res.data.data) {
          that.handleClose()
          that.msgSuccess('修改成功')
          that.getList()
        }
      })
    },
  },
}
</script>
<style lang='scss' scoped>
.g-card {
  font-size: 16px;
}
.record1 {
  color: #c2c2c2;
}
</style>