<!-- 区域绘制 -->
<template>
  <div>
    <el-button type="primary" size="mini" @click="addInteraction">开始绘制</el-button>
    <el-button type="warning" size="mini" @click="startEditPolygo">开始编辑</el-button>
    <el-button @click="closeEditPolygon" size="mini" type="info">结束编辑</el-button>
    <el-button type="warning" size="mini" @click="handleClear">清除</el-button>
    <span class="ml-m" style="color:grey">(鼠标左键单击开始绘制，双击结束绘制)</span>
    <div id="areaMap" class="mt-m"></div>
  </div>
</template>

<script>
import { mapServerPath } from '@/config/env'
import { Map, View, Overlay, Feature } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { Vector as VectorSource, Cluster } from 'ol/source'
import { Polygon, Point } from 'ol/geom'
import { Vector as VectorLayer } from 'ol/layer'
import { Style, Fill, Icon, Text, Stroke, Circle as sCircle } from 'ol/style'
import { defaults as defaultControls } from 'ol/control'
import { TileSuperMapRest } from '@supermap/iclient-ol'
import { Draw, Modify, Select } from 'ol/interaction'
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
      fenceSource: null,
      fenceDraw: null,
      polygonPath: null,
      mapServerPath: mapServerPath,
    }
  },
  props: {
    path: {
      type: String,
      default: null,
    },
  },
  computed: {},
  watch: {},
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      const tileLayer = new TileLayer({
        source: new TileSuperMapRest({
          url: this.mapServerPath,
          wrapX: true,
        }),
        projection: 'EPSG:4326',
      })
      this.fenceSource = new VectorSource({ wrapX: false })
      const vector = new VectorLayer({
        source: this.fenceSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(49,173,252, 0.2)',
          }),
          stroke: new Stroke({
            color: '#0099FF',
            width: 3,
          }),
          image: new sCircle({
            radius: 7,
            fill: new Fill({
              color: '#0099FF',
            }),
          }),
        }),
      })
      this.map = new Map({
        view: new View({
          center: [116.4, 39.92], //地图中心点
          zoom: 5, // 缩放级别
          maxZoom: 18,
          minZoom: 4,
          projection: 'EPSG:4326',
          multiWorld: true,
        }),
        target: 'areaMap', // DOM容器
        controls: defaultControls({
          zoom: false,
          rotate: false,
          attribution: false,
        }),
      })
      this.map.addLayer(tileLayer)
      this.map.addLayer(vector)
      if (this.path) {
        this.setFenceSource(this.path)
      }
    },
    addInteraction() {
      this.handleClear()
      this.fenceDraw = new Draw({
        source: this.fenceSource,
        type: 'Polygon',
      })
      this.fenceDraw.on('drawend', (e) => {
        // 绘制完成的回调
        this.drawEnd(e)
        this.handleSave()
      })
      this.map.addInteraction(this.fenceDraw)
    },
    handleClear() {
      this.fenceSource.clear()
      this.map.removeInteraction(this.fenceDraw)
    },
    handleSave() {
      // 保存
      if (!this.polygonPath) return this.msgWarn('请先绘制区域')
      const path = this.formatFenceData()
      this.$emit('setPath', path)
      this.map.removeInteraction(this.fenceDraw)
    },
    // 绘制完成解析结构
    drawEnd(evt) {
      let geo = evt.feature.getGeometry()
      let type = geo.getType() //获取类型
      const handle = {
        Polygon: () => {
          //获取坐标点
          let points = geo.getCoordinates()
          this.polygonPath = points[0]
        },
      }
      if (handle[type]) handle[type]()
    },
    // 数据处理
    formatFenceData() {
      const handle = {
        Polygon: () => {
          if (this.polygonPath.length === 0) {
            this.$message.error(this.$t('lan_map.lan_map_fences.pdrwf'))
            return
          }
          const path = this.polygonPath
          const pathArr = []
          path.forEach((item) => {
            const p = item
            const obj = {
              Q: p[1],
              R: p[0],
              lng: p[0],
              lat: p[1],
            }
            pathArr.push(obj)
          })
          return pathArr
        },
      }
      const type = 'Polygon'
      if (handle[type]) {
        return handle[type]()
      }
    },
    formatArea(area) {
      const arr = JSON.parse(area)
      return arr.map((item) => {
        return [item.lng, item.lat]
      })
    },
    // 绘制围栏
    setFenceSource(area) {
      const path = this.formatArea(area)
      let feature = new Feature(new Polygon([path]))
      // 缩放到围栏区域
      this.mapFit(feature.getGeometry())
      //矢量图层
      this.fenceSource = new VectorSource({
        features: [feature],
      })
      let vector = new VectorLayer({
        source: this.fenceSource,
        style: new Style({
          fill: new Fill({
            color: 'rgba(49,173,252, 0.2)',
          }),
          stroke: new Stroke({
            color: '#0099FF',
            width: 3,
          }),
          image: new sCircle({
            radius: 7,
            fill: new Fill({
              color: '#0099FF',
            }),
          }),
        }),
      })
      this.fenceVector = vector
      this.map.addLayer(vector)
    },
    // 按边界缩放
    mapFit(extent) {
      this.map.getView().fit(extent, { duration: 1000, padding: [200, 200, 200, 200] })
    },
    // 开始编辑
    startEditPolygo() {
      this.clearInteraction()
      this.select = new Select({
        wrapX: false,
      })
      this.modify = new Modify({
        features: this.select.getFeatures(),
      })
      this.map.addInteraction(this.select)
      this.map.addInteraction(this.modify)
      this.modify.on('modifyend', (e) => {
        let geo = e.features.item(0).getGeometry()
        let type = geo.getType() //获取类型
        const handle = {
          Polygon: () => {
            //获取坐标点
            let points = geo.getCoordinates()
            this.polygonPath = points[0]
          },
        }
        if (handle[type]) handle[type]()
        // 绘制完成的回调
        this.handleSave()
      })
    },
    // 结束编辑
    closeEditPolygon() {
      this.clearInteraction()
    },
    clearInteraction() {
      if (this.modify) {
        this.map.removeInteraction(this.modify)
      }
      if (this.select) {
        this.map.removeInteraction(this.select)
      }
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