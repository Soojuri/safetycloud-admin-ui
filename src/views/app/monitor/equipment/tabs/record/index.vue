<!--  -->
<template>
  <div class="sub-page">
    <div>
      <!-- <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
        <el-form-item label='日期选择'>
          <el-date-picker value-format='timestamp' v-model='dateRange' type='datetimerange' range-separator='至'
                          start-placeholder='开始时间' end-placeholder='结束时间' :default-time="['00:00:00', '23:59:59']" />
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form> -->
      <div class="mt-m">
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="recordId" label="录制文件ID" />
            <el-table-column prop="videoRecordUrl" label="录制格式">
              <template slot-scope="scope">{{ getCaption(scope.row.videoRecordUrl) }}</template>
            </el-table-column>
            <el-table-column prop="startEndTime" label="录制起止时间" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleDetails(scope.row)">播放</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeviceVideoRecordList, delDeviceVideoRecord } from '@/api/app/camera/deviceVideoRecord'
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
      dateRange: [],
      loading: false,
    }
  },
  props: {
    cameraInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    dict: {
      type: Object,
      default: () => {
        return []
      },
    },
  },
  computed: {},
  watch: {},
  mounted() {
    this.queryParams.deviceId = this.cameraInfo.deviceId
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
    getCaption(obj) {
      var index = obj.lastIndexOf('.')
      obj = obj.substring(index + 1, obj.length)
      return obj
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
            that.handleCurrentPageCalculateByDelete()
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleCurrentPageCalculateByDelete() {
      // 减少一条数据后向上取整 获得总页数
      const totalPage = Math.ceil((this.total - 1) / this.queryParams.size)
      this.queryParams.current = this.queryParams.current > totalPage ? totalPage : this.queryParams.current
      // 只有一条数据时,删除后,当前页码设置为 1
      this.queryParams.current = this.queryParams.current < 1 ? 1 : this.queryParams.current
    },
    handleDetails(row) {
      this.$router.push({
        path: '/app/camera/videoDevice/info/index/',
        query: {
          id: row.deviceId,
        },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>