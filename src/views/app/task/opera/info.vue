<template>
  <div class='sub-page'>
    <div class="g-card">
      <div class="tit">任务作业详情</div>
      <el-descriptions size="medium" title="">
        <el-descriptions-item label="任务名称">{{info.taskName}}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{parseTime(info.createTime)}}</el-descriptions-item>
        <el-descriptions-item label="ID">{{info.taskId}}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{parseTime(info.updateTime)}}</el-descriptions-item>
        <el-descriptions-item label="累计识别事件总数">{{info.eventCount}}</el-descriptions-item>
        <el-descriptions-item label="累计审核事件总数">{{info.examineEventCount}}</el-descriptions-item>
        <el-descriptions-item label="累计上报事件总数">{{info.reportEventCount}}</el-descriptions-item>
        <el-descriptions-item label="状态">
          {{formatStatus(info)}}
        </el-descriptions-item>
        <el-descriptions-item label="描述">{{info.description}}</el-descriptions-item>
        <el-descriptions-item label="异常信息">{{info.abnormalInfo || '无'}}</el-descriptions-item>
        <el-descriptions-item label="摄像机名称">{{info.deviceName}}</el-descriptions-item>
        <el-descriptions-item label="行政区域">{{info.area}}</el-descriptions-item>
        <el-descriptions-item label="具体地址">{{info.address}}</el-descriptions-item>
      </el-descriptions>
      <el-tabs class="mt-m" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="算法模板配置" name="0">
          <el-descriptions size="medium" title="公共配置项">
            <el-descriptions-item v-for="item in info.configLabel" :key="item.key" :label="item.label">
              {{item.value}}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="算法结果输出" name="1">
          <table>
            <thead>
              <tr>
                <th>参数名</th>
                <th>参数值</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value,name) in info.outputConfig.webhook.headers">
                <td>
                  {{name}}
                </td>
                <td>
                  {{value}}
                </td>
                <td>
                  {{info.outputConfig.webhook.url}}
                </td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="数据源" name="2">
          <table v-if="info.inputConfig.type === 'edgecamera'">
            <thead>
              <tr>
                <th>序号</th>
                <th>摄像头ID</th>
                <th>摄像头名称</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in info.inputConfig.data">
                <td>
                  {{item.index}}
                </td>
                <td>
                  {{item.id}}
                </td>
                <td>
                  {{getDeviceName(item.id)}}
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="info.inputConfig.type === 'vcn'">
            <el-descriptions size="medium" title="VCN" :column="2">
              <el-descriptions-item label="IP地址">{{info.inputConfig.vcn.ip}}</el-descriptions-item>
              <el-descriptions-item label="端口号">{{info.inputConfig.vcn.port}}</el-descriptions-item>
              <el-descriptions-item label="用户名">{{info.inputConfig.vcn.username}}</el-descriptions-item>
              <!-- <el-descriptions-item label="密码">{{info.inputConfig.vcn.password}}</el-descriptions-item> -->
            </el-descriptions>
            <el-table class="mt-m" :data="info.inputConfig.data">
              <el-table-column label="摄像头ID" prop="device_id"></el-table-column>
              <el-table-column label="码流类型" prop="stream_type">
                <template slot-scope="scope">
                  <span v-if="scope.row.stream_type == 1">主码流</span>
                  <span v-if="scope.row.stream_type == 2">辅码流1</span></span>
                  <span v-if="scope.row.stream_type == 3">辅码流2</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="定时策略" name="3">
          <el-form style="width:500px" disabled :rules="rules" :model='info' label-width='100px' ref='form'>
            <el-form-item label='任务类型' prop="taskType">
              <el-radio-group class="mt-s" v-model="info.taskType">
                <el-radio :label="1">普通任务</el-radio>
                <el-radio :label="2">计划任务</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="info.taskType == 2">
              <el-form-item label='时区' prop='planConfig.timezone'>
                <el-input size='small' v-model='info.planConfig.timezone' placeholder='请输入时区'></el-input>
              </el-form-item>
              <el-form-item label='执行频率' prop='planConfig.type'>
                <el-radio-group class="mt-s" v-model="info.planConfig.type">
                  <el-radio label="once">执行一次</el-radio>
                  <el-radio label="daily">每天</el-radio>
                  <el-radio label="weekly">每周</el-radio>
                  <el-radio label="monthly">每月</el-radio>
                </el-radio-group>
                <el-select class="mt-m" v-if="info.planConfig.type =='weekly'" multiple
                           v-model="info.planConfig.days_of_week" placeholder="请选择">
                  <el-option v-for="item in dict.week" :label="item.label" :value="item.value" :key="item.value">
                  </el-option>
                </el-select>
                <el-select class="mt-m" v-if="info.planConfig.type =='monthly'" multiple
                           v-model="info.planConfig.days_of_monthly" placeholder="请选择">
                  <el-option v-for="i in 31" :label="`${i}号`" :value="i" :key="i">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label='执行模式' prop="mode">
                <el-radio-group class="mt-s" v-model="info.mode">
                  <el-radio :label="1">按时间段</el-radio>
                  <el-radio :label="2">按频率</el-radio>
                </el-radio-group>
                <!-- 按时间段 --->
                <template v-if="info.mode==1">
                  <div class="mt-m cell" v-for="(item,index) in info.planConfig.periods">
                    <!-- 执行一次 --->
                    <el-date-picker v-if="info.planConfig.type == 'once'" type="datetimerange"
                                    :picker-options="pickerOptions" v-model='item.dateRange'
                                    format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-ddThh:mm:ss"
                                    :default-time="['00:00:00', '23:59:59']" range-separator='至'
                                    start-placeholder='开始时间' end-placeholder='结束时间' />
                    <!-- 其他 --->
                    <template v-else>
                      <el-time-picker is-range v-model="item.dateRange" :picker-options="pickerOptions"
                                      value-format="hh:mm:ss" range-separator="至" start-placeholder="开始时间"
                                      end-placeholder="结束时间">
                      </el-time-picker>
                    </template>
                    <el-button class="ml-m" icon="el-icon-delete" type="text" @click="handleDelTimeRange(index)">
                    </el-button>
                  </div>

                </template>
                <!-- 按频率 --->
                <template v-if="info.mode==2">
                  <el-date-picker value-format="yyyy-MM-ddThh:mm:ss" :picker-options="pickerOptions" size="small"
                                  class="mt-m" v-if="info.planConfig.type === 'once'" v-model="info.planConfig.date">
                  </el-date-picker>
                  <el-form-item class="mt-m" label='是否添加起止时间' label-width="130px">
                    <el-switch class="mt-s" v-model="isSelectTime" :active-value="true" :inactive-value="false">
                    </el-switch>
                  </el-form-item>
                  <el-time-picker value-format="hh:mm:ss" class="mb-m" v-if="isSelectTime" is-range
                                  v-model="frequencyDate" range-separator="至" start-placeholder="开始时间"
                                  end-placeholder="结束时间">
                  </el-time-picker>
                  <el-form-item class="mt-s" label='间隔时长' label-width="75px">
                    <el-input-number v-model="info.planConfig.frequency.interval"></el-input-number> 分钟
                  </el-form-item>
                  <el-form-item class="mt-s" label='执行时长' label-width="75px">
                    <el-input-number v-model="info.planConfig.frequency.duration"></el-input-number> 分钟
                  </el-form-item>
                </template>
              </el-form-item>

            </template>

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="任务事件列表" name="4">
          <!-- 表格 -->
          <div class="g-table">
            <el-table v-loading="loading1" border :data="tableData1" style="width: 100%">
              <el-table-column type="index" label="序号" align="center" width="55">
              </el-table-column>
              <el-table-column prop="algorithmType" align="center" label="算法类别" width="180"
                               :formatter="algorithmTypeFormat">
              </el-table-column>
              <el-table-column prop="eventName" align="center" label="事件类型名称" width="180">
              </el-table-column>
              <el-table-column prop="deviceName" align="center" label="摄像机名称" width="180">
              </el-table-column>
              <el-table-column prop="address" align="center" label="地址名称">
              </el-table-column>
              <el-table-column prop="eventStatus" align="center" label="事件状态" width="100">
                <template slot-scope="scope">
                  <template v-if="scope.row.eventStatus == 0">
                    <span class="yellow_status"></span>
                    <span class="status_text">待处理</span>
                  </template>
                  <template v-if="scope.row.eventStatus == 1 ">
                    <span class="green_status"></span>
                    <span class="status_text">已处理</span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="handleResult" align="center" label="处理结果" width="100">
                <template slot-scope="scope">
                  <el-tag type="info" v-if="scope.row.handleResult == 0">待处理</el-tag>
                  <el-tag v-if="scope.row.handleResult == 1">有效</el-tag>
                  <el-tag closable v-if="scope.row.handleResult == 3" @close="handleSingleEvent(scope.row.eventId,1,1)"
                          type="warning">重复</el-tag>
                  <el-tag closable v-if="scope.row.handleResult == 4" @close="handleSingleEvent(scope.row.eventId,1,1)"
                          type="danger">误报</el-tag>
                  <el-tag v-if="scope.row.handleResult == 2" type="success">已提交</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="reportResult" align="center" label="上报结果" width="100">
                <template slot-scope="scope">
                  <div class="red" v-if="scope.row.reportResult === 0">未上报</div>
                  <div class="orange" v-if="scope.row.reportResult === 1">待上报</div>
                  <div class="green" v-if="scope.row.reportResult === 2">已上报</div>
                </template>
              </el-table-column>
              <el-table-column prop="eventDetectTime" align="center" label="发现时间" width="180">
                <template slot-scope="scope">{{parseTime(scope.row.eventDetectTime)}}</template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" icon="el-icon-info" @click="handleDetails(scope.row)">查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="g-page-x mt-m">
            <pagination :pageSizes="[10,20,50,100]" :total="total1" :page.sync="queryParams1.current"
                        :limit.sync="queryParams1.size" @pagination="getTable1" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="查看日志" name="5">
          <el-form ref="queryParams" :model="queryParams" inline>
            <el-form-item label="操作时间" prop="createTime">
              <el-date-picker v-model="value" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                              end-placeholder="结束日期" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="ml-xl">
              <el-button icon="el-icon-search" type="primary" @click="handleQuery">查 询</el-button>
              <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
            </el-form-item>
          </el-form>
          <div class="mt-m">
            <div class="g-table">
              <el-table v-loading="loading" border :data="tableData">
                <el-table-column type="index" align="center" label="序号" />
                <el-table-column prop="taskId" align="center" label="任务作业ID" />
                <el-table-column prop="taskName" align="center" label="任务作业名称" />
                <el-table-column prop="operationType" align="center" label="变更类型">
                  <template slot-scope="scope">
                    <el-tag type="success" plain v-if="scope.row.operationType == 1">创建作业</el-tag>
                    <el-tag type="success" plain v-if="scope.row.operationType == 2">启动作业</el-tag>
                    <el-tag type="success" plain v-if="scope.row.operationType == 3">更新作业</el-tag>
                    <el-tag type="warning" plain v-if="scope.row.operationType == 4">停止作业</el-tag>
                    <el-tag type="warning" plain v-if="scope.row.operationType == 5">删除作业</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="creator" align="center" label="操作人员" />

                <el-table-column prop="status" align="center" label="操作结果">
                  <template slot-scope="scope">
                    <el-tag type="primary" plain v-if="scope.row.status == 1">成功</el-tag>
                    <el-tag type="info" plain v-if="scope.row.status == 0">失败</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" align="center" label="操作时间">
                  <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" @click="handleEdit(scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="g-page-x mt-m">
              <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                          :limit.sync="queryParams.size" @pagination="getTable" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹窗 -->
    <el-dialog :visible="formOptions.visible" width="888px" title="作业日志详情" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-descriptions :column="2" size="medium" class="mt-xl">
        <el-descriptions-item label="作业ID" :value="1"> {{ list.taskId }}
        </el-descriptions-item>
        <el-descriptions-item label="作业名称" :value="2"> {{ list.content }}
        </el-descriptions-item>
        <el-descriptions-item label="作业状态" :value="3">{{ list.taskStatus }}
        </el-descriptions-item>
        <el-descriptions-item label="变更类型" :value="4">
          {{ list.operationType == 1? '创建作业' :list.operationType == 2? '启动作业' :list.operationType == 3? '更新作业' :list.operationType == 4?'停止作业' :list.operationType == 5?'删除作业' : '' }}
        </el-descriptions-item>
        <el-descriptions-item label="操作人" :value="5"> {{ list.creator }}
        </el-descriptions-item>
        <el-descriptions-item label="操作结果" :value="6"> {{ list.status == 1?'成功':'失败' }}
        </el-descriptions-item>
        <el-descriptions-item label="算法模型" :value="7"> {{ list.algorithmName }}
        </el-descriptions-item>
        <el-descriptions-item label="操作时间" :value="8"> {{ parseTime(list.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="摄像机ID" :value="9"> {{ list.deviceId }}
        </el-descriptions-item>
        <el-descriptions-item label="摄像机名称" :value="10"> {{ list.deviceName }}
        </el-descriptions-item>
      </el-descriptions>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTaskInfo } from '@/api/app/task/opera'
import { getEdgeDeviceList } from '@/api/app/edge/device'
import { getWorkList } from '@/api/admin/diary'
import { getEventList, updateEventStatus, reportEvent } from '@/api/app/event/manual'
export default {
  data() {
    return {
      info: {
        serviceConfig: {
          common: {},
        },
        inputConfig: {
          data: [],
        },
        outputConfig: {
          webhook: {
            headers: {},
          },
        },
        mode: 1,
        planConfig: {
          timezone: null, // 时区
          type: 'once', //执行频率
          days_of_week: null,
          days_of_monthly: null,
          periods: [
            {
              begin_at: null,
              end_at: null,
              dateRange: [],
            },
          ], // 时间段
          frequency: {
            begin_at: null,
            end_at: null,
            duration: null,
            interval: null,
          },
        },
      },
      queryParams1: {
        taskId: null,
        size: 10,
        current: 1,
      },
      total1: 0,
      tableData1: [],
      loading1: false,
      selection: [],
      queryParams: {
        size: 10,
        current: 1,
        taskId: null,
        startTime: null,
        endTime: null,
      },
      total: 0,
      value: [],
      tableData: [],
      loading: false,
      list: [],
      formOptions: {
        visible: false,
        data: {},
      },
      id: null,
      dict: {
        taskStatus: [],
      },
      activeName: '0',
      deviceList: [],
      algorithmType: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()
        },
      },
    }
  },
  watch: {
    $route() {
      this.id = this.$route.query.id
      getEdgeDeviceList({ current: 1, size: 10000 }).then((res) => {
        console.log(this.deviceList)
        this.deviceList = res.data.data.records
        this.getList()
      })
      this.getTable()
      this.getTable1()
    },
  },
  mounted() {
    this.id = this.$route.query.id
    this.getDicts('task_status').then((res) => {
      this.dict.taskStatus = res.data.data
    })
    this.getDicts('algorithm_type').then((res) => {
      this.algorithmType = res.data.data
    })
    getEdgeDeviceList({ current: 1, size: 10000 }).then((res) => {
      console.log(this.deviceList)
      this.deviceList = res.data.data.records
      this.getList()
    })
    this.getTable()
    this.getTable1()
  },
  methods: {
    getList() {
      getTaskInfo(this.id).then((res) => {
        this.info = res.data.data
        this.info.configLabel = JSON.parse(res.data.data.configLabel || [])
        if (this.info.planConfig.frequency === null) {
          this.info.mode = 1
          this.info.planConfig.periods = this.info.planConfig.periods.map((item) => {
            return {
              begin_at: item.begin_at,
              end_at: item.end_at,
              dateRange: [item.begin_at, item.end_at],
            }
          })
        } else {
          this.info.mode = 2
        }
      })
    },
    formatStatus(row) {
      return this.selectDictLabel(this.dict.taskStatus, row.status)
    },
    //任务事件列表
    getTable1() {
      this.loading1 = true
      this.queryParams1.taskId = this.id
      getEventList(this.queryParams1)
        .then((res) => {
          this.loading1 = false
          this.tableData1 = res.data.data.records
          this.total1 = res.data.data.total
        })
        .catch(() => {
          this.loading1 = false
        })
    },
    handleDetails(row) {
      const id = row.eventId
      this.$router.push({
        path: '/app/event/manual/info/index/',
        query: {
          id,
        },
      })
    },
    handleSingleEvent(id, handleResult, eventStatus) {
      const data = {
        eventStatus,
        handleResult,
        ids: [id],
      }
      if (!handleResult) {
        reportEvent(data).then((res) => {
          if (res.data.data) {
            this.msgSuccess('上报成功')
            this.getTable1()
          }
        })
      } else {
        updateEventStatus(data).then((res) => {
          if (res.data.data) {
            this.msgSuccess('操作成功')
            this.getTable1()
          }
        })
      }
    },
    //日志
    getTable() {
      this.queryParams.taskId = this.id
      this.queryParams.startTime = this.value[0]
      this.queryParams.endTime = this.value[1]
      this.loading = true
      getWorkList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleEdit(row) {
      this.list = row
      this.formOptions.visible = true
    },
    handleQuery() {
      const that = this
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          that.getTable()
        }
      })
    },
    handleClose() {
      this.formOptions.visible = false
    },
    handleClear() {
      this.value = []
      this.queryParams.startTime = null
      this.queryParams.endTime = null
      this.resetForm('queryParams')
      this.getTable()
    },
    getDeviceName(id) {
      const info = this.deviceList.find((device) => device.edgeDeviceId === id)
      if (info) {
        return info.edgeDeviceName || null
      } else {
        return null
      }
    },
    algorithmTypeFormat(row) {
      return this.selectDictLabel(this.algorithmType, row.algorithmType)
    },
  },
}
</script>
<style scoped lang="scss">
table > thead > tr > th:not(:last-child) {
  border-right: 1px solid #fff;
}
table {
  width: 100%;
  thead {
    tr {
      th {
        box-sizing: border-box;
        position: refative;
        cursor: default;
        background-color: #f2f5fc;
        outline: 0;
        height: 28px;
        line-height: 28px;
        color: #575d6c;
        font-weight: 600;
        border-left: none;
        border-bottom: 1px solid #dfe1e6;
        text-align: left;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        padding: 5px;
      }
    }
  }
  tbody {
    td {
      padding: 5px;
      font-size: 12px;
    }
  }
}
.cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
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
</style>