<template>
  <div class="amap-box">
    <div>
      <p v-if="point">
        <i class="el-icon-location-information"></i>当前坐标：{{point}}
      </p>
    </div>
    <div class="map-contaier" id="container" :style="containerSize">
      <div id="gis-map"></div>
    </div>

  </div>
</template>

<script>
import { mapServerPath } from '@/config/env'
import { Map, View, Overlay, Feature } from 'ol'
import TileLayer from 'ol/layer/Tile'
import { Vector as VectorSource, Cluster } from 'ol/source'
import { Polygon, Point } from 'ol/geom'
import { Vector as VectorLayer, Markers } from 'ol/layer'
import { Style, Fill, Icon, Text, Stroke, Circle as sCircle } from 'ol/style'
import { defaults as defaultControls } from 'ol/control'
import { TileSuperMapRest } from '@supermap/iclient-ol'
import cameraIcon from '@/assets/images/camera-manage/map-icon-camera.png'
import { Draw, Modify, Select } from 'ol/interaction'
export default {
  name: 'gisPoint',
  props: {
    zoom: {
      type: Number,
      default: () => 14, // 地图显示缩放级别 取值范围 [3-18]
    },
    currentCenter: {
      type: Array,
      default: () => [118.675847, 24.87435], // 地图中心  默认泉州市
    },
    currentMarker: {
      type: Array,
      default: () => [118.675847, 24.87435], // 地图标记点位  默认泉州市
    },
    width: {
      type: String,
      default: '900px',
    },
    height: {
      type: String,
      default: '500px',
    },
  },
  data() {
    return {
      point: null,
      map: null,
      mouseTool: null,
      fenceSource: null,
      fenceDraw: null,
      polygonPath: null,
      mapServerPath: mapServerPath,
      markerLayer: null,
    }
  },
  mounted() {
    this.initMap()
  },
  computed: {
    containerSize() {
      return 'width:' + this.width + '; height:' + this.height + ';'
    },
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
          zoom: 6, // 缩放级别
          maxZoom: 18,
          minZoom: 4,
          projection: 'EPSG:4326',
          multiWorld: true,
        }),
        target: 'gis-map', // DOM容器
        controls: defaultControls({
          zoom: false,
          rotate: false,
          attribution: false,
        }),
      })
      this.map.addLayer(tileLayer)
      this.map.addLayer(vector)
      this.map.on('singleclick', (evt) => {
        this.point = evt.coordinate.join()
        this.setMarker(evt.coordinate)
      })
    },
    setMarker(point) {
      this.markerLayer && this.map.removeLayer(this.markerLayer)
      this.markerLayer = null
      const iconFeature = new Feature({
        geometry: new Point(point),
        name: 'Null Island',
        population: 4000,
        rainfall: 500,
      })
      const iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1], // 显示位置
          size: [80, 80], // 尺寸
          scale: 0.6,
          src: cameraIcon, // 图片url
        }),
      })
      iconFeature.setStyle(iconStyle)
      const vectorSource = new VectorSource({
        features: [iconFeature],
      })
      this.markerLayer = new VectorLayer({
        source: vectorSource,
      })
      this.map.addLayer(this.markerLayer)
      this.$emit('updateLocation', point[0].toFixed(10), point[1].toFixed(10))
    },
  },
}
</script>

<style>
#container {
  position: relative;
}
#gis-map {
  width: 100%;
  height: 500px;
  box-sizing: border-box;
}
.search-box {
  position: absolute;
  z-index: 5;
  width: 50%;
  left: 5%;
  top: 30px;
  height: 30px;
}
.search-box input {
  float: left;
  width: 80%;
  height: 100%;
  border: 1px solid #38f;
  padding: 0 8px;
}
.search-box button {
  float: left;
  width: 20%;
  height: 100%;
  background: #38f;
  border: 1px solid #38f;
  color: #fff;
  cursor: pointer;
}
.tip-box {
  width: 100%;
  max-height: 260px;
  position: absolute;
  top: 30px;
  overflow-y: auto;
  background-color: #fff;
}
</style>