<!-- 视频设备详情 -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <div class="tit">基本信息</div>
      <el-descriptions labelStyle="white-space: nowrap" contentStyle="overflow:hidden;text-overflow:ellipsis;"
                       size="medium" v-loading="loading">
        <el-descriptions-item label="设备名称">{{ info.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          {{ formatStatus(info) }}
        </el-descriptions-item>
        <el-descriptions-item label="设备厂商">
          {{ formatProducer(info) }}</el-descriptions-item>

        <el-descriptions-item label="设备编号">
          <el-tooltip effect="dark" :content="info.deviceNo" placement="top">
            <span>{{ info.deviceNo }}</span>
          </el-tooltip>
        </el-descriptions-item>

        <el-descriptions-item label="设备国标ID">{{ info.gbCode }}</el-descriptions-item>
        <el-descriptions-item label="空间目录">{{ info.spaceName }}</el-descriptions-item>
        <el-descriptions-item label="设备IP">{{ info.deviceIp }}</el-descriptions-item>
        <el-descriptions-item label="设备端口">{{ info.devicePort }}</el-descriptions-item>
        <el-descriptions-item label="设备种类">
          {{ formatDeviceType(info) }}
        </el-descriptions-item>
        <el-descriptions-item label="设备地址">{{ info.address }}</el-descriptions-item>
        <el-descriptions-item label="获取经纬度方式">{{ info.locationGetType == 1?'录入' :'订阅' }}</el-descriptions-item>
        <el-descriptions-item label="订阅频度">{{ info.subscriptionFrequency }}秒</el-descriptions-item>
        <el-descriptions-item label="设备用户名">{{ info.deviceUsername }}</el-descriptions-item>
        <el-descriptions-item label="设备用户密码">{{ info.devicePassword }}</el-descriptions-item>
        <el-descriptions-item label="添加启动拉流">
          <el-switch v-model="info.streamingSwitch" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-descriptions-item>
        <el-descriptions-item label="设备描述">{{ info.remark }}</el-descriptions-item>
      </el-descriptions>

    </div>
    <div class="g-card mt-m">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="监控预览" name="0">
        </el-tab-pane>
        <el-tab-pane label="录像回放" name="1">
        </el-tab-pane>
        <el-tab-pane label="查看截图" name="2">
        </el-tab-pane>
        <el-tab-pane label="任务作业" name="3">
        </el-tab-pane>
        <el-tab-pane label="查看日志" name="4">
        </el-tab-pane>
      </el-tabs>

      <component :is="curComp" :info="info" :dict="dict" @getInfo="getList"></component>

    </div>
  </div>
</template>

<script>
import ElDescription from '@/components/ElDescription'
import ElDescriptionItem from '@/components/ElDescriptionItem'
import { getVideoDeviceInfo } from '@/api/app/camera/videoDevice'
export default {
  components: {
    ElDescription,
    ElDescriptionItem,
    VideoPreview: () => import('./tabs/preview/index.vue'),
    PlayBack: () => import('./tabs/playback/index.vue'),
    VideoSnap: () => import('./tabs/snap/index.vue'),
    VideoTask: () => import('./tabs/task/index.vue'),
    VideoLog: () => import('./tabs/log/index.vue'),
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      activeName: '0',
      curComp: null,
      loading: false,
      dict: {
        cameraType: [],
        deviceStatus: [],
        producer: [],
      },
    }
  },
  computed: {},
  watch: {
    $route(val) {
      this.id = this.$route.query.id
      this.curComp = 'VideoPreview'
      this.getList()
    },
  },

  mounted() {
    this.id = this.$route.query.id
    this.getDicts('camera_device_type').then((res) => {
      this.dict.cameraType = res.data.data
    })
    this.getDicts('video_status').then((res) => {
      this.dict.deviceStatus = res.data.data
    })
    this.getDicts('video_device_producer').then((res) => {
      this.dict.producer = res.data.data
    })
    this.getList()
  },

  methods: {
    getList() {
      this.loading = true
      getVideoDeviceInfo(this.id)
        .then((res) => {
          this.info = res.data.data
          this.curComp = 'VideoPreview'
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleClick(tab) {
      if (tab.name == 0) return (this.curComp = 'VideoPreview')
      if (tab.name == 1) return (this.curComp = 'PlayBack')
      if (tab.name == 2) return (this.curComp = 'VideoSnap')
      if (tab.name == 3) return (this.curComp = 'VideoTask')
      if (tab.name == 4) return (this.curComp = 'VideoLog')
    },
    formatDeviceType(row) {
      return this.selectDictLabel(this.dict.cameraType, row.videoDeviceType)
    },
    formatStatus(row) {
      return this.selectDictLabel(this.dict.deviceStatus, row.status)
    },
    formatProducer(row) {
      return this.selectDictLabel(this.dict.producer, row.producer)
    },
  },
}
</script>
<style lang='scss' scoped>
.label {
  width: 120px;
}
.step {
  width: 800px;
  display: inline-block;
  margin: 50px 0px;
  margin-left: -400px;
  position: relative;
  left: 50%;
}
.tit {
  font-size: 18px;
  display: flex;
  align-items: flex-start;
  margin: 13px 0;
  &::before {
    content: '';
    height: 20px;
    width: 4px;
    border-radius: 2px;
    background: #2975ff;
    display: inline-block;
    margin-right: 8px;
    vertical-align: top;
    margin-top: 3px;
  }
}
</style>