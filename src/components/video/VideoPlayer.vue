<!-- 视频播放 -->
<template>
  <div id="videoContainer" ref="container" :style="{'height':height}" element-loading-text="资源加载中"
       element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" v-loading="loading">
    <div ref="player" class="player" @mouseover.prevent="  isShowControls =  videoSrc ? true : false"
         @mouseout.prevent="isShowControls = false">
      <video ref="video" preload="none" width="100%" :height="height" controls muted autoplay>
        您的浏览器不支持 video 标签。
        <source id="source" :src="videoSrc" type="application/x-mpegURL">
      </video>

      <div class="control" v-show="isShowControls">
        <div class="control-progress common-progress" v-if="duration && !isFlv">
          <div>
            <div class="buffer-bar" :style="{'width':bufferedLength}"></div>
            <el-slider v-model="currentTime" @input="hInput" input-size="small" :step="0.1" :max="duration"
                       @change="getNewTime" :show-tooltip="false"></el-slider>
          </div>
        </div>
        <div>
          <span class="control-time"
                v-if="duration && !isFlv">{{`${getFormatVideoTime(currentTime)} / ${getFormatVideoTime(duration)}`}}</span>
          <i v-show="!isFlv" :class="(playing ? 'el-icon-video-pause' : 'el-icon-video-play') + ' controls-btn'"
             @click="handlePlayOrPause"></i>
          <div class="fr" style="height:27px" v-show="!isFlv">
            <i :class="(isNotMute ? 'icon-shengyin' : 'icon-shengyinguanbi') + ' controls-btn ' "
               @click="handleMute"></i>
            <el-slider class="volume-slider" v-model="volume" width="100px" @change="volumeChange">
            </el-slider>
          </div>
        </div>
        <div class="controls-box-right">
          <i class="el-icon-camera-solid controls-btn" style="font-size: 1rem !important" @click="handleSnap"></i>
          <i :class="isFullScreen ?'icon-zuixiaohua controls-btn':'icon-quanpingzuidahua controls-btn'"
             @click="handleScreen" />
        </div>
      </div>
      <p class="noneInfo" v-if="!videoSrc">无信号</p>
    </div>
  </div>
</template>
 
<script>
import Hls from 'hls.js'
import Flv from 'flv.js'

