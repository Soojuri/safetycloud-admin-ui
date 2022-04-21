<!--  -->
<template>
  <div class="sub-page" v-loading="loading" :element-loading-text="login_text" element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0.8, 0.8)">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
        <el-form-item label='日期选择'>
          <el-date-picker value-format='timestamp' v-model='dateRange' type='datetimerange' range-separator='至'
                          start-placeholder='开始时间' end-placeholder='结束时间' :default-time="['00:00:00', '23:59:59']" />
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-table">
          <el-table border :data=" tableData">
            <el-table-column align="center" prop="recordId" label="录制文件ID" />
            <el-table-column align="center" prop="videoRecordUrl" label="录制格式">
              <template slot-scope="scope">{{ getCaption(scope.row.videoRecordUrl) }}</template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column align="center" prop="startEndTime" label="录制起止时间" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handlePlay(scope.row)">播放</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
                <el-button :disabled="!scope.row.videoRecordUrl" @click="downVideo(scope.row.videoRecordUrl)"
                           type="text">下载</el-button>

              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="g-page-x mt-m">
          <pagination :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size"
                      @pagination="getList" />
        </div>
      </div>
    </div>
    <el-dialog title="播放录像" :visible="showVideo" @close="showVideo = false">
      <video controls class="videoFrame" ref="videoFrame">
        <source type="video/mp4">
      </video>
    </el-dialog>
  </div>
</template>

<script>
import { getDeviceVideoRecordList, delDeviceVideoRecord } from '@/api/app/camera/deviceVideoRecord'
import { imagePath } from '@/config/env'
export default {
  components: {},
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        startTime: null,
        endTime: null,
        deviceId: null,
      },
      total: 0,
      tableData: [],
      list: [],
      dateRange: [],
      loading: false,
      showVideo: false,
      imagePath,
      login_text: '',
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.queryParams.deviceId = this.$route.query.id
    this.getList()
  },
  methods: {
    getList() {
      this.queryParams.startTime = this.dateRange ? this.dateRange[0] : null
      this.queryParams.endTime = this.dateRange ? this.dateRange[1] : null
      getDeviceVideoRecordList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    downVideo(videoSrc) {
      const that = this
      var xhr = new XMLHttpRequest()
      const url = videoSrc.indexOf('http') != -1 ? videoSrc : imagePath + '/iotcloud/' + videoSrc
      this.loading = true
      xhr.open('GET', url, true)
      xhr.addEventListener(
        'progress',
        function (obj) {
          if (obj.lengthComputable) {
            var percentComplete = obj.loaded / obj.total
            that.login_text = (percentComplete * 100).toFixed(2) + '%'
            if (percentComplete === 1) {
              that.loading = false
            }
            // 可得到下载进度
          }
        },
        false
      )
      xhr.responseType = 'blob' // 设置返回类型blob
      xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let blob = this.response
          // 转换一个blob链接
          let u = window.URL.createObjectURL(
            new Blob([blob], {
              type: 'video/mp4',
            })
          )
          let a = document.createElement('a')
          a.download = url //这里是文件名称，这里暂时用链接代替，可以替换
          a.href = u
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
        }
      }
      xhr.send()
    },
    downloadVideo(videoSrc) {
      // const url = imagePath + '/iotcloud/' + videoSrc
      const url = videoSrc.indexOf('http') != -1 ? videoSrc : imagePath + '/iotcloud/' + videoSrc
      this.loading = true
      this.downBlobFile(url, {}, '录像')
        .then((res) => {
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },
    handlePlay(row) {
      this.showVideo = true
      // this.videoUrl = imagePath + '/iotcloud/' + row.videoRecordUrl
      this.videoUrl =
        row.videoRecordUrl.indexOf('http') != -1 ? row.videoRecordUrl : imagePath + '/iotcloud/' + row.videoRecordUrl
      this.$nextTick(() => {
        let video = this.$refs.videoFrame
        console.log(this.videoUrl)
        video.src = this.videoUrl
        video.play()
      })
    },
    getCaption(obj) {
      if (obj) {
        var index = obj.lastIndexOf('.')
        obj = obj.substring(index + 1, obj.length)
        return obj
      }
    },
    handleQuery() {
      const that = this
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          that.getList()
        }
      })
    },
    handleClear() {
      this.dateRange = null
      this.queryParams.startTime = null
      this.queryParams.endTime = null
      this.resetForm('queryParams')
      this.getList()
    },
    handleDelete(row) {
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delDeviceVideoRecord(row.recordId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleDownLoad(row) {
      let oA = document.createElement('a')
      oA.download = this.parseTime(new Date()) // 设置下载的文件名，默认是'下载'
      oA.href = canvasLink
      document.body.appendChild(oA)
      oA.click() // 生成虚拟a标签之后触发点击事件进行下载；
      oA.remove() // 下载之后把创建的元素删除
    },
  },
}
</script>
<style lang='scss' scoped>
.videoFrame {
  border: 1px solid #fff;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>