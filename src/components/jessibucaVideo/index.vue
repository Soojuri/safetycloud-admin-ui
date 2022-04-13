<template>
  <div id="container" v-if="visible" ref="container" style="width: 100%; height: 400px; background-color: #000"></div>
</template>
<script>
export default {
  name: 'DemoPlayer',
  props: {
    videoUrl: '',
    hasAudio: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      jessibuca: null,
      wasm: false,
      vc: 'ff',
      playing: false,
      quieting: true,
      loaded: false, // mute
      showOperateBtns: false,
      showBandwidth: false,
      err: '',
      speed: 0,
      performance: '',
      volume: 1,
      rotate: 0,
      vod: false,
      forceNoOffscreen: true,
    }
  },
  watch: {
    videoUrl(val) {
      if (val && this.jessibuca && this.jessibuca.hasLoaded()) {
        this.jessibuca.play(val)
      }
    },
  },
  mounted() {
    this.create()
    this.play()
    window.onerror = (msg) => (this.err = msg)
  },
  beforeDestroy() {
    this.jessibuca.destroy()
  },
  methods: {
    create() {
      this.jessibuca = new window.Jessibuca({
        container: this.$refs.container,
        // videoBuffer: 0.5, // 缓存时长
        isResize: false,
        text: '',
        hasAudio: this.hasAudio,
        decoder: '/video/index.js',
        loadingText: '加载中',
        debug: false,
        showBandwidth: true, // 显示网速
        operateBtns: {
          fullscreen: true,
          screenshot: true,
          play: true,
          audio: true,
        },
        hiddenAutoPause: true,
        isFullSize: true,
        isNotMute: false,
      })
      var _this = this
      this.jessibuca.on('load', function () {
        console.log('on load')
      })

      this.jessibuca.on('log', function (msg) {
        console.log('on log', msg)
      })
      this.jessibuca.on('record', function (msg) {
        console.log('on record:', msg)
      })
      this.jessibuca.on('pause', function () {
        console.log('on pause')
        _this.playing = false
      })
      this.jessibuca.on('play', function () {
        console.log('on play')
        _this.playing = true
      })
      this.jessibuca.on('fullscreen', function (msg) {
        console.log('on fullscreen', msg)
      })

      this.jessibuca.on('mute', function (msg) {
        console.log('on mute', msg)
        _this.quieting = msg
      })

      this.jessibuca.on('mute', function (msg) {
        console.log('on mute2', msg)
      })

      this.jessibuca.on('audioInfo', function (msg) {
        console.log('audioInfo:' + msg)
      })

      this.jessibuca.on('videoInfo', function (info) {
        console.log('videoInfo:' + JSON.stringify(info))
      })

      this.jessibuca.on('error', function (error) {
        console.log('error:' + JSON.stringify(error))
      })

      this.jessibuca.on('timeout', function () {
        console.log('timeout')
      })

      this.jessibuca.on('start', function () {
        console.log('start')
      })
      this.jessibuca.on('performance', function (performance) {
        var show = '卡顿'
        if (performance === 2) {
          show = '非常流畅'
        } else if (performance === 1) {
          show = '流畅'
        }
        _this.performance = show
      })
      this.jessibuca.on('buffer', function (buffer) {})

      this.jessibuca.on('stats', function (stats) {})

      this.jessibuca.on('kBps', function (kBps) {})

      // 显示时间戳 PTS
      this.jessibuca.on('videoFrame', function () {})

      this.jessibuca.on('metadata', function () {})
    },
    play() {
      // this.jessibuca.onPlay = () => (this.playing = true);
      this.jessibuca.on('play', () => {
        this.playing = true
        this.loaded = true
        this.quieting = this.jessibuca.quieting
      })

      if (this.videoUrl) {
        if (this.jessibuca.hasLoaded()) {
          this.jessibuca.play(this.videoUrl)
        } else {
          this.jessibuca.on('load', () => {
            this.jessibuca.play(this.videoUrl)
          })
        }
      }
    },
    mute() {
      this.jessibuca.mute()
    },
    cancelMute() {
      this.jessibuca.cancelMute()
    },

    pause() {
      this.jessibuca.pause()
      this.playing = false
      this.err = ''
      this.performance = ''
    },
    volumeChange() {
      this.jessibuca.setVolume(this.volume)
    },
    rotateChange() {
      this.jessibuca.setRotate(this.rotate)
    },
    destroy() {
      if (this.jessibuca) {
        this.jessibuca.destroy()
      }
    },

    fullscreen() {
      this.jessibuca.setFullscreen(true)
    },

    screenShot() {
      this.jessibuca.screenshot()
    },
  },
}
</script>
<style>
</style>
