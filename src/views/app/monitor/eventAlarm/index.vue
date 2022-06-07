<template>
  <div class="sub-page">
    <div class="g-map-content">
      <!-- 地图放这里 -->
      <div class="map-canvas-wrap">
        <div id="locusMap"></div>
      </div>
      <div class="col-left">
        <s-box class="f1" title="事件预警排名" style=" min-height: 17vh;">
          <div class="alarm-ranks">
            <ul>
              <li v-for="(item,index) in rank">
                <i></i>
                <span>{{item.key}}</span>
                <div class="val">{{item.value}}</div>
              </li>
            </ul>
          </div>
        </s-box>
        <s-box title="事件级别分布情况" style=" width: 50vh;">
          <div class="canvas-wrap" style="height: 26vh;">
            <!-- 此处放图表 -->
            <pie :dataList="levelList" v-if="levelList.length > 0"></pie>
            <el-empty image-size="100" v-else description="暂无数据"></el-empty>
          </div>
        </s-box>
        <s-box title="事件趋势图" style=" width: 100vh;">
          <el-tabs class="tabs-s" v-model="eventStateTab" @tab-click="getDataList">
            <el-tab-pane label="今日" name="0"></el-tab-pane>
            <el-tab-pane label="本周" name="1"></el-tab-pane>
            <el-tab-pane label="本月" name="2"></el-tab-pane>
            <el-tab-pane label="全年" name="3"></el-tab-pane>
          </el-tabs>
          <div class="canvas-wrap" style="height: 30vh;">
            <!-- 此处放图表 -->
            <intelligent-recognition v-if="IntelligentRecognition.length > 0" :data="IntelligentRecognition">
            </intelligent-recognition>
            <el-empty image-size="100" v-else description="暂无数据"></el-empty>
          </div>
        </s-box>
      </div>
      <div class="col-middle">
        <div class="g-sta-cols">
          <ul>
            <li class="item-blue">
              <div class="icon-x"><i class="monitor-icon-event"></i></div>
              <span><b>{{count.allCount}}</b>设备事件总数</span>
            </li>
            <li class="item-blue-green">
              <div class="icon-x"><i class="monitor-icon-event-times"></i></div>
              <span><b>{{count.doneCount}}</b>已处理事件数</span>
            </li>
            <li class="item-orange">
              <div class="icon-x"><i class="monitor-icon-event-todo"></i></div>
              <span><b>{{count.todoCount}}</b>待处理事件总数</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-right">
        <s-box class="f1" title="最新事件预警列表">
          <div class="list-radio" slot="title-append">
            <el-radio-group v-model="eventListRadio">
              <el-radio-button label="图片"></el-radio-button>
              <el-radio-button label="列表"></el-radio-button>
            </el-radio-group>
          </div>
          <div class="event-alarm-list" :class="eventListRadio=='图片'?'img-view':'list-view'">
            <ul>
              <li v-for="(item,index) in allDevice">
                <div class="img-x">
                  <img :src="item.eventCaptureUrl" alt="">
                </div>
                <div class="content-x">
                  <h4>{{item.eventName}}</h4>
                  <p>{{item.remark}}</p>
                  <div class="time">
                    <span>{{ parseTime(item.createTime) }}</span>
                    <a class="link" href="javascript:void(0);" @click="handleDetails(item)">详情&ensp;&gt;</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </s-box>
      </div>

      <div class="g-chart-pop-dialog map-detail" v-if="visible">
        <div class="dialog-tit">
          <span>查看详情</span>
          <a href="javascript:void(0);" @click="visible = false" class="cus-icon-close-stroked"></a>
        </div>
        <div class="detail-x">
          <div class="img-x">
            <img :src="eventInfo.eventCaptureUrl" alt="">
          </div>
          <div class="lines">
            <div class="line">
              <label>事件名称</label>
              <span>{{ eventInfo.eventName }}</span>
            </div>
            <div class="line">
              <label>事件编号</label>
              <span>{{ eventInfo.eventNo }}</span>
            </div>
            <div class="line">
              <label>设备名称</label>
              <span>{{ eventInfo.deviceInfo.deviceName }}</span>
            </div>
            <div class="line">
              <label>设备编号</label>
              <span>{{ eventInfo.deviceInfo.deviceNo }}</span>
            </div>
            <div class="line">
              <label>空间目录</label>
              <span>{{ eventInfo.deviceInfo.spaceName }}</span>
            </div>
            <div class="line">
              <label>算法类型</label>
              <span>{{ eventInfo.algorithmName }}</span>
            </div>
          </div>
        </div>
        <div class="g-button-x">
          <el-button type="primary" @click="handleDetails(eventInfo)">查看详情</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pie from './charts/pie.vue'
