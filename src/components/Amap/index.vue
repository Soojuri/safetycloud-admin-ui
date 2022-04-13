<!-- element-ui 高德地图组件 vue-ampa -->
<template>
  <div class="amap-box">
    <div>
      <p v-if="address">
        <i class="el-icon-location-information"></i>当前地址：{{address}}
      </p>
    </div>

    <div class="map-contaier" id="container" :style="containerSize">
      <div class="search-box">
        <input v-model="searchKeyword" type="search" autocomplete="off" id="search">
        <button @click="searchByHand" class="search-but">搜索</button>
        <div class="tip-box" id="searchTip"></div>
      </div>

      <el-amap :amap-manager="amapManager" :zoom="zoom" :vid="vid" :center="center" :events="events" :plugin="plugin">
        <!-- 标记 -->
        <el-amap-marker :position="marker"></el-amap-marker>
      </el-amap>
    </div>
  </div>
</template>

<script>
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap"
let amapManager = new AMapManager()
export default {
  name: "amap",
  props: {
    zoom: {
      type: Number,
      default: () => 14  // 地图显示缩放级别 取值范围 [3-18]
    },
    currentCenter: {
      type: Array,
      default: () => [118.675847, 24.87435]   // 地图中心  默认泉州市
    },
    currentMarker: {
      type: Array,
      default: () => [118.675847, 24.87435]  // 地图标记点位  默认泉州市
    },
    width: {
      type: String,
      default: '900px'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  created () {

  },
  mounted () {
    this.$emit("updateLocation", this.lng, this.lat, this.address)
  },
  computed: {
    containerSize () {
      return "width:" + this.width + "; height:" + this.height + ";"
    },
  },
  data () {
    let self = this
    return {
      amapManager,                 // 地图管理对象
      vid: "amap",                 // 地图容器节点ID  
      center: this.currentCenter,  // 地图中心
      marker: this.currentMarker,  // 地图标记点位
      lng: '',
      lat: '',
      address: '福建省泉州市丰泽区东海街道海星街266号泉州市人民政府',
      searchKeyword: '',
      poiPicker: null,
      map: null,
      events: {     // 地图事件集合
        click (e) {  // 点击事件
          self.markers = []
          let { lng, lat } = e.lnglat
          self.lng = lng
          self.lat = lat
          self.center = [lng, lat]
          self.marker = [lng, lat]
          // 这里通过高德 SDK 完成。
          let geocoder = new AMap.Geocoder({  // 地理编码与逆地理编码服务，用于地址描述与坐标间的相互转换
            radius: 1000,      // 以给定坐标为中心点取值半径
            extensions: "all"  // base，返回基本地址信息；  all，返回地址信息及附近poi、道路、道路交叉口等信息
          })
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress
                // self.searchKeyword = result.regeocode.formattedAddress;
                self.$emit("updateLocation", self.lng, self.lat, result.regeocode.formattedAddress)
                self.$nextTick()
              }
            }
          })
        }
      },
      plugin: {     // 地图插件集合

      }
    }
  },
  created () {
    this.initSearch()
  },

  methods: {
    initSearch () {  // 搜索地址
      let vm = this
      let map = this.amapManager.getMap()
      AMapUI.loadUI(["misc/PoiPicker"], function (PoiPicker) {
        let poiPicker = new PoiPicker({
          input: "search", // 输入框ID
          placeSearchOptions: {
            map: map,
            pageSize: 10
          },
          suggestContainer: "searchTip",    //输入提示显示DOM
          searchResultsContainer: "searchTip"  //搜索结果显示DOM
        })
        vm.poiPicker = poiPicker
        // 监听poi选中信息
        poiPicker.on("poiPicked", function (poiResult) {
          let source = poiResult.source
          let poi = poiResult.item
          if (source !== "search") {
            poiPicker.searchByKeyword(poi.name)
          } else {
            poiPicker.clearSearchResults()
            vm.marker = []
            let lng = poi.location.lng
            let lat = poi.location.lat
            let address = poi.name // poi.cityname + poi.adname + poi.name
            vm.center = [lng, lat]
            vm.marker = [lng, lat]
            vm.lng = lng
            vm.lat = lat
            vm.address = address
            vm.searchKeyword = address
            vm.$emit("updateLocation", lng, lat, vm.address)
          }
        })
      })
    },

    searchByHand () {
      if (this.searchKeyword != '') {
        this.poiPicker.searchByKeyword(this.searchKeyword)
      }
    }
  },

}
</script>

<style scoped>
#container {
  position: relative;
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