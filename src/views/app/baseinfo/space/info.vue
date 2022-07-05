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
      <!-- <div class="mt-xl">
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
      </div> -->
      <div class="mt-xl">
        <span class="ft16">空间设备列表</span>
      </div>
      <div class="g-table mt-xl" v-loading="loading">
        <el-table :data="list" border>
          <el-table-column prop="deviceNo" align='center' label="设备编号" />
          <el-table-column prop="deviceName" align='center' label="设备名称" />
          <el-table-column align='center' prop='deviceModel' label='设备型号' />
          <el-table-column prop="enterpriseName" align='center' label="所属企业" />
          <!-- <el-table-column align='center' label='所属分组'>
            <template slot-scope="scope">
              <el-tag v-if="scope.row.groupName">{{scope.row.groupName}}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column align='center' prop='productName' label='产品名称' />
          <el-table-column align='center' prop='status' label='状态' width="100" :formatter="formatStatus" />
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text"
                         @click="$router.push({path: '/app/camera/videoDevice/info/index/',query: {id: scope.row.deviceId}})">
                监控预览</el-button>
              <el-button size="mini" icon="el-icon-info" type="text" @click="handleInfo(scope.row)">查看</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import ElDescription from '@/components/ElDescription'
import ElDescriptionItem from '@/components/ElDescriptionItem'
import { fetchList } from '@/api/device/instance'
import { getSpaceInfo, putSpace } from '@/api/app/camera/space'
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
      statusOptions: [],
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
    // this.getDictList()
    this.getDicts('equipment_status').then((res) => {
      this.statusOptions = res.data.data
    })
    this.getList()
  },
  //方法集合
  methods: {
    // getDictList() {
    //   this.getDicts('video_status').then((res) => {
    //     this.dict.deviceStatus = res.data.data
    //   })
    //   this.getDicts('video_device_producer').then((res) => {
    //     this.dict.producer = res.data.data
    //   })
    //   this.getDicts('camera_device_type').then((res) => {
    //     this.dict.cameraType = res.data.data
    //   })
    // },
    formatStatus(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
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
      fetchList({ ...this.queryParams })
        .then((res) => {
          this.loading = false
          this.list = res.data.data.records
        })
        .catch(() => {
          this.loading = false
        })
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