import IntelligentRecognition from './charts/line.vue'
import MapLoader from '@/util/AMap' // 引入高德地图 原生api
import cameraIcon from '@/assets/images/camera-manage/map-icon-camera.png'
import nvrIcon from '@/assets/images/camera-manage/map-icon-nvr.png'
import { mapGetters } from 'vuex'
import SBox from '@/components/monitor/s-box.vue'
import {
  getEventList,
  getEventInfo,
  getEventStatic,
  updateEventStatus,
  reportEvent,
  getRank,
  getCount,
  getPageForMap,
  getEventTime,
  getEventLevel,
} from '@/api/app/event/manual'
export default {
  components: { SBox, IntelligentRecognition, Pie },
  data() {
    return {
      eventStateTab: '2',
      eventListRadio: '图片',
      position: {
        lng: '',
        lat: '',
      },
      IntelligentRecognition: [], //事件趋势图
      levelList: [],
      allDevice: [],
      markers: [],
      PolyEditor: null,
      eventInfo: {},
      rank: {},
      count: {},
      visible: false,
      deviceParams: {
        size: 10,
        current: 1,
      },
      alarmParams: {
        size: 10,
        current: 1,
      },
    }
  },
  mounted() {
    getEventLevel().then((res) => {
      this.levelList = res.data.data
      console.log(res.data.data)
    })
    getEventTime({ timeType: 2 }).then((res) => {
      this.IntelligentRecognition = res.data.data
    })
    this.getDictList()
    this.initMap()
  },
  methods: {
    getDataList(tab) {
      const timeType = tab.name
      getEventTime({ timeType }).then((res) => {
        this.IntelligentRecognition = res.data.data
      })
    },
    getDictList() {
      getRank().then((res) => {
        this.rank = res.data.data.rank
      })
      getCount().then((res) => {
        this.count = res.data.data
      })
    },
    initMap() {
      const that = this
      MapLoader().then((AMap) => {
        initAMapUI() //这里调用initAMapUI初始化
        that.map = new AMap.Map('locusMap', {
          zoom: 4,
          zooms: [3, 20], //设置地图级别范围
          center: [116.4, 39.92],
          jogEnable: false,
          resizeEnable: true,
        })
        AMap.plugin(['AMap.MouseTool', 'AMap.PolyEditor', 'AMap.MarkerClusterer'], function () {})
        that.getList()
      })
    },
    setPath(path) {
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
    },
    getList() {
      const that = this
      that.map.clearMap()
      that.getAllDevice()
    },
    getAllDevice() {
      const that = this
      that.map.remove(that.markers)
      that.markers = []
      getPageForMap({ size: 10000, current: 1 }).then((res) => {
        that.allDevice = res.data.data.records
        //异步加载
        AMapUI.loadUI(['overlay/SimpleInfoWindow'], function (SimpleInfoWindow) {
          that.allDevice.forEach((item, index) => {
            const icon = new AMap.Icon({
              // 图标尺寸
              size: new AMap.Size(40, 45),
              // 图标的取图地址
              image: nvrIcon,
              // 图标所用图片大小
              imageSize: new AMap.Size(40, 45),
              // 图标取图偏移量
              imageOffset: new AMap.Pixel(0, 0),
            })
            that.setMarker(item, icon)
          })
          that.setCluster()
          // that.setArea()
        })
      })
    },
    // 设置聚合点
    setCluster() {
      const markers = this.markers
      let cluster = new AMap.MarkerClusterer(this.map, markers, { gridSize: 60 })
      cluster.setMinClusterSize(5)
      cluster.setMap(this.map)
    },
    setMarker(info, icon) {
      let map = this.map
      let that = this
      let marker = new AMap.Marker({
        position: new AMap.LngLat(info.longitude, info.latitude),
        icon: icon,
        clickable: true,
        offset: new AMap.Pixel(-14, -30),
      })
      // let infoWindow = new AMap.InfoWindow({
      //   offset: new AMap.Pixel(0, -30),
      // })
      marker.on('click', (e) => {
        getEventInfo(info.eventId).then((res) => {
          that.eventInfo = res.data.data
          that.visible = true
        })
        // that.infoWin.visible = true
        // that.infoWin.deviceId = info.deviceId
        // infoWindow.setContent(that.$refs.infoWin.$el)
        // infoWindow.open(that.map, e.target.getPosition())
        // infoWindow.on('close', (e) => {
        //   that.infoWin.visible = false
        // })
      })
      marker.setLabel({
        offset: new AMap.Pixel(0, 0), //设置文本标注偏移量
        content: `<div class='info_label'>${info.deviceName}</div>`, //设置文本标注内容
        direction: 'bottom', //设置文本标注方位
      })
      marker.setMap(map)
      marker.setPosition([info.longitude, info.latitude])
      map.setFitView()
      that.markers.push(marker)
    },
    handleDetails(row) {
      // if (!this.permissions.event_manual_view) return this.msgWarn('权限不足')
      const id = row.eventId
      this.$router.push({
        path: '/app/event/manual/info/index/',
        query: {
          id: id,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/monitor.scss';
#locusMap {
  width: 100%;
  height: 85vh;
  box-sizing: border-box;
}
.col-left,
.col-middle,
.col-right {
  position: absolute;
  top: 20 * $vw;
  font-size: 16 * $vw;
}
.col-left,
.col-right {
  display: flex;
  flex-direction: column;
  width: 23%;
  bottom: 20 * $vw;
}
.col-left {
  left: 20 * $vw;
}
.col-right {
  align-items: flex-end;
  right: 20 * $vw;
}
.col-middle {
  left: calc(23% + 40 *#{$vw});
  width: calc(53% - 60 *#{$vw});
}
::v-deep .tabs-s {
  text-align: center;
  .el-tabs__nav {
    display: inline-block;
    vertical-align: top;
    float: none;
  }
  .el-tabs__item {
    height: auto;
    padding: 8 * $vw;
    font-size: 16 * $vw;
    color: $--color-text-regular;
    line-height: 1.25;
    &:hover,
    &.is-active {
      color: $--color-primary;
    }
  }
  .el-tabs__nav-wrap::after {
    content: none;
  }
}

.alarm-ranks {
  counter-reset: index;
  li {
    counter-increment: index;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 8 * $vw;
    margin-top: 16 * $vw;
    &:first-child {
      margin-top: 0;
    }
    &:nth-child(-n + 3) {
      i {
        background: $--color-primary;
      }
    }
  }
  .val {
    white-space: nowrap;
  }
  i {
    display: block;
    margin-bottom: -22 * $vw;
    width: 44 * $vw;
    height: 44 * $vw;
    font-size: 32 * $vw;
    line-height: 44 * $vw;
    color: #fff;
    text-align: center;
    background: #586d80;
    border-radius: 50%;
    transform-origin: left top;
    transform: scale(0.5);
    &:empty::before {
      content: counter(index);
      display: block;
      position: relative;
      transform: skewX(-10deg);
    }
  }
}

::v-deep .list-radio {
  margin-left: 8 * $vw;
  .el-radio-button__inner {
    padding: 0 10 * $vw;
    font-size: 16 * $vw;
    line-height: 26 * $vw;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-top-left-radius: 13 * $vw;
    border-bottom-left-radius: 13 * $vw;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-top-right-radius: 13 * $vw;
    border-bottom-right-radius: 13 * $vw;
  }
}
.event-alarm-list {
  font-size: 16 * $vw;
  ul {
    overflow: hidden;
  }
  li {
    box-sizing: border-box;
    position: relative;
    display: block;
    padding: 14 * $vw;
    box-shadow: 0 0 0 1px inset $--border-color-base;
    &:not(:first-child) {
      margin-top: 10 * $vw;
    }
  }
  .img-x {
    position: relative;
    border: solid 1px $--border-color-base;
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &::before {
      content: '';
      display: block;
    }
  }
  h4 {
    font-size: 18 * $vw;
    margin-bottom: 0.625em;
  }
  p {
    margin-bottom: 1em;
    color: $--color-text-regular;
  }
  .time {
    display: flex;
    justify-content: space-between;
    color: $--color-text-secondary;
  }
  &.img-view {
    .img-x {
      margin: -14 * $vw;
      margin-bottom: 14 * $vw;
      &::before {
        padding-bottom: 46.5%;
      }
    }
  }
  &.list-view {
    display: flex;
    .img-x {
      flex: 0 0 auto;
      margin: -14 * $vw;
      margin-right: 14 * $vw;
      width: 118 * $vw;
      &::before {
        padding-bottom: 66%;
      }
    }
    .time a,
    p {
      display: none;
    }
    h4 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    li {
      display: flex;
      align-items: center;
    }
    .content-x {
      flex: 1 1 0;
      overflow: hidden;
    }
  }
}
</style>
