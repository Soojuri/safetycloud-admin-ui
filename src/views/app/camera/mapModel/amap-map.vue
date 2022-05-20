<template>
  <div class="sub-page">
    <div class="map-mode">
      <div class="map-box">
        <div id="locusMap"></div>
      </div>
      <div class="count-x">
        <div class="cell c1">
          <img class="icon" :src="require('@/assets/images/video-analysis/icon-jrsxtzs.png')" />
          <dl>
            <dd>{{cameraStatic.alarmCount}}</dd>
            <dt>事件预警总数</dt>
          </dl>
        </div>
        <div class="cell c2">
          <img class="icon" :src="require('@/assets/images/video-analysis/icon-zxsxts.png')" />
          <dl>
            <dd>{{cameraStatic.onlineCount}}</dd>
            <dt>在线设备数</dt>
          </dl>
        </div>
        <div class="cell c3">
          <img class="icon" :src="require('@/assets/images/video-analysis/icon-lxsxts.png')" />
          <dl>
            <dd>{{cameraStatic.offlineCount}}</dd>
            <dt>离线设备数</dt>
          </dl>
        </div>
        <div class="cell c4">
          <img class="icon" :src="require('@/assets/images/video-analysis/icon-zyzsxts.png')" />
          <dl>
            <dd>{{cameraStatic.workingCount}}</dd>
            <dt>正常设备数</dt>
          </dl>
        </div>
        <div class="cell c5">
          <img class="icon" :src="require('@/assets/images/video-analysis/icon-gjxxs.png')" />
          <dl>
            <dd>{{cameraStatic.failureCount}}</dd>
            <dt>故障设备数</dt>
          </dl>
        </div>
      </div>
      <!-- <div class="filter-x left">
        <div class="tit">
          <span>筛选条件</span>
          <i :class="conVisible ? 'cus-icon-navicon' : 'cus-icon-navicon-close'" @click="conVisible = !conVisible"></i>
        </div>
        <div class="con-box mt-l" v-if="conVisible">
          <el-form class="flex-nowrap label-width-4em ">
            <el-form-item label="空间目录">
              <el-select placeholder="请选择"></el-select>
            </el-form-item>
            <el-form-item label="设备状态">
              <el-select placeholder="请选择"></el-select>
            </el-form-item>
            <el-form-item label="设备编号">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="设备名称">
              <el-input placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="设备类型">
              <el-select placeholder="请选择"></el-select>
            </el-form-item>
            <el-form-item label="接入类型">
              <el-select placeholder="请选择"></el-select>
            </el-form-item>
          </el-form>
          <div class="btns">
            <el-button type="primary" @click="onSubmit">搜 索</el-button>
            <el-button>清 空</el-button>
          </div>
        </div>
      </div> -->
      <div class="filter-x right">
        <div class="tit">
          <span>设备区域信息面板</span>
          <!-- <div class="btn" @click="handleArea">管理区域</div> -->
          <i :class="opearateOption.infoVisible ? 'cus-icon-navicon' : 'cus-icon-navicon-close'"
             @click="opearateOption.infoVisible = !opearateOption.infoVisible"></i>
        </div>
        <div class="con-box mt-l" v-if="opearateOption.infoVisible">
          <el-form :inline="true" label-position="left" label-width="80px" :model="queryParams">
            <!-- <el-form-item label="查看区域" prop='areaId'>
              <avue-input-tree style="width:200px" v-model="queryParams.areaId" :filter='false' :props="defaultProps"
                               placeholder="请选择区域" type="tree" :dic="areaTree">
              </avue-input-tree>
            </el-form-item> -->
            <el-form-item label="空间目录" prop="spaceId">
              <el-select v-model="queryParams.spaceId" placeholder="请选择空间目录">
                <el-option v-for="item in dict.spaceList" :key="item.spaceId" :label="item.spaceName"
                           :value="item.spaceId">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="设备状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="请选择设备状态">
                <el-option v-for="item in dict.deviceStatus" :key="item.value" :label="item.label"
                           :value="item.value" />
              </el-select>
            </el-form-item> -->
            <el-form-item label='设备ID' prop='deviceId'>
              <el-input style="width:200px" size='small' v-model='queryParams.deviceId' placeholder='请输入设备ID'>
              </el-input>
            </el-form-item>
            <el-form-item label='设备名称' prop='deviceName'>
              <el-input style="width:200px" size='small' v-model='queryParams.deviceName' placeholder='请输入设备名称'>
              </el-input>
            </el-form-item>
            <el-form-item label='所属企业' prop='enterpriseName'>
              <el-input style="width:200px" size='small' v-model='queryParams.enterpriseName' placeholder='请输入所属企业 '>
              </el-input>
            </el-form-item>
            <!-- <el-form-item label="设备类型" prop="videoDeviceType">
              <el-select v-model="queryParams.videoDeviceType" placeholder="请选择设备类型">
                <el-option v-for="item in dict.cameraType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接入类型" prop="protocolType">
              <el-select v-model="queryParams.protocolType" placeholder="请选择接入类型">
                <el-option v-for="item in dict.protocolType" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="作业状态" prop="taskStatus">
              <el-select v-model="queryParams.taskStatus" placeholder="请选择作业状态">
                <el-option label="运行作业中" :value="1" />
                <el-option label="未运行作业" :value="0" />
              </el-select>
            </el-form-item> -->
          </el-form>
          <div class="btns">
            <el-button type="primary" size="small" @click="getList">查询</el-button>
            <el-button size="small" @click="handleClear">清 空</el-button>
          </div>
        </div>
        <div class="hr" v-if="opearateOption.infoVisible"></div>
        <div class="tab-box" v-if="opearateOption.infoVisible">
          <el-tabs>
            <el-tab-pane label="设备列表">
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
            <el-tab-pane label="设备告警">
              <div class="g-table">
                <!-- 表格数据 -->
                <el-table :data='alarmList' border style="width: 100%">
                  <el-table-column align='center' prop='deviceId' label='ID' show-overflow-tooltip />
                  <el-table-column align='center' prop='deviceName' label='设备名称' show-overflow-tooltip />
                  <el-table-column align='center' prop='content' label='告警名称' show-overflow-tooltip />
                  <el-table-column align='center' prop='createTime' label='告警时间' show-overflow-tooltip>
                    <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
                  </el-table-column>
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
        </div>
      </div>

      <!-- 弹框 -->
      <el-dialog title="设备详情" width="800px" :visible="visible" append-to-body @close="visible = false">
        <!-- <div class="map-drop-box"> -->

        <component :is="curComp" :cameraInfo="cameraInfo" :dict="dict"></component>
        <!--         
        <div v-if="">
          <video-player ref="videoPlayer" height="400px" :videoSrc="videoSrc">
          </video-player>
        </div> -->
        <div class="drop-footer">
          <el-radio-group v-model="btnType" @change="handleChangeBtnType">
            <el-radio-button label="DeviceInfo">查看详情</el-radio-button>
            <el-radio-button label="VideoPreview">监控预览</el-radio-button>
            <el-radio-button label="VideoRecord">录像回放</el-radio-button>
            <el-radio-button label="VideoSnap">查看截图</el-radio-button>
            <el-radio-button label="VideoTask">任务作业</el-radio-button>
          </el-radio-group>

        </div>
        <!-- </div> -->
      </el-dialog>

    </div>
    <el-drawer :before-close="handleClose" :append-to-body="true" v-if="areaTable.visible" size="800px"
               visible="areaTable.visible" direction="rtl">
      <area-table></area-table>
    </el-drawer>

  </div>
