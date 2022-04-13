<!-- 区域绘制 -->
<template>
  <div>
    <el-button type="primary" size="mini" @click="drawPolygon">开始绘制</el-button>
    <el-button type="warning" size="mini" @click="startEditPolygo">开始编辑</el-button>
    <el-button @click="closeEditPolygon" size="mini" type="info">结束编辑</el-button>
    <el-button @click="clearPolygon" size="mini" type="danger">清除</el-button>
    <span class="ml-m" style="color:grey">(鼠标左键单击开始绘制，双击结束绘制)</span>
    <div id="areaMap" class="mt-m"></div>
  </div>
</template>

<script>
//import {} from '';
import MapLoader from '@/util/AMap' // 引入高德地图 原生api
export default {
  components: {},
  data() {
    return {
      position: {
        lat: null,
        lng: null,
      },
      map: null,
      mouseTool: null,
      timer: null,
    }
  },
  props: {
    path: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {},
  watch: {},

  mounted() {
    this.initMap()
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
  },

  methods: {
    initMap() {
      const that = this
      MapLoader().then((AMap) => {
        initAMapUI() //这里调用initAMapUI初始化
        that.map = new AMap.Map('areaMap', {
          zoom: 13,
          zooms: [3, 20], //设置地图级别范围
          center: [116.4, 39.92],
          jogEnable: false,
          resizeEnable: true,
        })
        AMap.plugin(['AMap.Geolocation', 'AMap.MouseTool', 'AMap.PolyEditor'], function () {
          if (that.path.length > 0) {
            let pathList = JSON.parse(that.path).map((item) => {
              let path = new AMap.LngLat(item.lng, item.lat)
              return path
            })
            that.path = pathList
            that.timer = setTimeout(() => {
              that.setPath()
            }, 300)
          } else {
            that.getCurrentPosition()
          }
        })
      })
    },
    getCurrentPosition() {
      let that = this
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否获取高精度定位，可能影响效率，默认false
        timeout: 10000, // 定位超时时间，ms
        needAddress: true, // 是否需要将定位结果进行逆地理编码操作
        extensions: 'all', // 是否需要详细的你地理编码信息，默认'base'
      })
      // 获取精确位置
      geolocation.getCurrentPosition(function (status, ret) {
        if (status === 'complete') {
          that.position.lng = ret.position.getLng()
          that.position.lat = ret.position.getLat()
          that.address = ret.formattedAddress
          var position = new AMap.LngLat(that.position.lng, that.position.lat) // 标准写法
          that.map.setCenter(position)
        } else {
          _this.msgError('定位失败')
        }
      })
    },
    drawPolygon() {
      const that = this
      that.mouseTool = new AMap.MouseTool(that.map)
      that.mouseTool.polygon()
      AMap.event.addListener(that.mouseTool, 'draw', function (e) {
        //添加事件
        //清除绘制的多边形
        that.mouseTool.close(true)
        that.path = e.obj.getPath()
        //整理坐标点，编辑图形
        that.setPath()
      })
    },
    setPath() {
      let path = this.path
      if (!path) return this.msgError('请先绘制区域')
      let polygon = new AMap.Polygon({
        path: path,
        strokeColor: '#FF33FF',
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 50,
        bubble: true,
      })
      this.map.add(polygon)
      // 缩放地图到合适的视野级别
      this.map.setFitView([polygon])
      this.polyEditor = new AMap.PolyEditor(this.map, polygon)
      this.$emit('setPath', path)
    },
    startEditPolygo() {
      if (this.polyEditor) {
        this.polyEditor.open()
      } else {
        this.msgWarn('请先进行区域绘制')
      }
    },
    closeEditPolygon() {
      this.polyEditor.close()
    },
    clearPolygon() {
      this.$emit('setPath', [])
      this.map.clearMap()
      this.polyEditor = null
    },
  },
}
</script>
<style lang='scss' scoped>
#areaMap {
  width: 100%;
  height: 500px;
  box-sizing: border-box;
}
</style>