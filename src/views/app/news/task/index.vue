<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="queryParams.taskType" placeholder="任务类型">
            <el-option label="工单任务" :value="1" />
            <el-option label="事件任务" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择任务创建日期" prop="createTime">
          <el-date-picker v-model="value" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                          end-placeholder="结束日期" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="任务状态">
            <el-option label="任务创建" :value="0" />
            <el-option label="任务执行" :value="1" />
            <el-option label="任务驳回" :value="2" />
            <el-option label="任务完成" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button type="primary" @click="handleQuery">搜 索</el-button>
          <el-button @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-opera">
          <!-- <el-button type="primary" icon='el-icon-plus' @click="handleAdd">新 增</el-button> -->
        </div>
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column type="index" width="60" align="center" label="序号" />
            <el-table-column prop="taskType" align="center" label="任务类型">
              <template slot-scope="scope">
                <span v-if="scope.row.taskType == 1">工单任务</span>
                <span v-if="scope.row.taskType == 2">事件任务</span>
              </template>
            </el-table-column>
            <el-table-column prop="taskContent" align="center" label="任务描述" />
            <el-table-column prop="createTime" align="center" label="创建时间" width="160">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column prop="updateTime" align="center" label="更新时间" width="160">
              <template slot-scope="scope">{{parseTime(scope.row.updateTime)}}</template>
            </el-table-column>
            <el-table-column prop="creatorName" align="center" label="创建人" width="100" />
            <el-table-column prop="receiverName" align="center" label="接收人" width="100" />
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0" style="color: #409eff">
                  任务创建
                </span>
                <span v-if="scope.row.status == 1" style="color: #409eff">
                  任务执行
                </span>
                <span v-if="scope.row.status == 2" style="color: #f56c6c">
                  任务驳回
                </span>
                <span v-if="scope.row.status == 3" style="color: #67c23a">
                  任务完成
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <!-- <el-button size="mini"  type="text" @click="handleEdit(scope.row)">编辑</el-button> -->
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除
                </el-button>
                <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
                <el-button size="mini" type="text" :disabled="scope.row.status == 2?true:false"
                           @click="handleReject(scope.row)">驳回
                </el-button>
                <el-button size="mini" type="text" @click="handleDeal(scope.row)">处理
                </el-button>
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
      <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="getList()">
      </pop-form>
      <!-- 详情弹窗 -->
      <el-dialog :visible="diaVisible" width="500px" title="任务详情" append-to-body :close-on-click-modal='false'
                 @close="diaVisible = false">
        <el-descriptions :column="1" border size="medium" class="mt-xl">
          <el-descriptions-item label="工单名称"> {{ arr.name }}
          </el-descriptions-item>
          <el-descriptions-item label="目标设备"> {{ arr.deviceName }}
          </el-descriptions-item>
          <el-descriptions-item label="设备编号"> {{ arr.no }}
          </el-descriptions-item>
          <el-descriptions-item label="故障时间"> {{ parseTime(arr.createTime) }}
          </el-descriptions-item>
        </el-descriptions>
        <div slot='footer'>
          <el-button type="primary" @click="diaVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getWorkOrderInfo } from '@/api/app/fault/workOrder'
import PopForm from './popForm.vue'
import { getTaskList, delTask, putTask, putTaskReject } from '@/api/app/news/news.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        taskType: null,
        status: null,
        startTime: null,
        endTime: null,
      },
      total: 0,
      tableData: [],
      arr: [],
      value: [],
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
      diaVisible: false,
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getDicts('space_protocol_type').then((res) => {
      this.dict.protocolType = res.data.data
      this.getList()
    })
  },
  //方法集合
  methods: {
    getList() {
      this.queryParams.startTime = this.value[0]
      this.queryParams.endTime = this.value[1]
      this.loading = true
      getTaskList(this.queryParams)
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
      // if (!this.permissions.notice_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      // if (!this.permissions.notice_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.taskId
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
      this.value = []
      this.queryParams.startTime = null
      this.queryParams.endTime = null
      this.resetForm('queryParams')
      this.getList()
    },
    handleDetail(row) {
      this.diaVisible = true
      getWorkOrderInfo(row.workOrderId).then((res) => {
        this.arr = res.data.data
      })
    },
    handleDeal(row) {
      this.$router.push({
        path: '/app/fault/workOrder/index/',
      })
    },
    handleReject(row) {
      putTaskReject(row.workOrderId).then((res) => {
        if (res.data.data.data) {
          this.msgSuccess('驳回成功')
        } else {
          this.msgError(res.data.data.msg)
        }
      })
    },
    handleDelete(row) {
      // if (!this.permissions.notice_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除', '提示', {
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
.status-info {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #909399;
  border-radius: 50%;
}

.status-primary {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #409eff;
  border-radius: 50%;
  // border: 1px solid #409eff;
}

.status-success {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #67c23a;
  border-radius: 50%;
}

.status-waring {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #e6a23c;
  border-radius: 50%;
  // border: 1px solid #e6a23c;
}

.status-danger {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #f56c6c;
  border-radius: 50%;
  // border: 1px solid #f56c6c;
}
</style>