</template>

<script>
import { getSpaceAreaTree, getSpaceList } from '@/api/app/camera/space'
// import { getVideoDeviceInfo } from '@/api/app/camera/videoDevice'
import MapLoader from '@/util/AMap' // 引入高德地图 原生api
import InfoWin from './infoWin.vue'
import AreaTable from './area/index.vue'
// import { getAreaTree } from '@/api/device/area'
import { getAreaDeviceList, getAlarmList, getVideoDeviceInfo } from '@/api/app/camera/device'
import cameraIcon from '@/assets/images/camera-manage/map-icon-camera.png'
import nvrIcon from '@/assets/images/camera-manage/map-icon-nvr.png'
import { getCamera } from '@/api/app/home/index'
// import { getDeviceList as getPage } from '@/api/admin/diary'
import VideoPlayer from '@/components/video/VideoPlayer.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    AreaTable,
    InfoWin,
    VideoPlayer,
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
      dict: {
        deviceStatus: [],
        cameraType: [],
        producer: [],
        protocolType: [],
        spaceList: [],
      },
      btnType: null,
      curComp: null,
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
    this.getDictList()
    // this.getAreaTree()
    this.initMap()
  },
  methods: {
    getDictList() {
      this.getDicts('video_status').then((res) => {
        this.dict.deviceStatus = res.data.data
      })
      this.getDicts('video_device_producer').then((res) => {
        this.dict.producer = res.data.data
      })
      this.getDicts('camera_device_type').then((res) => {
        this.dict.cameraType = res.data.data
      })
      this.getDicts('space_protocol_type').then((res) => {
        this.dict.protocolType = res.data.data
      })
      getSpaceList({ size: 10000, current: 1 }).then((res) => {
        this.dict.spaceList = res.data.data.records
      })
      getSpaceAreaTree().then((res) => {
        this.treeData = res.data.data
      })
      getCamera().then((res) => {
        this.cameraStatic = res.data.data
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
        areaId: null,
        productId: null,
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
        path: '/app/camera/videoDevice/info/index/',
        query: {
          id: row.deviceId,
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
@import '@/styles/variables.scss';
#locusMap {
  width: 100%;
  height: 85vh;
  box-sizing: border-box;
}
.sub-page {
  min-height: 100%;
  background-color: white;
  margin: 0 12px;
  width: auto;
  .map-mode {
    position: relative;
    height: 100%;
    width: 100%;
  }
  .map-box {
    position: absolute;
    left: -12px;
    top: 0;
    right: -12px;
    bottom: -12px;
    z-index: 1;
  }
  .map-box:empty {
    background: #e7ecf5;
  }
  .count-x {
    position: absolute;
    z-index: 1002;
    left: 0;
    top: 0;
    right: 0;
    display: flex;
    margin-right: -12 * $vw;
    .c1 {
      background: linear-gradient(to bottom, #33bdf6, #118ced);
    }
    .c2 {
      background: linear-gradient(to bottom, #54d8e0, #1db7ba);
    }
    .c3 {
      background: linear-gradient(to bottom, #f1cf47, #efa71e);
    }
    .c4 {
      background: linear-gradient(to bottom, #f4a05d, #ed772d);
    }
    .c5 {
      background: linear-gradient(to bottom, #f66d57, #ee4831);
    }
    dl,
    dt,
    dd {
      margin: 0;
    }
    .cell {
      white-space: nowrap;
      border-radius: 5 * $vw;
      flex: 1;
      margin-right: 12 * $vw;
      margin-top: 12 * $vw;
      padding: 20 * $vw 28 * $vw;
      display: flex;
      align-items: center;
      color: white;
      .icon {
        margin-right: 18 * $vw;
        width: 83 * $vw;
        height: 83 * $vw;
      }
      dd {
        font-size: 48 * $vw;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
      }
      dt {
        font-size: 20 * $vw;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
      }
    }
  }
  .filter-x {
    width: 350px;
    padding: 12px;
    position: absolute;
    z-index: 1002;
    background: white;
    border-radius: 4px;
    top: 150 * $vw;
    box-shadow: 0 0 6px rgba($color: #000000, $alpha: 0.1);
    max-height: calc(100vh - 190px - #{123 * $vw});
    overflow-y: auto;
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
    .btns {
      text-align: center;
    }
    .tit {
      font-size: 18px;
      display: flex;
      align-items: flex-start;
      &::before {
        content: '';
        height: 20px;
        width: 4px;
        border-radius: 2px;
        background: $--color-primary;
        display: inline-block;
        margin-right: 8px;
        vertical-align: top;
        margin-top: 3px;
      }
      .btn {
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        line-height: 24px;
        border: solid 1px currentcolor;
        color: $--color-primary;
        padding: 0 8px;
        border-radius: 4px;
        margin-right: 4px;
      }
      span {
        flex: 1;
      }
      .cus-icon-navicon-close,
      .cus-icon-navicon {
        cursor: pointer;
        padding: 3px;
        &:hover {
          color: $--color-primary;
        }
      }
      .cus-icon-navicon::before {
        content: '\e904';
      }
      .cus-icon-navicon-close::before {
        content: '\e904';
      }
    }

    ::v-deep .tab-box {
      text-align: center;
      .el-tabs__nav-wrap::after {
        display: none;
      }
      .el-tabs__header {
        display: inline-block;
        vertical-align: top;
      }
    }
  }
  .hr {
    height: 1px;
    margin-left: -12px;
    margin-right: -12px;
    background: #f0f0f0;
    margin-top: 12px;
  }

  // 弹框
  .map-drop-box {
    position: absolute;
    z-index: 2000;
    width: 800 * $vw;
    background: white;
    left: 50%;
    top: 150 * $vw;
    margin-left: -400 * $vw;
    max-height: calc(100vh - 150px - #{123 * $vw});
    box-shadow: 0 0 6px rgba($color: #000000, $alpha: 0.1);
    border-radius: 4px;
    .tit {
      padding: 12px;
      font-size: 18px;
      border-bottom: solid 1px #f0f0f0;
    }
    .cus-icon-close {
      padding: 16px 12px;
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      &:hover {
        color: $--color-primary;
      }
    }
    .drop-detail {
      padding: 10px 16px;
      display: flex;
    }
    .info {
      flex: 1;
    }
    dl,
    dt,
    dd {
      margin: 0;
    }
    dl {
      font-size: 14 * $vw;
      display: flex;
      padding: 8 * $vw 10 * $vw;
      dt {
        width: 5em;
        padding-right: 6 * $vw;
        flex-shrink: 0;
      }
      dd {
        word-break: break-all;
        color: #666666;
      }
    }
    .cover {
      flex-shrink: 0;
      width: 500 * $vw;
      height: 300 * $vw;
      & > * {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
.drop-footer {
  padding: 16px;
  text-align: center;
}
</style>
