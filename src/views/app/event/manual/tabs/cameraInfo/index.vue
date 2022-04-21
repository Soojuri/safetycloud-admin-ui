<!-- 摄像机信息 -->
<template>
  <div class="clearfix" v-loading="loading" :element-loading-text="login_text" element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0.8, 0.8)">
    <div>
      <span class="ft16">摄像机信息</span>
    </div>
    <div>
      <el-description class="mt-xl">
        <el-description-item label="摄像机编号" :value="list.deviceNo" :span="8" />
        <el-description-item label="摄像机名称" :value="list.deviceName" :span="8" />
        <el-description-item label="摄像机类型"
                             :value="info.videoDeviceType == 1?'NVR设备':info.videoDeviceType == 2?'球形摄像机':info.videoDeviceType == 3?'半球形摄像机':info.videoDeviceType == 4?'枪式摄像机':info.videoDeviceType == 5?'网络摄像机':'其他'"
                             :span="8" />
        <el-description-item label="摄像机地址" :value="list.address" :span="8" />
        <el-description-item label="在线状态" :value="formatStatus(list.status)" :span="8" />
        <el-description-item label="创建时间" :value="parseTime(list.createTime)" :span="8" />
        <el-description-item label="所属空间" :value="list.spaceName" :span="8" />
        <el-description-item label="更新时间" :value="parseTime(list.updateTime)" :span="8" />
      </el-description>
      <el-button class="mt-m" type="primary" @click="handleInfo(list)">查看摄像机详情</el-button>
    </div>
    <div class="row">
      <div class="col left">
        <div class="tit" style="height: 28px">事件关联快照</div>
        <el-image style="height:15vw;width:28vw" :src="info.eventCaptureUrl && info.eventCaptureUrl.indexOf('http') !=-1?
                  info.eventCaptureUrl :imagePath + info.eventCaptureUrl" :fit="fit" :preview-src-list="[info.eventCaptureUrl && info.eventCaptureUrl.indexOf('http') !=-1?
                  info.eventCaptureUrl :imagePath + info.eventCaptureUrl]">
        </el-image>
      </div>
      <div class="col right">
        <div class="tit">
          <span class="video">事件关联录像</span>
          <el-button :disabled="info.eventVideoUrl?false:true" @click="downVideo(videoSrc)" size="mini" type="primary">
            下载录像 </el-button>
          <!-- <a ref="videoA" :style="info.eventVideoUrl?'':'pointer-events: none'" :href="videoSrc" :download="videoSrc">
            
          </a>&nbsp; -->
          <el-button :disabled="info.eventVideoUrl?false:true" size="mini" @click="copy">复制链接</el-button>
        </div>
        <video height="300px" controls :src="videoSrc">
          您的浏览器不支持 video 标签。
        </video>
      </div>
    </div>

  </div>
</template>

<script>
import { imagePath } from '@/config/env'
import ElDescription from '@/components/ElDescription'
import ElDescriptionItem from '@/components/ElDescriptionItem'
import { getVideoDeviceInfo } from '@/api/app/camera/videoDevice'
import { getDeviceVideoRecordList, getDeviceVideoRecordInfo } from '@/api/app/camera/deviceVideoRecord'
export default {
  components: {
    ElDescription,
    ElDescriptionItem,
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      list: [],
      queryParams: {
        size: 10,
        current: 1,
      },
      imagePath: imagePath,
      deviceStatus: [],
      loading: false,
      login_text: '',
    }
  },
  computed: {
    videoSrc() {
      if (this.info.eventVideoUrl) {
        if (this.info.eventVideoUrl.indexOf('http') != -1) {
          return this.info.eventVideoUrl
        } else {
          return imagePath + '/iotcloud/' + this.info.eventVideoUrl
        }
      } else {
        return ''
      }
    },
  },
  watch: {
    info(val) {
      if (val) {
        this.getList()
      }
    },
  },
  mounted() {
    this.getDicts('video_status').then((res) => {
      this.deviceStatus = res.data.data
    })
    this.getList()
    console.log(this.info)
  },
  methods: {
    getList() {
      const id = this.info.deviceId
      getVideoDeviceInfo(id).then((res) => {
        this.list = res.data.data
      })
    },
    handleInfo(row) {
      this.$router.push({
        path: '/app/camera/videoDevice/info/index/',
        query: {
          id: row.deviceId,
        },
      })
    },
    downVideo(videoSrc) {
      const that = this
      var xhr = new XMLHttpRequest()
      const url = videoSrc
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
      this.loading = true
      this.downBlobFile(videoSrc, {}, '录像')
        .then((res) => {
          this.loading = false
        })
        .catch((err) => {
          this.loading = false
        })
    },
    formatStatus(status) {
      return this.selectDictLabel(this.deviceStatus, status)
    },
    copy() {
      let createInput = document.createElement('input')
      createInput.value = this.videoSrc
      document.body.appendChild(createInput)
      createInput.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      createInput.style.display = 'none'
      this.$message({ message: '复制成功', type: 'success' })
    },
  },
}
</script>
<style lang='scss' scoped>
.chartZYSJ {
  height: 280px;
  min-width: 400px;
}
.row {
  display: flex;
  .col {
    padding: 16px;
    background: white;
    border-radius: 3px;
    &.left {
      flex: 3;
    }
    &.right {
      flex: 4;
      margin-left: 12px;
    }
  }
  .tit {
    font-size: 18px;
    display: flex;
    align-items: flex-start;
    margin: 13px 0;
    &::before {
      content: '';
      height: 20px;
      width: 4px;
      border-radius: 2px;
      background: #2975ff;
      display: inline-block;
      margin-right: 8px;
      vertical-align: top;
      margin-top: 3px;
    }
  }
}
.video {
  margin-right: 20px;
}
</style>