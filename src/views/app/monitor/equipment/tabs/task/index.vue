<!-- 任务作业 -->
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
            <el-table-column prop="taskId" label="任务作业ID" />
            <el-table-column prop="taskName" label="作业名称" />
            <el-table-column prop="status" label="作业状态">
              <template slot-scope="scope">
                <div v-if="scope.row.status == 0">异常</div>
                <div v-if="scope.row.status == 1">运行中</div>
                <div v-if="scope.row.status == 2">运行成功</div>
                <div v-if="scope.row.status == 3">运行失败</div>
                <div v-if="scope.row.status == 4">等待创建</div>
                <div v-if="scope.row.status == 5">创建失败</div>
                <div v-if="scope.row.status == 6">等待删除</div>
                <div v-if="scope.row.status == 7">删除失败</div>
                <div v-if="scope.row.status == 8">停止中</div>
                <div v-if="scope.row.status == 9">停止</div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="任务作业日期">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <!-- <el-table-column prop="c5" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleAction(scope.row)">
                  {{scope.row.status == 1 || scope.row.status == 2? '停止': '启动' }}
                </el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column> -->
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
import { getTaskInfoList, delTask, startTask, stopTask } from '@/api/app/task/opera.js'
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
      loading: false,
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
      getTaskInfoList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAction(row) {
      if (row.status == 1 || row.status == 2) {
        stopTask(row.taskId).then((res) => {
          if (res.data.code == 0) {
            this.msgSuccess('停止成功')
            this.getList()
          }
        })
      } else {
        startTask(row.taskId).then((res) => {
          if (res.data.code == 0) {
            this.msgSuccess('启动成功')
            this.getList()
          }
        })
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
      this.$confirm('是否确认删除该任务作业', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delTask(row.taskId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>