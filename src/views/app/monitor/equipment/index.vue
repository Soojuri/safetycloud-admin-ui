<template>
  <div class="sub-page">
    <div class="g-map-content">
      <!-- 地图放这里 -->
      <div class="map-canvas-wrap">
        <div id="locusMap"></div>
      </div>
      <div class="g-sta-cols">
        <ul>
          <li class="item-blue">
            <div class="icon-x"><i class="monitor-icon-eq-alarm"></i></div>
            <span><b>{{cameraStatic.alarmCount}}</b>事件预警总数</span>
          </li>
          <li class="item-blue-green">
            <div class="icon-x"><i class="monitor-icon-eq-online"></i></div>
            <span><b>{{cameraStatic.onlineCount}}</b>在线设备数</span>
          </li>
          <li class="item-red">
            <div class="icon-x"><i class="monitor-icon-eq-offline"></i></div>
            <span><b>{{cameraStatic.offlineCount}}</b>离线设备数</span>
          </li>
          <li class="item-orange">
            <div class="icon-x"><i class="monitor-icon-eq-fault"></i></div>
            <span><b>{{cameraStatic.failureCount}}</b>故障设备数</span>
          </li>
          <li class="item-yellow">
            <div class="icon-x"><i class="monitor-icon-eq-normal"></i></div>
            <span><b>{{cameraStatic.normalCount}}</b>正常设备数</span>
          </li>
        </ul>
      </div>

      <div class="col-left">
        <s-box class="f1" title="设备故障统计">
          <div class="error-sta">
            <ul>
              <li>
                <b>{{ deviceFaultStatistics.total }}</b>
                <span>故障总数</span>
              </li>
              <li>
                <b>{{ deviceFaultStatistics.processedCount }}</b>
                <span>已处理故障</span>
              </li>
              <li>
                <b>{{ deviceFaultStatistics.pendingCount }}</b>
                <span>待处理故障</span>
              </li>
            </ul>
          </div>
          <div class="hr"></div>
          <div class="s-box-sub-tit">
            <span>设备故障排行</span>
          </div>
          <div class="equ-rank-list">
            <ul>
              <li v-for="(item,index) in deviceFaultRanking">
                <i></i>
                <span>{{item.name}}</span>
                <div class="val">{{item.value}}</div>
              </li>
            </ul>
          </div>
        </s-box>
      </div>
      <div class="col-right">
        <s-box class="f1" title="设备区域信息面板">
          <!-- <div class="title-switch" slot="title-append">
            <el-switch></el-switch>
          </div> -->
          <el-form class="label-width-4em" :model="queryParams">
            <el-form-item label="空间目录" prop="spaceId">
              <el-select style="width:200px" v-model="queryParams.spaceId" placeholder="请选择空间目录">
                <el-option v-for="item in dict.spaceList" :key="item.spaceId" :label="item.spaceName"
                           :value="item.spaceId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='设备编号' prop='deviceId'>
              <el-input style="width:200px" size='small' v-model.trim='queryParams.deviceId' placeholder='请输入设备ID'>
              </el-input>
            </el-form-item>
            <el-form-item label='设备名称' prop='deviceName'>
              <el-input style="width:200px" size='small' v-model.trim='queryParams.deviceName' placeholder='请输入设备名称'>
              </el-input>
            </el-form-item>
            <!-- <el-form-item label='所属企业' prop='enterpriseName'>
              <el-input style="width:200px" size='small' v-model='queryParams.enterpriseName' placeholder='请输入所属企业 '>
              </el-input>
            </el-form-item> -->
            <el-form-item label='所属企业' prop='enterpriseId'>
              <el-select style="width:200px" v-model="queryParams.enterpriseId" placeholder="请选择所属企业">
                <el-option v-for="item in enterpriseList" :key="item.enterpriseId" :label="item.enterpriseName"
                           :value="item.enterpriseId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="g-button-x">
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button type="primary" plain @click="handleClear">清 空</el-button>
          </div>
          <div class="hr"></div>
          <el-tabs class="tabs-m" v-model="equTab">
            <el-tab-pane label="设备列表" name="equTab1">
              <div style="margin:10px"></div>
              <div class="g-table">
                <!-- 表格数据 -->
                <el-table :data='deviceList' border style="width: 100%">
                  <el-table-column align='center' prop='deviceId' label='设备ID' show-overflow-tooltip />
                  <el-table-column align='center' prop='deviceName' label='设备名称' show-overflow-tooltip />
                  <el-table-column align='center' label='操作'>
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleInfo(scope.row)">详情</el-button>
                      <el-button :disabled="scope.row.longitude === null" type="text"
                                 @click="handlePosition(scope.row)">定位
                      </el-button>
                      <!-- <el-button type="text" @click="handleDel(scope.row)">删除</el-button> -->
                    </template>
                  </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="g-page-x mt-m">
                  <pagination v-show='deviceListTotal>0' :pager-count="5" :background="false" :layout="layout"
                              :total='deviceListTotal' :page.sync='deviceParams.current' :limit.sync='deviceParams.size'
                              @pagination='getDeviceList()' />
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="设备离线告警" name="equTab2">
              <div style="margin:10px"></div>
              <div class="g-table">
                <!-- 表格数据 -->
                <el-table :data='alarmList' border style="width: 100%">
                  <el-table-column align='center' prop='alarmName' label='告警名称' show-overflow-tooltip />
                  <el-table-column align='center' prop='deviceName' label='设备名称' show-overflow-tooltip />
                  <el-table-column align='center' prop='createTime' label='告警时间' show-overflow-tooltip />
                  <!-- <el-table-column align='center' label='操作'>
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleInfo1(scope.row)">详情</el-button>
                    </template>
                  </el-table-column> -->
                </el-table>
                <!-- 分页 -->
                <div class="g-page-x mt-m">
                  <pagination v-show='alarmListTotal>0' :pager-count="5" :background="false" :layout="layout"
                              :total='alarmListTotal' :page.sync='alarmParams.current' :limit.sync='alarmParams.size'
                              @pagination='getAlarmList()' />
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <!-- <div class="table-x">
            <el-table :data="tableData">
              <el-table-column prop="eid" label="设备ID">
              </el-table-column>
              <el-table-column prop="name" label="设备名称">
              </el-table-column>
              <el-table-column prop="operates" label="操作">
                <slot-scope>
                  <div class="operates">
                    <el-button type="text">详情</el-button>
                    <span>|</span>
                    <el-button type="text">定位</el-button>
                  </div>
                </slot-scope>
              </el-table-column>
            </el-table>
          </div> -->
        </s-box>
      </div>
      <!-- <div class="g-chart-pop-dialog map-detail">
        <div class="dialog-tit">
          <span>查看详情</span>
          <a href="javascript:void(0);" class="cus-icon-close-stroked"></a>
        </div>
        <div class="detail-x">
          <div class="img-x">
            <img src="https://img2.baidu.com/it/u=3439184144,3897978639&fm=253&fmt=auto&app=138&f=JPEG?w=736&h=491"
                 alt="">
          </div>
          <div class="lines">
            <div class="line">
              <label>设备名称</label>
              <span>南威科技园西门入口</span>
            </div>
            <div class="line">
              <label>设备编号</label>
              <span>67698798792</span>
            </div>
            <div class="line">
              <label>设备厂商</label>
              <span>海康威视</span>
            </div>
            <div class="line">
              <label>设备状态</label>
              <span>在线</span>
            </div>
            <div class="line">
              <label>空间目录</label>
              <span>南威科技园</span>
            </div>
            <div class="line">
              <label>设备IP</label>
              <span>192.168.10.56</span>
            </div>
            <div class="line">
              <label>设备端口</label>
              <span>8899</span>
            </div>
            <div class="line">
              <label>设备种类</label>
              <span>网络摄像机</span>
            </div>
          </div>
        </div>
        <div class="g-button-x">
          <el-button type="primary">查看详情</el-button>
          <el-button type="primary" plain>监控预览</el-button>
          <el-button type="primary" plain>录像回放</el-button>
          <el-button type="primary" plain>查看截图</el-button>
        </div>
      </div> -->
      <!-- 弹框 -->
      <el-dialog title="设备详情" width="800px" :visible="visible" append-to-body @close="visible = false">
        <!-- <div class="map-drop-box"> -->

        <component :is="curComp" :cameraInfo="cameraInfo" :dict="dict"></component>
        <!--         
        <div v-if="">
          <video-player ref="videoPlayer" height="400px" :videoSrc="videoSrc">
          </video-player>
        </div> -->
        <div class="g-button-x">
          <el-radio-group v-model="btnType" @change="handleChangeBtnType">
            <el-radio-button label="DeviceInfo" v-if="deviceType">查看详情</el-radio-button>
            <el-radio-button label="VideoPreview" v-if="deviceType">监控预览</el-radio-button>
            <el-radio-button label="VideoRecord" v-if="deviceType">录像回放</el-radio-button>
            <el-radio-button label="VideoSnap" v-if="deviceType">查看截图</el-radio-button>
            <!-- <el-radio-button label="VideoTask">任务作业</el-radio-button> -->
          </el-radio-group>

        </div>
        <!-- </div> -->
      </el-dialog>
    </div>
  </div>
