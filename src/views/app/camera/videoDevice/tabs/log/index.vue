<!--  -->
<template>
  <div class="sub-page">
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
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="deviceNo" align="center" label="摄像头编号" />
            <el-table-column prop="deviceName" align="center" label="摄像头名称" />
            <el-table-column prop="logType" align="center" label="日志类型">
              <template slot-scope="scope">
                <el-tag type="warning" plain v-if="scope.row.logType == 0">设备离线</el-tag>
                <el-tag type="success" plain v-if="scope.row.logType == 1">设备上线</el-tag>
                <el-tag plain v-if="scope.row.logType == 2">设备生命周期变更</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="spaceName" align="center" label="空间目录" />
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">详情</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>
      <!-- 弹窗 -->
      <el-dialog :visible="formOptions.visible" width="888px" title="事件日志详情" append-to-body
                 :close-on-click-modal='false' @close="handleClose">
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
          <el-descriptions-item label="摄像头类型" :value="6"> {{ list.videoDeviceType }}
          </el-descriptions-item>
          <el-descriptions-item label="发生时间" :value="7"> {{ parseTime(list.createTime) }}
          </el-descriptions-item>
        </el-descriptions>
        <div slot='footer' class="dialog-footer">
          <el-button @click="handleClose">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import PopForm from './popForm.vue'
import { getDeviceList, delDevice } from '@/api/admin/diary'
export default {
  components: {
    // PopForm
  },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        startTime: null,
        endTime: null,
        deviceNo: null,
      },
      total: 0,
      tableData: [],
      formOptions: {
        visible: false,
        data: {},
      },
      dateRange: [],
      list: [],
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
      this.queryParams.deviceNo = this.$route.query.id
      this.queryParams.startTime = this.dateRange ? this.dateRange[0] : null
      this.queryParams.endTime = this.dateRange ? this.dateRange[1] : null
      this.loading = true
      getDeviceList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAdd() {
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      this.list = row
      this.formOptions.visible = true
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
    handleClose() {
      this.formOptions.visible = false
    },
    handleDelete(row) {
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delDevice(row.logId)
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