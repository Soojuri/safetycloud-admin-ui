
<!-- 视频设备 -->
<template>
  <div class='sub-page' v-loading="playLoading">
    <div class="g-card">
      <div class="g-filter">
        <el-form class="flex-nowrap" :model='queryParams' ref='queryForm' :inline='true' label-width="110px">
          <el-form-item label='通道名称' prop='channelName'>
            <el-input size='small' v-model='queryParams.channelName' placeholder='请输入设备名称'></el-input>
          </el-form-item>
          <el-form-item class="filter-btn">
            <el-button type='primary' @click='handleQuery'>查询</el-button>
            <el-button @click='handleClear'>清 空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="g-card">
      <!-- 表格数据 -->
      <el-table border v-loading='loading' :data='tableData'>
        <el-table-column prop="deviceChannelId" label="通道号" width="200" />
        <el-table-column prop='channelCode' label='通道国标编码' width="200" />
        <el-table-column prop='channelName' label='通道名称' />
        <el-table-column prop='ptzType' label='云台类型' :formatter="ptzTypeFormat" />
        <el-table-column prop='subCount' label='子通道数' />
        <el-table-column prop='status' label='在线状态'>
          <template slot-scope="scope">{{scope.row.status == 1 ? '在线' : '离线'}}</template>
        </el-table-column>
        <!-- <el-table-column  prop='videotapeSwitch' label='云端录像' /> -->
        <el-table-column prop='producer' label='设备厂家' />
        <el-table-column prop='snapshotUrl' label='快照' />
        <el-table-column fixed="right" width="250" label='操作'>
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-video-play" @click="sendDevicePush(scope.row)">播放</el-button>
            <!-- <el-button type="text" icon="el-icon-video-camera" @click="handleRecord(scope.row)">设备录像</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="g-page-x mt-m">
        <pagination v-show='total>0' :total='total' :page.sync='queryParams.current' :limit.sync='queryParams.size'
                    @pagination='getList' />
      </div>
      <video-dialog v-if="visible" :visible.sync="visible" :streamInfo="streamInfo" :deviceId="deviceId"
                    :channelId="channelId"></video-dialog>
    </div>
  </div>
</template>

<script>
import { getChannels, play } from '@/api/app/camera/gbChannel'
import VideoDialog from './video-dialog.vue'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: { VideoDialog },
  data() {
    return {
      queryParams: {
        size: 10, //分页数
        current: 1, //当前页
      },
      producerOptions: [],
      ptzTypeOptions: [],
      tableData: [], //表格数据
      total: 0, //总条数
      loading: false,
      editForm: {
        visible: false,
        data: {},
      },
      visible: false,
      deviceId: null,
      channelId: null,
      streamInfo: {},
      loadSnap: {},
      playLoading: false,
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  mounted() {
    this.getDicts('video_status').then((res) => {
      this.statusOptions = res.data.data
    })
    this.getDicts('video_device_producer').then((res) => {
      this.producerOptions = res.data.data
    })
    this.getDicts('ptzType').then((res) => {
      this.ptzTypeOptions = res.data.data
    })
    this.getList()
  },
  methods: {
    //获取页面列表数据
    getList() {
      this.queryParams.deviceId = this.$route.query.id
      this.loading = true
      getChannels(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch((err) => {
          this.loading = false
        })
    },
    // 状态字典映射
    formatStatus(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 设备厂家字典映射
    formatProducer(row) {
      return this.selectDictLabel(this.producerOptions, row.producer)
    },
    //搜索
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    //初始化查询列表
    handleClear() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleEdit(row) {
      if (!this.permissions.video_device_channel_edit) return this.msgWarn('权限不足')
      this.editForm = {
        visible: true,
        data: {
          id: row.videoId,
        },
      }
    },
    // 删除设备
    handleDel(row) {
      this.$confirm('是否确认删除该视频设备吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delChannel(row.videoId)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
    //通知设备上传媒体流
    sendDevicePush(itemData) {
      const that = this
      that.playLoading = true
      if (!that.permissions.video_device_play) return that.msgWarn('权限不足')
      that.deviceId = itemData.deviceId
      that.channelId = itemData.channelCode
      play({ deviceId: that.deviceId, channelId: that.channelId })
        .then(function (res) {
          that.playLoading = false
          if (res.data.code == 0) {
            that.visible = true
            that.streamInfo = res.data.data
          } else {
            that.msgWarn('加载视频失败')
            that.playLoading = false
          }
        })
        .catch(() => {
          that.msgWarn('加载视频失败')
          that.playLoading = false
        })
    },
    getSnapErrorEvent: function (id) {
      if (typeof this.loadSnap[id] != 'undefined') {
        console.log('下载截图' + this.loadSnap[id])
        if (this.loadSnap[id] > 5) {
          delete this.loadSnap[id]
          return
        }
        setTimeout(() => {
          this.loadSnap[id]++
          // document.getElementById(id).setAttribute('src', '/static/snap/' + id + '.jpg?' + new Date().getTime())
        }, 1000)
      }
    },

    ptzTypeFormat(row) {
      return this.selectDictLabel(this.ptzTypeOptions, row.ptzType)
    },
    handleRecord(row) {
      this.$router.push({
        path: '/video/record/detail',
        query: {
          app: 'rtp',
          stream: `${row.deviceId}_${row.channelCode}`,
        },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>