</template>

<script>
import SBox from '@/components/monitor/s-box.vue'
import { getSpaceAreaTree, getSpaceList } from '@/api/app/camera/space'
// import { getVideoDeviceInfo } from '@/api/app/camera/videoDevice'
import MapLoader from '@/util/AMap' // 引入高德地图 原生api
// import InfoWin from './infoWin.vue'
// import AreaTable from './area/index.vue'
// import { getAreaTree } from '@/api/device/area'
import { getAreaDeviceList, getAlarmList, getVideoDeviceInfo } from '@/api/app/camera/device'
import cameraIcon from '@/assets/images/camera-manage/map-icon-camera.png'
import nvrIcon from '@/assets/images/camera-manage/map-icon-nvr.png'
import { getCamera } from '@/api/app/home/index'
import { deviceFaultRanking, deviceFaultStatistics } from '@/api/app/fault/record.js'
import { getEnterpriseList } from '@/api/app/enterprise/enterprise.js'
// import { getDeviceList as getPage } from '@/api/admin/diary'
// import VideoPlayer from '@/components/video/VideoPlayer.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    // AreaTable,
    // InfoWin,
    // VideoPlayer,
    SBox,
    DeviceInfo: () => import('./tabs/info/index.vue'),
    VideoPreview: () => import('./tabs/preview/index.vue'),
    VideoRecord: () => import('./tabs/record/index.vue'),
    VideoSnap: () => import('./tabs/snap/index.vue'),
    VideoTask: () => import('./tabs/task/index.vue'),
  },
  data() {
    return {
      position: {
        lng: '',
        lat: '',
      },
      infoWin: {
        deviceId: null,
        visible: false,
      },
      queryParams: {
        areaId: null,
        deviceId: null,
        status: null,
        producer: null,
        videoDeviceType: null,
        spaceId: null,
        deviceIp: null,
        protocolType: null,
        taskStatus: null,
        enterpriseId: null,
      },
      layout: ' prev, pager, next',
      deviceParams: {
        size: 10,
        current: 1,
      },
      alarmParams: {
        size: 10,
        current: 1,
      },
      deviceListTotal: 0,
      alarmListTotal: 0,
      opearateOption: {
        infoVisible: false,
      },
      allDevice: [],
      deviceList: [], //设备列表
      areaOptions: [],
      queryOptions: [],
      enterpriseList: [],
      areaTable: {
        visible: false,
      },
      alarmList: [],
      defaultProps: {
        label: 'name',
        value: 'id',
      },
      // areaTree: [], //区域树
      markers: [],
      PolyEditor: null,
      timer: null,
      conVisible: false,
      visible: false,
      cameraInfo: {},
      cameraStatic: {},
      deviceFaultStatistics: {},
      deviceFaultRanking: {},
      dict: {
        deviceStatus: [],
        cameraType: [],
        producer: [],
        protocolType: [],
        spaceList: [],
      },
      btnType: null,
      curComp: null,
      deviceType: false,
      equTab: 'equTab1',
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    deviceIds() {
      return this.deviceList.map((item) => {
        return item.deviceId
      })
    },
  },
  watch: {},
  mounted() {
    getEnterpriseList({ size: 1000, current: 1 }).then((res) => {
      this.enterpriseList = res.data.data.records
    })
    this.getDictList()
    // this.getAreaTree()
    this.initMap()
  },
  methods: {
    getDictList() {
      this.getDicts('device_status').then((res) => {
        this.dict.deviceStatus = res.data.data
      })
      this.getDicts('video_device_producer').then((res) => {
        this.dict.producer = res.data.data
      })
      this.getDicts('device_type').then((res) => {
        this.dict.cameraType = res.data.data
      })
      this.getDicts('space_protocol_type').then((res) => {
        this.dict.protocolType = res.data.data
      })
      getSpaceList({ size: 10000, current: 1 }).then((res) => {
        this.dict.spaceList = res.data.data.records
      })
      // getSpaceAreaTree().then((res) => {
      //   this.treeData = res.data.data
      // })
      getCamera().then((res) => {
        this.cameraStatic = res.data.data
      })
      deviceFaultRanking().then((res) => {
        this.deviceFaultRanking = res.data.data
      })
      deviceFaultStatistics().then((res) => {
        this.deviceFaultStatistics = res.data.data
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
    getList() {
      const that = this
      that.map.clearMap()
      that.getDeviceList()
      that.getAlarmList()
      this.getAllDevice()
    },
    getAllDevice() {
      const that = this
      that.map.remove(that.markers)
      that.markers = []
      getAreaDeviceList({ size: 1000000, current: 1 }).then((res) => {
        that.allDevice = res.data.data.records
        //异步加载
        AMapUI.loadUI(['overlay/SimpleInfoWindow'], function (SimpleInfoWindow) {
          that.allDevice.forEach((item, index) => {
            const icon = new AMap.Icon({
              // 图标尺寸
              size: new AMap.Size(40, 45),
              // 图标的取图地址
              image: item.videoDeviceType == 1 ? cameraIcon : nvrIcon,
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
    // setArea() {
    //   const that = this
    //   let info = that.areaTree.filter((item) => item.id === that.queryParams.areaId)[0]
    //   const geoJson = info ? info.geoJson : null
    //   if (!geoJson) return
    //   let pathList = JSON.parse(geoJson).map((item) => {
    //     let path = new AMap.LngLat(item.lng, item.lat)
    //     return path
    //   })
    //   that.timer = setTimeout(() => {
    //     that.setPath(pathList)
    //   })
    // },
    // getAreaTree() {
    //   getAreaTree({ lazy: false }).then((res) => {
    //     this.areaTree = res.data.data
    //   })
    // },
    handleClear() {
      this.map.clearMap()
      this.queryParams = {
        spaceId: null,
        enterpriseId: null,
        deviceName: null,
        deviceId: null,
      }
      this.getList()
    },
    getAlarmList() {
      const deviceIds = this.deviceIds.join()
      // getPage({ deviceIds, ...this.alarmParams }).then((res) => {
      getAlarmList({ ...this.alarmParams, ...this.queryParams }).then((res) => {
        this.alarmList = res.data.data.records
        this.alarmListTotal = res.data.data.total
      })
    },
    getDeviceList() {
      const that = this
      that.map.remove(that.markers)
      that.markers = []
      getAreaDeviceList({ ...that.deviceParams, ...that.queryParams }).then((res) => {
        that.deviceList = res.data.data.records
        that.deviceListTotal = res.data.data.total
      })
    },
    formatStatus(row) {
      return this.selectDictLabel(this.dict.deviceStatus, row.status)
    },
    formatDeviceType(row) {
      return this.selectDictLabel(this.dict.cameraType, row.videoDeviceType)
    },
    formatProducer(row) {
      return this.selectDictLabel(this.dict.producer, row.producer)
    },
    // 设置聚合点
    setCluster() {
      const markers = this.markers
      let cluster = new AMap.MarkerClusterer(this.map, markers, { gridSize: 60 })
      cluster.setMinClusterSize(5)
      cluster.setMap(this.map)
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
    handleDel(row) {
      this.$confirm('是否确认删除该设备吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delObj(row.deviceId)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
    handleClose() {
      this.areaTable.visible = false
      this.initMap()
    },
    // 区域管理弹窗
    handleArea() {
      // if (!this.permissions.camera_mapModel_area) return this.msgWarn('权限不足')
      this.areaTable = {
        visible: true,
      }
    },
    handlePosition(row) {
      // if (!this.permissions.camera_mapModel_map) return this.msgWarn('权限不足')
      const path = new AMap.LngLat(row.longitude, row.latitude)
      this.map.setZoomAndCenter(16, path)
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
        getVideoDeviceInfo(info.deviceId).then((res) => {
          that.cameraInfo = res.data.data
          if (res.data.data.deviceType == 4) {
            that.deviceType = true
          }
          that.visible = true
          this.curComp = 'DeviceInfo'
          this.btnType = 'DeviceInfo'
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
    handleInfo(row) {
      // if (!this.permissions.camera_mapModel_view) return this.msgWarn('权限不足')
      this.$router.push({
        path: '/app/baseinfo/device/info/index/',
        query: {
          id: row.deviceId,
        },
      })
    },
    handleInfo1(row) {
      // if (!this.permissions.camera_mapModel_view) return this.msgWarn('权限不足')
      this.$router.push({
        path: '/app/event/manual/info/index/',
        query: {
          id: row.eventId,
        },
      })
    },
    handleChangeBtnType(val) {
      this.curComp = val
    },
  },
  destroyed() {
    clearTimeout(this.timer)
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
.g-map-content {
  display: flex;
  flex-direction: column;
}
.s-box-sub-tit {
  margin-top: 20 * $vw;
  span {
    position: relative;
    padding-left: 20 * $vw;
    font-size: 18 * $vw;
    line-height: 24 * $vw;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 12 * $vw;
      margin-top: -7 * $vw;
      width: 5 * $vw;
      height: 14 * $vw;
      background: $--color-primary;
      border-radius: 5 * $vw;
    }
  }
}
.col-left,
.col-right {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 140 * $vw;
  bottom: $map-padding;
  font-size: 16 * $vw;
  .hr {
    margin: 24 * $vw -16 * $vw 0;
  }
  .s-box {
    width: 380 * $vw;
  }
}
.col-left {
  left: $map-padding;
}
.col-right {
  align-items: flex-end;
  right: $map-padding;
  .s-box {
    min-width: 300px;
  }
  ::v-deep.s-box__content {
    display: flex;
    flex-direction: column;
    // overflow: hidden !important;
    .table-x {
      flex: 1 1 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .el-table {
        @include scrollbar();
        flex: 1 1 0;
        overflow-y: auto;
      }
    }
    .el-table__header-wrapper {
      z-index: 99;
      position: sticky;
      top: 0;
    }
    .el-table--scrollable-x .el-table__body-wrapper {
      @include scrollbar();
    }
  }
  ::v-deep.g-button-x {
    margin-top: 32 * $vw;
    .el-button {
      padding: 8 * $vw 24 * $vw;
      font-size: 18 * $vw;
      border-radius: 4 * $vw;
    }
  }
  ::v-deep.el-form {
    .el-form-item {
      margin-bottom: 12 * $vw;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-radio__label,
    .el-form-item__label,
    .el-form-item__content {
      font-size: 18 * $vw;
    }
    .el-form-item__label {
      white-space: nowrap;
    }
    .right-text,
    .el-form-item__label {
      padding-top: 0;
      line-height: 36 * $vw;
    }
    .el-input__inner {
      padding: 0 1em;
      font-size: 18 * $vw;
      height: auto;
      line-height: calc(36 *#{$vw} - 2px);
    }
    .el-input--suffix .el-input__inner {
      padding-right: 28 * $vw;
    }
    .el-input__suffix {
      right: 8 * $vw;
    }
    .el-select .el-input .el-select__caret {
      width: 1em;
      font-size: 16 * $vw;
      line-height: calc(36 *#{$vw} - 2px);
      &::before {
        vertical-align: top;
      }
    }
  }
}
::v-deep .tabs-m {
  margin-bottom: 12 * $vw;
  text-align: center;
  .el-tabs__nav {
    display: inline-block;
    vertical-align: top;
    float: none;
  }
  .el-tabs__item {
    height: auto;
    padding: 12 * $vw 32 * $vw !important;
    font-size: 18 * $vw;
    color: $--color-text-regular;
    line-height: 1.25;
    &:hover,
    &.is-active {
      color: $--color-primary;
    }
  }
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__nav-wrap::after {
    content: none;
  }
}
::v-deep.table-x {
  .cell,
  .el-table {
    font-size: inherit;
  }
  .cell {
    padding-left: 10 * $vw;
    padding-right: 10 * $vw;
    line-height: 1.25;
  }
  .el-table {
    th {
      padding-top: 10 * $vw;
      padding-bottom: 10 * $vw;
      background: #e3e3e3;
    }
    td {
      padding-top: 10 * $vw;
      padding-bottom: 10 * $vw;
    }
  }
}
.error-sta {
  background: #f7f8fc;
  padding: 20 * $vw 0;
  border-radius: 5 * $vw;
  box-shadow: 0 -2px 0 $--color-primary inset, 0 0 0 1px #cee0fc inset;
  ul {
    display: flex;
    align-items: center;
  }
  li {
    position: relative;
    flex: 1 1 0;
    display: block;
    text-align: center;
    &:not(:first-child):before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 1px;
      background: #cee0fc;
    }
  }
  b,
  span {
    display: block;
  }
  b {
    margin-bottom: 10 * $vw;
    font-size: 30 * $vw;
    color: $--color-primary;
  }
}
.equ-rank-list {
  margin-top: 24 * $vw;
  counter-reset: index;
  li {
    counter-increment: index;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20 * $vw;
    margin-top: 22 * $vw;
    &:first-child {
      margin-top: 0;
    }
    &:nth-child(-n + 3) {
      i {
        color: $--color-primary;
      }
    }
  }
  span {
    padding: 0 1em;
  }
  .val {
    white-space: nowrap;
  }
  i {
    display: block;
    position: relative;
    min-width: 3em;
    transform: skewX(-8deg);
    &:empty::before {
      content: counter(index);
    }
  }
}
</style>
