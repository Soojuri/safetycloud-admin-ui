<!-- 设备日志详情-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" title="设备日志详情" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-descriptions :column="2" size="medium" class="mt-xl">
        <el-descriptions-item label="摄像头ID" :value="1"> {{ list.deviceId }}
        </el-descriptions-item>
        <el-descriptions-item label="摄像头名称" :value="2"> {{ list.deviceName }}
        </el-descriptions-item>
        <el-descriptions-item label="所属空间目录" :value="3"> {{ list.spaceName }}
        </el-descriptions-item>
        <el-descriptions-item label="日志类型" :value="4">
          {{ list.logType == 0? '设备离线' :list.logType == 1? '设备上线' :list.logType == 2? '设备生命周期变更' : '' }}
        </el-descriptions-item>
        <el-descriptions-item label="设备地址" :value="5"> {{ list.address }}
        </el-descriptions-item>
        <el-descriptions-item label="摄像头类型" :value="6">
          {{ list.videoDeviceType == 1?'NVR设备':list.videoDeviceType == 2?'球形摄像机':list.videoDeviceType == 3?'半球形摄像机':list.videoDeviceType == 4?'枪式摄像机':list.videoDeviceType == 5?'网络摄像机':'其他' }}
        </el-descriptions-item>
        <el-descriptions-item label="发生时间" :value="7"> {{ parseTime(list.createTime) }}
        </el-descriptions-item>
      </el-descriptions>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      list: [],
    }
  },
  created() {
    this.list = this.data ? this.data : null
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
  },
}
</script>