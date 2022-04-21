<!-- 视频播放器 -->
<template>
  <div class=''>
    <el-dialog title="视频播放" width="1000px" :visible="visible" @close="handleClose">
      <el-row>
        <el-col :span="16">
          <div ref="player">
            <!-- <EasyPlayer :videoUrl="getUrlByStreamInfo(streamInfo)" @message="videoError" :timeout="10" autoplay stretch
                        :decodeWasm="videoEncoding && videoEncoding === 'H265' ">
            </EasyPlayer> -->
            <player ref="videoPlayer" :visible.sync="visible" :videoUrl="getUrlByStreamInfo(streamInfo)"
                    :error="videoError" :hasAudio="true" :message="videoError" :height="false" fluent autoplay live>
            </player>
          </div>

          <el-form class="mt-m" :model="form" :inline="true">
            <!-- <el-form-item label="旋转角度">
              <el-select v-model="form.rotate" @change="handleRotateChange">
                <el-option label="0" :value="0"></el-option>
                <el-option label="180" :value="180"></el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="播放格式">
              <el-radio-group v-model="form.type" size="small">
                <el-radio-button label="rtc"></el-radio-button>
                <el-radio-button label="ws_flv"></el-radio-button>
                <el-radio-button label="flv"></el-radio-button>
                <el-radio-button label="hls"></el-radio-button>
                <el-radio-button label="fmp4"></el-radio-button>
              </el-radio-group>
            </el-form-item> -->
          </el-form>
        </el-col>
        <el-col :span="8">
          <div class="controlBtn">
            <i :class="`el-icon-caret-top topBtn ${active === 'top' ? 'active' : ''}`"
               @mousedown.prevent="ptzCamera(0, 2, 0,'top')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
            <i :class="`el-icon-caret-left  mr-xl ${active === 'left' ? 'active' : ''}`"
               @mousedown.prevent="ptzCamera(2, 0, 0,'left')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
            <!-- <i :class="`el-icon-microphone  ${active === 'talk' ? 'active' : ''}`"
               @mousedown.prevent="ptzCamera(0,0,0,'talk')" title="按住讲话" v-if="canTalk()" />
            <i class="el-icon-turn-off-microphone" title="由于浏览器安全策略, 非 HTTPS 或 localhost 访问, 对讲不可用" v-else></i> -->
            <i :class="`el-icon-caret-right  ml-xl ${active === 'right' ? 'active' : ''}`"
               @mousedown.prevent="ptzCamera(1, 0, 0,'right')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
            <i :class="`el-icon-caret-bottom bottomBtn ${active==='bottom' ? 'active' : '' }`"
               @mousedown.prevent="ptzCamera(0, 1, 0,'bottom')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
            <i :class="`el-icon-circle-plus plusBtn  ${active==='plus' ? 'active' : '' }`"
               @mousedown.prevent="ptzCamera(0, 0, 1,'plus')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
            <i :class="`el-icon-remove minusBtn ${active==='minus' ? 'active' : '' }`"
               @mousedown.prevent="ptzCamera(0, 0, 2,'minus')" @mouseup.prevent="ptzCamera(0, 0, 0)"></i>
          </div>
          <div class="track">
            <div v-for="(item, index) in tracks">
              <span>流 {{index+1}}</span>
              <div v-if="item.codec_type == 0">
                <el-col :span="12">
                  <p>格式: {{item.codec_id_name}}</p>
                  <p>类型: 视频</p>
                </el-col>
                <el-col :span="12">
                  <p>分辨率: {{item.width}} x {{item.height}}</p>
                  <p>帧率: {{item.fps}}</p>
                </el-col>
              </div>
              <div v-if="item.codec_type == 1">
                <el-col :span="12">
                  <p>格式: {{item.codec_id_name}}</p>
                  <p>类型: 音频</p>
                </el-col>
                <el-col :span="12">
                  <p>采样位数: {{item.sample_bit}}</p>
                  <p>采样率: {{item.sample_rate}}</p>
                </el-col>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
import player from '@/components/jessibucaVideo/jessibuca.vue'
import { ptzControl, getMediaInfo } from '@/api/app/camera/gbChannel'
export default {
  name: 'video-dialog',
  components: { player },
  data() {
    return {
      videoUrl: '',
      poster: '',
      loading: true,
      active: '',
      recorder: null,
      controlSpeed: 180,
      tracks: [],
      form: {
        type: 'ws_flv',
        rotate: 0,
      },
      decodeWasm: false, //是否强制H265解码
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    streamInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    deviceId: '',
    channelId: '',
    videoEncoding: null, //视频编码格式
  },
  computed: {},
  watch: {},

  mounted() {
    window.addEventListener('mouseup', () => {
      this.ptzStop()
    })
    this.getInfo()
  },

  methods: {
    getInfo() {
      const { mediaServerId, app, streamId } = this.streamInfo
      const schema = 'rtmp'
      getMediaInfo({ mediaServerId, app, stream: streamId, schema }).then((res) => {
        if (res.data.data.code == 0 && res.data.data.online) {
          this.tracks = res.data.data.tracks
          const streamInfo = res.data.data.tracks.find((item) => item.codec_type === 0)
          this.videoEncoding = streamInfo.codec_id_name
        } else {
          this.msgWarn('获取编码信息失败')
        }
      })
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleRotateChange(rotate) {
      console.log(this.$refs.player)
      this.$refs.player.style.transform = `rotate(${rotate}deg)`
    },
    talkStop() {},
    videoError: function (e) {
      this.$message(e)
    },
    canTalk() {
      return (
        window.location.protocol.indexOf('https') == 0 ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1'
      )
    },
    ptzStop() {
      this.active = null
    },
    ptzCamera(leftRight, upDown, zoom, cmd) {
      this.active = cmd
      let cmdCode = zoom * 16 + upDown * 4 + leftRight
      const data = {
        deviceId: this.deviceId,
        channelId: this.channelId,
        cmdCode,
        horizonSpeed: this.controlSpeed,
        verticalSpeed: this.controlSpeed,
        zoomSpeed: this.controlSpeed,
      }
      ptzControl(data).then((res) => {})
    },
    getUrlByStreamInfo(streamInfo) {
      if (location.protocol === 'https:') {
        if (streamInfo.wss_flv === null) {
          this.$message({
            showClose: true,
            message: '媒体服务器未配置ssl端口',
            type: 'error',
          })
        } else {
          const flvName = streamInfo.wss_flv.split('/rtp/')[1]
          const flvUrl = `wss://${window.location.host}/wssflv/rtp/${flvName}`
          console.log(flvUrl)
          return flvUrl
        }
      } else {
        return streamInfo.ws_flv
      }
    },
    handleError(error) {
      console.log('错误：' + error)
    },
  },
}
</script>
<style lang='scss' scoped>
.controlBtn {
  width: 200px;
  margin: auto;
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
.track {
  font-size: 12px;
  color: #333;
  margin-top: 50px;
  margin-left: 30px;
}
</style>