<!-- 视频播放器 -->
<template>

  <div>
    <video-player ref="videoPlayer" @uploadUrl="handleUploadUrl" height="350px" :videoSrc="videoSrc">
    </video-player>
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
    cameraInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    dict: {
      type: Object,
      default: () => {
        return []
      },
    },
  },
  computed: {},
  watch: {},
  mounted() {
    const protocol = this.cameraInfo.protocolType
    if (protocol == 2) {
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
      const info = this.cameraInfo
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
      const deviceId = this.cameraInfo.deviceNo
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
        deviceId: this.cameraInfo.deviceNo,
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
      const { deviceNo: cameraIndexCode } = this.cameraInfo
      controlling({ action, command, cameraIndexCode, speed: 80 })
    },
    handleUploadUrl(pictureUrl) {
      const deviceId = this.cameraInfo.deviceId
      putVideoDevice({ deviceId, pictureUrl })
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