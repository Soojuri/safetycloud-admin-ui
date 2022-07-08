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
      <div class="mt-m cell" v-if="tableData.length>0">
        <div class="ml-m" v-for="item in tableData" :key="item.captureId" style="width:150px">
          <el-image style="width: 100%; height: 150px" :src="imagePath + item.captureUrl" fit="cover">
          </el-image>
          <span class="f12">{{parseTime(item.createTime)}}</span>
        </div>
      </div>
      <div class="g-page-x mt-m" v-if="tableData.length>0">
        <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                    :limit.sync="queryParams.size" @pagination="getList" />
      </div>
      <el-empty v-else image-size="50"></el-empty>
    </div>
  </div>
</template>

<script>
import { getDeviceVideoCaptureList, delDeviceVideoCapture } from '@/api/app/camera/deviceVideoCapture'
import { imagePath } from '@/config/env'
export default {
  components: {},
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
      imagePath: imagePath,
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.queryParams.deviceId = this.cameraInfo.deviceId
      this.queryParams.startTime = this.dateRange ? this.dateRange[0] : null
      this.queryParams.endTime = this.dateRange ? this.dateRange[1] : null
      getDeviceVideoCaptureList(this.queryParams).then((res) => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
      })
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
          return delDeviceVideoCapture(row.captureId)
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
      const id = row.spaceId
      this.$router.push({
        path: '/app/camera/space/info/index/',
        query: { id },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
.cell {
  display: flex;
  flex: 1;
  // align-items: center;
  // justify-content: space-evenly;
}
.row {
  display: flex;
  // margin-right: -12 * $vw;
}
.flex2 {
  flex: 2;
}
.f12 {
  font-size: 12px;
  text-align: center;
  width: 100%;
  display: inline-block;
}
</style>