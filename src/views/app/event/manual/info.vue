<!-- 事件详情 -->
<template>
  <div class="sub-page">
    <div v-loading="loading">
      <div class="g-card">
        <div class="cell ">
          <div>
            <div class="product_name">{{info.eventName}}：{{info.eventId}}</div>
            <el-descriptions size="medium" column="2" class="mt-m">
              <el-descriptions-item label="事件名称">{{info.eventName}}</el-descriptions-item>
              <el-descriptions-item label="事件类型">{{info.eventType == 1?'作业活动':'设备设施'}}</el-descriptions-item>
              <!-- <el-descriptions-item label="发现时间">{{parseTime(info.createTime)}}</el-descriptions-item> -->
              <el-descriptions-item label="事件等级">{{formatEventLevel(info)}}</el-descriptions-item>
              <el-descriptions-item label="处理时间">{{parseTime(info.eventHandleTime)}}</el-descriptions-item>
              <!-- <el-descriptions-item label="上报类型">{{formatReportType(info)}}</el-descriptions-item> -->
              <el-descriptions-item :span='2' label="事件编号">{{ info.eventNo }}</el-descriptions-item>
              <el-descriptions-item label="备注">{{info.remark}}</el-descriptions-item>
            </el-descriptions>

          </div>
          <div>
            <div class="status">
              <dl>
                <dd>事件状态</dd>
                <dt v-if="info.eventStatus === 0" class="red">未处理</dt>
                <dt v-if="info.eventStatus === 1" class="green">已处理</dt>
              </dl>
              <dl>
                <dd>处理结果</dd>
                <dt>{{formatEventResult(info)}}</dt>
              </dl>
              <dl>
                <dd>上报结果</dd>
                <dt v-if="info.reportResult === 0" class="red">未上报</dt>
                <dt v-if="info.reportResult === 1" class="orange">待上报</dt>
                <dt v-if="info.reportResult === 2" class="green">已上报</dt>
              </dl>
            </div>
            <div class="mt-xl cell">
              <el-button :disabled="info.handleResult == 4 || info.handleResult == 3 || info.handleResult == 2"
                         type="primary" @click="handleSingleEvent()">上报城运</el-button>
              <el-button :disabled="info.handleResult === 4 || info.reportResult === 2" type="danger"
                         @click="handleSingleEvent(4,1)">判定误报</el-button>
              <el-button :disabled="info.handleResult === 3 || info.reportResult === 2" type="warning"
                         @click="handleSingleEvent(3,1)">判定重复</el-button>
            </div>
          </div>
        </div>
        <div class="step">
          <el-steps :active="info.eventProgress" finish-status="success">
            <el-step title="事件发现" :description="parseTime(info.eventDetectTime)"></el-step>
            <el-step title="事件处理" :description="parseTime(info.eventHandleTime)"></el-step>
            <el-step v-if="info.eventProgress !== 4 || info.eventCheckTime != null" title="事件复核"
                     :description="parseTime(info.eventCheckTime)">
            </el-step>
            <el-step title="完成" :description="parseTime(info.eventSubmitTime)"></el-step>
          </el-steps>
        </div>
      </div>
      <div class="g-card mt-m">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- <el-tab-pane label="事件信息" name="0">
          </el-tab-pane> -->
          <el-tab-pane label="设备信息" name="1">
          </el-tab-pane>
          <el-tab-pane label="相似重复事件" name="2">
          </el-tab-pane>
          <el-tab-pane label="事件操作日志" name="3">
          </el-tab-pane>
          <!-- <el-tab-pane label="事件处置进度" name="4">
          </el-tab-pane> -->
        </el-tabs>
        <keep-alive>
          <component :is="curComp" :info="info" :dict="dict" @getInfo="getList"></component>
        </keep-alive>
      </div>
    </div>

  </div>
</template>

<script>
import { getEventInfo } from '@/api/app/event/manual'
import { updateEventStatus, reportEvent } from '@/api/app/event/manual'
export default {
  components: {
    // EventInfo: () => import('./tabs/eventInfo/index.vue'),
    CameraInfo: () => import('./tabs/cameraInfo/index.vue'),
    RepeatEvent: () => import('./tabs/repeatEvent/index.vue'),
    LogInfo: () => import('./tabs/logInfo/index.vue'),
    // Schedule: () => import('./tabs/scheduleInfo/index.vue'),
  },
  data() {
    return {
      info: {},
      activeName: '1',
      id: '',
      dict: {
        eventResult: [],
        algorithmType: [],
        reportType: [],
        eventLevel: [],
      },
      curComp: null,
      metadata: {},
      loading: false,
    }
  },
  inject: ['reload'],
  watch: {
    $route(val) {
      this.id = this.$route.query.id
      this.getList()
    },
  },
  created() {},
  computed: {},
  mounted() {
    this.getDicts('event_handle_result').then((res) => {
      this.dict.eventResult = res.data.data
    })
    this.getDicts('algorithm_type').then((res) => {
      this.dict.algorithmType = res.data.data
    })
    this.getDicts('report_type').then((res) => {
      this.dict.reportType = res.data.data
    })
    this.getDicts('event_level').then((res) => {
      this.dict.eventLevel = res.data.data
    })
    this.id = this.$route.query.id
    this.getList()
  },
  methods: {
    getList() {
      getEventInfo(this.id).then((res) => {
        this.info = res.data.data
        this.curComp = 'CameraInfo'
        this.activeName = '1'
      })
    },
    handleClick(tab) {
      if (tab.name == 0) return (this.curComp = 'EventInfo')
      if (tab.name == 1) return (this.curComp = 'CameraInfo')
      if (tab.name == 2) return (this.curComp = 'RepeatEvent')
      if (tab.name == 3) return (this.curComp = 'LogInfo')
      if (tab.name == 4) return (this.curComp = 'Schedule')
    },
    formatEventResult(row) {
      return this.selectDictLabel(this.dict.eventResult, row.handleResult)
    },
    handleSingleEvent(handleResult, eventStatus) {
      this.loading = true
      const id = this.$route.query.id
      const data = {
        eventStatus,
        handleResult,
        ids: [id],
      }
      if (!handleResult) {
        reportEvent(data).then((res) => {
          this.loading = false
          if (res.data.data) {
            this.msgSuccess('上报成功')
            this.getList()
            this.getStatic()
          }
        })
      } else {
        updateEventStatus(data)
          .then((res) => {
            this.loading = false
            if (res.data.data) {
              this.msgSuccess('操作成功')
              this.getList()
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    formatReportType(row) {
      return this.selectDictLabel(this.dict.reportType, row.reportType)
    },
    formatEventLevel(row) {
      return this.selectDictLabel(this.dict.eventLevel, row.eventLevel)
    },
    formatAlgorithmType(row) {
      return this.selectDictLabel(this.dict.algorithmType, row.algorithmType)
    },
  },
}
</script>
<style lang='scss' scoped>
.product_name {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
}
.product_title {
  height: 40px;
  line-height: 40px;
}

.operation {
  font-size: 12px;
  margin-left: 20px;
  color: #1890ff;
  text-decoration: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  transition: color 0.3s;
}
dl,
dd,
dt {
  margin: 0;
}
.cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.status {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
dl {
  width: 100px;
  text-align: center;
}
dd {
  color: grey;
  font-size: 14px;
  width: 100%;
}
dt {
  text-align: center;
  margin: 5px;
  font-size: 22px;
}
.step {
  width: 80%;
  display: inline-block;
  margin: 50px 0px;
  margin-left: -40%;
  left: 50%;
  position: relative;
}
</style>