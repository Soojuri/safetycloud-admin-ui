<template>
  <!--视频窗口展示-->
  <div id="playWnd" class="playWnd" v-bind:style="{'width':widthStyle+'px','height':heightStyle+'px'}" style="margin: 30px 0 0 30px;
    border: 1px solid red; left: 30px; top: 133px;" v-html="playWndHTML"></div>
</template>

<script>
export default {
  props: {
    widthStyle: {
      type: Number,
      default: 600,
    },
    heightStyle: {
      type: Number,
      default: 300,
    },
  },
  name: 'simplepreview',
  data() {
    return {
      actionWnd: undefined,
      streamMode: 0,
      transMode: 1,
      gpuMode: 0,
      wndId: -1,
      playWndHTML: '',
      pubKey: '',
      initCount: 0,
      oWebControl: undefined,
      appkey: '22846538', //综合安防管理平台提供的appkey，必填
      secret: 'm0KKHcxpHsMWzg5CGsFW', //综合安防管理平台提供的secret，必填
      ip: '10.11.1.55', //综合安防管理平台IP地址，必填
      playMode: 0, //初始播放模式：0-预览，1-回放
      port: 5126, //综合安防管理平台端口，若启用HTTPS协议，默认443
      snapDir: 'D:\\SnapDir', //抓图存储路径
      videoDir: 'D:\\VideoDir', //紧急录像或录像剪辑存储路径
      layout: '1x1', //playMode指定模式的布局
      enableHTTPS: 1, //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
      encryptedFields: 'secret', //加密字段，默认加密领域为secret
      showToolbar: 1, //是否显示工具栏，0-不显示，非0-显示
      showSmart: 0, //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
      buttonIDs: '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769', //自定义工具条按钮
    }
  },
  created() {
    this.initPlugin()
  },
  beforeDestroy() {
    this.close()
  },
  mounted() {
    window.addEventListener('scroll', this.paperScroll)
    if (this.oWebControl != null) {
      this.oWebControl.JS_Resize(this.widthStyle, this.heightStyle)
      this.setWndCover()
    }
  },
  methods: {
    close() {
      if (this.oWebControl != null) {
        this.oWebControl.JS_HideWnd() // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
        this.oWebControl.JS_Disconnect().then(
          function () {
            // 断开与插件服务连接成功
            this.oWebControl = null
          },
          function () {
            // 断开与插件服务连接失败
          }
        )
      }
    },
    initPlugin() {
      if (this.oWebControl != null) {
        return
      }
      this.oWebControl = new WebControl({
        szPluginContainer: 'playWnd', // 指定容器id
        iServicePortStart: 15900, // 指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        szClassId: '23BF3B0A-2C56-4D97-9C03-0CB103AA8F11', // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: () => {
          this.$emit('isOk', true)
          // 创建WebControl实例成功
          this.oWebControl
            .JS_StartService('window', {
              // WebControl实例创建成功后需要启动服务
              dllPath: './VideoPluginConnect.dll', // 值"./VideoPluginConnect.dll"写死
            })
            .then(
              () => {
                // 启动插件服务成功
                this.oWebControl.JS_SetWindowControlCallback({
                  // 设置消息回调
                  cbIntegrationCallBack: this.cbIntegrationCallBack,
                })

                this.oWebControl.JS_CreateWnd('playWnd', this.widthStyle, this.heightStyle).then(() => {
                  //JS_CreateWnd创建视频播放窗口，宽高可设定
                  this.init() // 创建播放实例成功后初始化
                })
              },
              function () {
                // 启动插件服务失败
              }
            )
        },
        cbConnectError: () => {
          const that = this
          // 创建WebControl实例失败
          this.oWebControl = null
          this.playWndHTML = '正在尝试启动插件播放，请稍候...'
          WebControl.JS_WakeUp('VideoWebPlugin://') // 程序未启动时执行error函数，采用wakeup来启动程序
          this.initCount++
          if (this.initCount < 3) {
            setTimeout(function () {
              that.initPlugin()
            }, 3000)
          } else {
            this.$emit('isOk', false)
            this.playWndHTML = '插件启动失败，请检查插件是否安装！'
          }
        },
        cbConnectClose: (bNormalClose) => {
          // 异常断开：bNormalClose = false
          // JS_Disconnect正常断开：bNormalClose = true
          console.log('cbConnectClose')
          this.oWebControl = null
        },
      })
    },
    init() {
      this.getPubKey(() => {
        ////////////////////////////////// 请自行修改以下变量值	////////////////////////////////////
        var appkey = this.appkey //综合安防管理平台提供的appkey，必填
        var secret = this.setEncrypt(this.secret) //综合安防管理平台提供的secret，必填
        var ip = this.ip //综合安防管理平台IP地址，必填
        var playMode = this.playMode //初始播放模式：0-预览，1-回放
        var port = this.port //综合安防管理平台端口，若启用HTTPS协议，默认443
        var snapDir = this.snapDir //抓图存储路径
        var videoDir = this.videoDir //紧急录像或录像剪辑存储路径
        var layout = this.layout //playMode指定模式的布局
        var enableHTTPS = this.enableHTTPS //是否启用HTTPS协议与综合安防管理平台交互，这里总是填1
        var encryptedFields = this.encryptedFields //加密字段，默认加密领域为secret
        var showToolbar = this.showToolbar //是否显示工具栏，0-不显示，非0-显示
        var showSmart = this.showSmart //是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
        var buttonIDs = this.buttonIDs //自定义工具条按钮
        ////////////////////////////////// 请自行修改以上变量值	////////////////////////////////////

        this.oWebControl
          .JS_RequestInterface({
            funcName: 'init',
            argument: JSON.stringify({
              appkey: appkey, //API网关提供的appkey
              secret: secret, //API网关提供的secret
              ip: ip, //API网关IP地址
              playMode: playMode, //播放模式（决定显示预览还是回放界面）
              port: port, //端口
              snapDir: snapDir, //抓图存储路径
              videoDir: videoDir, //紧急录像或录像剪辑存储路径
              layout: layout, //布局
              enableHTTPS: enableHTTPS, //是否启用HTTPS协议
              encryptedFields: encryptedFields, //加密字段
              showToolbar: showToolbar, //是否显示工具栏
              showSmart: showSmart, //是否显示智能信息
              buttonIDs: buttonIDs, //自定义工具条按钮
            }),
          })
          .then((oData) => {
            this.oWebControl.JS_Resize(this.widthStyle, this.heightStyle) // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
            this.$emit('tvwallWndsClick')
          })
      })
    },
    getPubKey(callback) {
      this.oWebControl
        .JS_RequestInterface({
          funcName: 'getRSAPubKey',
          argument: JSON.stringify({
            keyLength: 1024,
          }),
        })
        .then((oData) => {
          console.log(oData)
          if (oData.responseMsg.data) {
            this.pubKey = oData.responseMsg.data
            callback()
          }
        })
    },

    // 推送消息
    cbIntegrationCallBack(oData) {
      console.log(JSON.stringify(oData.responseMsg))
      if (oData.responseMsg.type == 1) {
        //窗口选中消息
        this.actionWnd = oData.responseMsg.msg
      }
    },
    //RSA加密
    setEncrypt(value) {
      var encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.pubKey)
      return encrypt.encrypt(value)
    },
    // 设置窗口控制回调
    setCallbacks() {
      this.oWebControl.JS_SetWindowControlCallback({
        cbIntegrationCallBack: this.cbIntegrationCallBack,
      })
    },
    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    setWndCover() {
      var iWidth = $(window).width()
      var iHeight = $(window).height()
      var oDivRect = $('#playWnd').get(0).getBoundingClientRect()

      var iCoverLeft = oDivRect.left < 0 ? Math.abs(oDivRect.left) : 0
      var iCoverTop = oDivRect.top < 0 ? Math.abs(oDivRect.top) : 0
      var iCoverRight = oDivRect.right - iWidth > 0 ? Math.round(oDivRect.right - iWidth) : 0
      var iCoverBottom = oDivRect.bottom - iHeight > 0 ? Math.round(oDivRect.bottom - iHeight) : 0

      iCoverLeft = iCoverLeft > this.widthStyle ? this.widthStyle : iCoverLeft
      iCoverTop = iCoverTop > this.heightStyle ? this.heightStyle : iCoverTop
      iCoverRight = iCoverRight > this.widthStyle ? this.widthStyle : iCoverRight
      iCoverBottom = iCoverBottom > this.heightStyle ? this.heightStyle : iCoverBottom

      this.oWebControl.JS_RepairPartWindow(0, 0, this.widthStyle + 1, this.heightStyle) // 多1个像素点防止还原后边界缺失一个像素条
      if (iCoverLeft != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, this.heightStyle)
      }
      if (iCoverTop != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, this.widthStyle + 1, iCoverTop) // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
      }
      if (iCoverRight != 0) {
        this.oWebControl.JS_CuttingPartWindow(this.widthStyle - iCoverRight, 0, iCoverRight, this.heightStyle)
      }
      if (iCoverBottom != 0) {
        this.oWebControl.JS_CuttingPartWindow(0, this.heightStyle - iCoverBottom, this.widthStyle, iCoverBottom)
      }
    },
    paperScroll() {
      if (this.oWebControl != null) {
        this.oWebControl.JS_Resize(this.widthStyle, this.heightStyle)
        this.setWndCover()
      }
    },
    //设置播放
    startPreview(cameraIndexCode, wndId) {
      this.oWebControl.JS_RequestInterface({
        funcName: 'startPreview',
        argument: JSON.stringify({
          cameraIndexCode: cameraIndexCode, //监控点编号
          streamMode: this.streamMode, //主子码流标识
          transMode: this.transMode, //传输协议
          gpuMode: this.gpuMode, //是否开启GPU硬解
          wndId: wndId == undefined ? this.wndId : wndId, //可指定播放窗口
        }),
      })
    },
    //设置布局
    setLayout(layout) {
      this.oWebControl.JS_RequestInterface({
        funcName: 'setLayout',
        argument: {
          layout: layout,
        },
      })
    },
    //初始化是赋值布局
    initLayout(layout) {
      this.layout = layout
    },
    stopPlay(wndIds) {
      this.oWebControl.JS_RequestInterface({
        funcName: 'stopMultiPlay',
        argument: {
          list: wndIds,
        },
      })
    },
  },
}
</script>

<style type="text/css">
</style>
