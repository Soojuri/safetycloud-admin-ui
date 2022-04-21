<!-- 视频播放器 -->
<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="16">
        <div>
          <video-player @uploadUrl="handleUploadUrl" ref="videoPlayer" height="400px" :videoSrc="videoSrc">
          </video-player>
        </div>
      </el-col>

      <el-col :span="4" class="controlBox" v-show="info.ptzEnable != 0">
        <div class="controlBtn" v-if="info.protocolType == 2">
          <i :class="`el-icon-caret-top topBtn ${active === 'UP' ? 'active' : ''}`"
             @mousedown.prevent="handleControl(0,'UP')" @mouseup.prevent="handleControl(1,'UP')" />
          <i :class="`el-icon-caret-left  mr-xl ${active === 'LEFT' ? 'active' : ''}`"
             @mousedown.prevent="handleControl(0,'LEFT')" @mouseup.prevent="handleControl(1,'LEFT')" />
          <i :class="`el-icon-caret-right  ml-xl ${active === 'RIGHT' ? 'active' : ''}`"
             @mousedown.prevent="handleControl(0,'RIGHT')" @mouseup.prevent="handleControl(1,'RIGHT')" />
          <i :class="`el-icon-caret-bottom bottomBtn ${active==='DOWN' ? 'active' : '' }`"
             @mousedown.prevent="handleControl(0,'DOWN')" @mouseup.prevent="handleControl(1,'DOWN')" />
          <i :class="`el-icon-circle-plus plusBtn  ${active==='ZOOM_IN' ? 'active' : '' }`"
             @mousedown.prevent="handleControl(0,'ZOOM_IN')" @mouseup.prevent="handleControl(1,'ZOOM_IN')" />
          <i :class="`el-icon-remove minusBtn ${active==='ZOOM_OUT' ? 'active' : '' }`"
             @mousedown.prevent="handleControl(0,'ZOOM_OUT')" @mouseup.prevent="handleControl(1,'ZOOM_OUT')" />
        </div>
        <div class="controlBtn" v-else>
          <i :class="`el-icon-caret-top topBtn ${active === 'top' ? 'active' : ''}`"
             @mousedown.prevent="ptzCamera(0, 2, 0,'top')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
          <i :class="`el-icon-caret-left  mr-xl ${active === 'left' ? 'active' : ''}`"
             @mousedown.prevent="ptzCamera(2, 0, 0,'left')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
          <i :class="`el-icon-caret-right  ml-xl ${active === 'right' ? 'active' : ''}`"
             @mousedown.prevent="ptzCamera(1, 0, 0,'right')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
          <i :class="`el-icon-caret-bottom bottomBtn ${active==='bottom' ? 'active' : '' }`"
             @mousedown.prevent="ptzCamera(0, 1, 0,'bottom')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
          <i :class="`el-icon-circle-plus plusBtn  ${active==='plus' ? 'active' : '' }`"
             @mousedown.prevent="ptzCamera(0, 0, 1,'plus')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
          <i :class="`el-icon-remove minusBtn ${active==='minus' ? 'active' : '' }`"
             @mousedown.prevent="ptzCamera(0, 0, 2,'minus')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getVideoUrl, controlling } from '@/api/app/camera/split'
import { play, ptzControl } from '@/api/app/camera/device'
import VideoPlayer from '@/components/video/VideoPlayer.vue'
import { getChannelId } from '@/api/app/camera/gbChannel'
import { putVideoDevice } from '@/api/app/camera/videoDevice'
export default {
  components: { VideoPlayer },
  data() {
    return {
      videoSrc: null,
      active: null,
      channelIds: null,
      channelId: null,
    }
  },
  props: {
    info: {
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
  computed: {},
  watch: {},
  mounted() {
    const protocol = this.info.protocolType
    if (protocol == 2 || 4) {
      this.getPlatformUrl()
    }
    if (protocol == 1) {
      this.getGbUrl()
    }
    window.addEventListener('mouseup', () => {
      this.ptzStop()
    })
  },
  beforeDestroy() {
    this.videoSrc = null
  },
  methods: {
    ptzStop() {
      this.active = null
    },
    // 平台设备播放
    getPlatformUrl() {
      const that = this
      const info = this.info
      const cameraIndexCode = info.deviceNo
      const protocol = location.protocol === 'https:' ? 'hlss' : 'hls'
      const expand = 'transcode=1'
      const streamType = 1
      const platformId = info.platformId
      getVideoUrl({ cameraIndexCode, protocol, expand, streamType, platformId }).then((res) => {
        if (res.data.data) {
          that.videoSrc = res.data.data.url
        } else {
          that.msgError(res.data.msg)
        }
      })
    },
    // 国标设备播放
    getGbUrl() {
      const that = this
      const deviceId = this.info.deviceNo
      getChannelId(deviceId).then((res) => {
        this.channelIds = res.data.data.split(',')
        if (this.channelIds.length === 1) {
          this.channelId = res.data.data
        }
        if (this.channelIds.length > 1) {
          this.channelId = this.channelIds[0]
        }
        play({ deviceId, channelId: this.channelId })
          .then(function (res) {
            if (res.data.code == 0) {
              const videoInfo = res.data.data
              const flvName = videoInfo.wss_flv.split('/rtp/')[1]
              const flvUrl = `wss://${window.location.host}/wssflv/rtp/${flvName}`
              that.videoSrc = location.protocol === 'https:' ? flvUrl : videoInfo.ws_flv
            } else {
              that.msgWarn('加载视频失败')
            }
          })
          .catch(() => {
            that.msgWarn('加载视频失败')
          })
      })
    },
    // 国标设备控制
    ptzCamera(leftRight, upDown, zoom, cmd) {
      this.active = cmd
      let cmdCode = zoom * 16 + upDown * 4 + leftRight
      const data = {
        deviceId: this.info.deviceNo,
        channelId: this.channelId,
        cmdCode,
        horizonSpeed: 180,
        verticalSpeed: 180,
        zoomSpeed: 180,
      }
      ptzControl(data).then((res) => {})
    },
    // 平台设备控制
    handleControl(action, command) {
      this.active = command
      const platformId = this.info.platformId
      const { deviceNo: cameraIndexCode } = this.info
      controlling({ action, command, cameraIndexCode, speed: 80, platformId })
    },
    handleUploadUrl(pictureUrl) {
      const deviceId = this.info.deviceId
      putVideoDevice({ deviceId, pictureUrl }).then((res) => {
        console.log(res)
      })
    },
  },
}
</script>
<style lang='scss' scoped>
.controlBox {
  position: relative;
  overflow: hidden;
  height: 400px;
}
.controlBtn {
  width: 100%;
  margin: auto;
  position: absolute;
  top: 50%;
  margin-top: -130px;
  text-align: center;
  i {
    font-size: 28px;
    line-height: 45px;
    cursor: pointer;
  }
  .topBtn,
  .bottomBtn {
    width: 100%;
    display: inline-block;
  }
}
.active {
  color: #ccc;
}
.talking {
  color: #333;
}
.plusBtn {
  width: 50px;
}
.minusBtn {
  width: 50px;
}
</style>