export default {
  name: 'videoPlayer',
  props: ['videoSrc', 'height'],
  data() {
    return {
      playing: false,
      isFullScreen: false,
      isShowControls: false,
      volume: 0,
      bufferedLength: '0%',
      duration: null, //播放器总时长
      currentTime: null, //当前时间
      isNotMute: false,
      loading: false,
      hls: null,
      flvPlayer: null,
    }
  },
  watch: {
    videoSrc(val) {
      if (val.indexOf('.m3u8') !== -1) {
        this.playHls()
      }
      if (val.indexOf('.flv') !== -1) {
        this.playFlv()
      }
    },
  },
  computed: {
    isFlv() {
      if (this.videoSrc) return this.videoSrc.indexOf('.flv') !== -1
      else return false
    },
  },
  mounted() {
    const that = this
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState == 'visible' && !that.isFlv) {
        const video = that.$refs.video
        let buffered = video.buffered
        if (buffered && buffered.length > 0) {
          video.currentTime = buffered.end(0) - 0.5
        }
      }
      console.log(document.visibilityState)
    })
    this.initVideo()
  },
  methods: {
    // 播放暂停控制
    handlePlayOrPause() {
      if (!this.videoSrc) return
      this.playing = !this.playing
      if (this.playing) {
        this.$refs.video.play()
      } else {
        this.$refs.video.pause()
      }
    },
    // 声音控制
    handleMute() {
      this.isNotMute = !this.isNotMute
      if (this.isNotMute) {
        this.$refs.video.volume = 0.5
        this.volume = 50
      } else {
        this.$refs.video.muted = true
      }
    },
    // 全屏
    handleScreen() {
      this.isFullScreen = !this.isFullScreen
      if (this.isFullScreen) {
        this.$refs.player.webkitRequestFullScreen()
      } else {
        document.webkitCancelFullScreen()
      }
    },
    //格式化时间
    getFormatVideoTime(t) {
      let m = Math.floor(t / 60)
      m < 10 && (m = '0' + m)
      return m + ':' + ((t % 60) / 100).toFixed(2).slice(-2)
    },
    playHls() {
      console.log('开始播放hls:' + this.videoSrc)
      const that = this
      const video = that.$refs.video
      if (Hls.isSupported()) {
        if (that.hls) {
          console.log('hls destroy')
          that.hls.destroy()
          that.hls = null
        }
        that.hls = new Hls()
        that.hls.loadSource(that.videoSrc)
        that.hls.attachMedia(video)
        that.hls.on(Hls.Events.MANIFEST_PARSED, function () {
          console.log('hls video play')
          video.play()
        })
        that.hls.on(Hls.Events.LEVEL_LOADED, () => {
          that.playing = true
          that.loading = false
        })
        that.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          that.loading = true
          that.volume = 0
          that.isNotMute = false
        })
        that.hls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            console.log('hls error:' + JSON.parse(data))
            switch (data.type) {
              //网络相关错误
              case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                console.log('fatal network error encountered, try to recover')
                that.hls.startLoad()
                break
              //媒体/视频相关的错误
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('fatal media error encountered, try to recover')
                that.hls.recoverMediaError()
                break
              default:
                // cannot recover
                that.playing = false
                that.loading = false
                that.hls.destroy()
                break
            }
          }
        })
      } else {
        console.log('该浏览器不支持hls协议')
      }
    },
    initVideo() {
      const that = this
      that.$nextTick(() => {
        const video = that.$refs.video
        video.addEventListener('timeupdate', function () {
          that.currentTime = video.currentTime
          that.duration = video.duration
          if (that.duration > 0) {
            for (var i = 0; i < video.buffered.length; i++) {
              // 寻找当前时间之后最近的点
              if (video.buffered.start(video.buffered.length - 1 - i) < video.currentTime) {
                that.bufferedLength = (video.buffered.end(video.buffered.length - 1 - i) / that.duration) * 100 + '%'
                break
              }
            }
          }
        })
      })
    },
    playFlv() {
      console.log('开始播放flv:' + this.videoSrc)
      const that = this
      const video = that.$refs.video
      if (Flv.isSupported()) {
        if (this.flvPlayer) {
          this.flvPlayer.pause()
          this.flvPlayer.unload()
          this.flvPlayer.detachMediaElement()
          this.flvPlayer.destroy()
          this.flvPlayer = null
        }
        this.flvPlayer = Flv.createPlayer({
          type: 'flv',
          isLive: true,
          hasAudio: false,
          url: that.videoSrc,
        })
        this.flvPlayer.attachMediaElement(video)
        this.flvPlayer.load()
        this.flvPlayer.play()
      }
    },
    // 截图
    handleSnap() {
      let videoCanvas = document.createElement('canvas')
      let video = this.$refs.video
      videoCanvas.setAttribute('width', video.videoWidth)
      videoCanvas.setAttribute('height', video.videoHeight)
      videoCanvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
      const canvasLink = videoCanvas.toDataURL()
      let oA = document.createElement('a')
      oA.download = this.parseTime(new Date()) // 设置下载的文件名，默认是'下载'
      oA.href = canvasLink
      document.body.appendChild(oA)
      oA.click() // 生成虚拟a标签之后触发点击事件进行下载；
      oA.remove() // 下载之后把创建的元素删除
    },
    volumeChange(val) {
      this.$refs.video.volume = val / 100

      if (val > 0) {
        this.$refs.video.muted = false
        this.isNotMute = true
      } else {
        this.$refs.video.muted = true
        this.isNotMute = false
      }
    },
  },
}
</script>
<style lang='less' scoped>
#videoContainer {
  width: 100%;
  position: relative;
  background-color: #000;
}
.player video {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
}
.control {
  display: flex;
  align-items: center;
  background-color: rgba(105, 107, 110, 0.7);
}
.player .control {
  position: absolute;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  left: 50%;
  bottom: 0px;
  transform: translateX(-50%);
  z-index: 999;
}
.controls-btn {
  width: 20px;
  color: rgb(255, 255, 255);
  line-height: 27px;
  margin: 0px 10px;
  padding: 0px 2px;
  cursor: pointer;
  text-align: center;
  font-size: 1rem !important;
}
.controls-box-right {
  position: absolute;
  right: 0;
}
video::-webkit-media-controls-enclosure {
  display: none;
}
.volumeBtn {
  display: inline-block;
}
.volume-slider {
  float: right;
  width: 100px;
  margin-left: 5px;
  margin-top: -5px;
}
.control-progress {
  width: 100%;
  position: absolute;
  bottom: 30px;
  height: 32px;
}
.buffer-bar {
  width: 100%;
  z-index: 5;
  height: 6px;
  bottom: 10px;
  position: absolute;
  background-color: rgba(139, 145, 153, 0.7);
}
/deep/.el-slider__bar {
  background-color: #2975ff !important;
  z-index: 6;
}
/deep/ .el-slider__button {
  height: 12px;
  width: 12px;
}
.control-time {
  color: #fff;
  padding-left: 10px;
  font-size: 14px;
}
.volume-num {
  color: #fff;
  float: right;
  font-size: 12px;
}
.noneInfo {
  position: absolute;
  height: 40px;
  line-height: 40px;
  top: 50%;
  margin-top: -20px;
  width: 100%;
  text-align: center;
  color: #fff;
}
</style>