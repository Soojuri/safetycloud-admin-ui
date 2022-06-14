<template>
  <div class="sub-page">
    <div class="g-card">
      <div class="count-x">
        <div class="cell c1">
          <img class="icon" :src="require('@/assets/images/event-audit/icon-sjzs.png')" />
          <dl>
            <dd>{{staticData.allCount}}</dd>
            <dt>事件总数</dt>
          </dl>
        </div>
        <div class="cell c2">
          <img class="icon" :src="require('@/assets/images/event-audit/icon-ycl.png')" />
          <dl>
            <dd>{{staticData.doneCount}}</dd>
            <dt>已处理</dt>
          </dl>
        </div>
        <div class="cell c3">
          <img class="icon" :src="require('@/assets/images/event-audit/icon-dcl.png')" />
          <dl>
            <dd>{{staticData.todoCount}}</dd>
            <dt>待处理</dt>
          </dl>
        </div>
      </div>
      <!-- 头部筛选 -->
      <div class=" mt-l">
        <el-form ref="queryParams" :rules="rules" :model="queryParams" inline>
          <el-form-item label="事件等级" prop="eventLevel">
            <el-select style="width:191px;" v-model="queryParams.eventLevel" placeholder="请选择事件等级">
              <el-option v-for="item in dict.eventLevel" :key="item.value" :label="item.label"
                         :value="parseInt(item.value)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='事件编号' prop='eventNo'>
            <el-input size='small' v-model='queryParams.eventNo' placeholder='请输入事件编号'></el-input>
          </el-form-item>
          <el-form-item label='事件名称' prop='eventName'>
            <el-input size='small' v-model='queryParams.eventName' placeholder='请输入事件名称'></el-input>
          </el-form-item>
          <el-form-item label="处理结果" prop="handleResult">
            <el-select style="width:191px;" v-model="queryParams.handleResult" placeholder="请选择处理结果">
              <el-option v-for="item in dict.eventResult" :key="item.value" :label="item.label"
                         :value="parseInt(item.value)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="事件状态" prop="eventStatus">
            <el-select v-model="queryParams.eventStatus" placeholder="事件状态">
              <el-option label="已处理" :value="1" />
              <el-option label="待处理" :value="0" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="上报类型" prop="reportType">
            <el-select style="width:191px;" v-model="queryParams.reportType" placeholder="请选择上报类型">
              <el-option v-for="item in dict.reportType" :key="item.value" :label="item.label"
                         :value="parseInt(item.value)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上报结果" prop="reportResult">
            <el-select style="width:191px;" v-model="queryParams.reportResult" placeholder="请选择上报结果">
              <el-option v-for="item in dict.reportResult" :key="item.value" :label="item.label"
                         :value="parseInt(item.value)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="摄像机名称" prop="deviceName">
            <el-input size='small' v-model='queryParams.deviceName' placeholder='请输入摄像机名称'></el-input>
          </el-form-item>
          <el-form-item label='发现时间'>
            <el-date-picker value-format='timestamp' v-model='dateRange' type='datetimerange' range-separator='至'
                            start-placeholder='开始时间' end-placeholder='结束时间' :default-time="['00:00:00', '23:59:59']" />
          </el-form-item> -->
          <el-form-item class="ml-xl">
            <el-button type="primary" @click="handleQuery">搜 索</el-button>
            <el-button @click="handleClear">清 空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 操作栏 -->
      <div class="g-opera  mt-l">
        <!-- <el-button type="primary" @click="handleEvent()">批量上报城运</el-button> -->
        <el-button type="danger" @click="handleEvent(1,4)">批量判定误报</el-button>
        <el-button type="warning" @click="handleEvent(1,3)">批量判定重复</el-button>
        <el-radio-group class="fr" v-model="queryParams.eventStatus" @change="getList">
          <el-radio-button :label="null">全部</el-radio-button>
          <el-radio-button :label="0">待处理</el-radio-button>
          <el-radio-button :label="1">已处理</el-radio-button>
        </el-radio-group>
      </div>
      <!-- 字段宽度根据具体数据优化 -->
      <!-- 表格 -->
      <div class="g-table">
        <el-table v-loading="loading" border ref="table" :data="tableData" style="width: 100%" @select="handleSelect"
                  @selection-change="handleSelectRow">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="eventNo" align="center" label="事件编号">
          </el-table-column>
          <el-table-column prop="eventName" align="center" label="事件名称">
          </el-table-column>
          <el-table-column prop="eventType" align="center" label="事件类型">
            <template slot-scope="scope">
              <span v-if="scope.row.eventType == 1">人的不安全行为</span>
              <span v-if="scope.row.eventType == 2">物的不安全状态</span>
            </template>
          </el-table-column>
          <el-table-column prop="eventLevel" align="center" label="事件等级" :formatter='eventLevelFormat'>
          </el-table-column>
          <el-table-column prop="algorithmName" align="center" label="算法模型">
          </el-table-column>
          <el-table-column prop="deviceName" align="center" label="目标设备">
          </el-table-column>
          <el-table-column prop="spaceName" align="center" label="所属空间">
          </el-table-column>
          <el-table-column prop="eventStatus" align="center" label="事件状态">
            <template slot-scope="scope">
              <template v-if="scope.row.eventStatus == 0">
                <span class="status_text" style="color: #e6a23c">待处理</span>
              </template>
              <template v-if="scope.row.eventStatus == 1 ">
                <span class="status_text" style="color: #67c23a">已处理</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="handleResult" align="center" label="处理结果" width="80">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.handleResult == 0">待处理</el-tag>
              <el-tag v-if="scope.row.handleResult == 1">待提交</el-tag>
              <el-tag closable v-if="scope.row.handleResult == 3" @close="handleSingleEvent(scope.row.eventId,1,1)"
                      type="warning">重复</el-tag>
              <el-tag closable v-if="scope.row.handleResult == 4" @close="handleSingleEvent(scope.row.eventId,1,1)"
                      type="danger">误报</el-tag>
              <el-tag v-if="scope.row.handleResult == 2" type="success">已提交</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="reportResult" label="上报结果" width="100" :formatter="reportResultFormat">
          </el-table-column>
          <el-table-column prop="urbanOperationAction" label="处置进展" width="100" :formatter="urbanOperationActionFormat">
          </el-table-column> -->
          <el-table-column prop="eventDetectTime" align="center" label="发现时间" width="140">
            <template slot-scope="scope">{{parseTime(scope.row.eventDetectTime)}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleDetails(scope.row)">查看</el-button>
              <el-button :disabled="scope.row.handleResult === 4 || scope.row.reportResult === 2" size="mini"
                         type="text" @click="handleSingleEvent(scope.row.eventId,4,1)">误报
              </el-button>
              <el-button :disabled="scope.row.handleResult === 3 || scope.row.reportResult === 2" size="mini"
                         type="text" @click="handleSingleEvent(scope.row.eventId,3,1)">重复
              </el-button>
              <!-- <el-button :disabled="scope.row.handleResult == 4 || scope.row.handleResult == 3 || scope.row.handleResult == 2"
                         size="mini" type="text"  @click="handleSingleEvent(scope.row.eventId)">
                上报城运</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="g-page-x mt-m">
        <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                    :limit.sync="queryParams.size" @pagination="getList" />
      </div>
    </div>
  </div>
</template>

<script>
import { getEventList, getCount, updateEventStatus, reportEvent } from '@/api/app/event/manual'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        eventLevel: null,
        eventStatus: null,
        handleResult: null,
        eventName: null,
        eventNo: null,
      },
      dateRange: [],
      total: 0,
      tableData: [],
      dict: {},
      loading: false,
      rules: {
        eventName: [this.$formRules.checkLen()],
        eventNo: [this.$formRules.checkLen(32)],
        deviceName: [this.$formRules.checkLen()],
      },
      staticData: {},
      selection: [],
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  mounted() {
    this.getDicts('event_handle_result').then((res) => {
      this.dict.eventResult = res.data.data
    })
    this.getDicts('event_level').then((res) => {
      this.dict.eventLevel = res.data.data
    })
    this.getDicts('report_type').then((res) => {
      this.dict.reportType = res.data.data
    })
    this.getDicts('report_result').then((res) => {
      this.dict.reportResult = res.data.data
    })
    this.getDicts('urban_operation_status').then((res) => {
      this.dict.urbanOperationAction = res.data.data
    })
    this.getList()
    this.getStatic()
  },
  methods: {
    getList() {
      this.loading = true
      this.queryParams.startTime = this.dateRange ? this.dateRange[0] : null
      this.queryParams.endTime = this.dateRange ? this.dateRange[1] : null
      getEventList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    getStatic() {
      getCount().then((res) => {
        this.staticData = res.data.data
      })
    },
    formatEventResult(row) {
      return this.selectDictLabel(this.dict.eventResult, row.handleResult)
    },
    reportResultFormat(row) {
      return this.selectDictLabel(this.dict.reportResult, row.reportResult)
    },
    urbanOperationActionFormat(row) {
      return this.selectDictLabel(this.dict.urbanOperationAction, row.urbanOperationAction)
    },
    handleAdd() {
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      this.formOptions.data.id = row.spaceId
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
      this.dateRange = []
      this.queryParams.startTime = null
      this.queryParams.endTime = null
      this.resetForm('queryParams')
      this.getList()
    },
    handleSelectRow(list) {
      this.selection = list
    },
    handleSelect(selection, row) {
      if (row.reportResult === 2) {
        this.$refs.table.toggleRowSelection(row, false)
        return this.msgWarn('已上报事件无法批量处理')
      }
    },
    handleSingleEvent(id, handleResult, eventStatus) {
      // if (!eventStatus) {
      //   if (!this.permissions.event_manual_report) return this.msgWarn('权限不足')
      // }
      // if (eventStatus == 1 && handleResult == 4) {
      //   if (!this.permissions.event_manual_false) return this.msgWarn('权限不足')
      // }
      // if (eventStatus == 1 && handleResult == 3) {
      //   if (!this.permissions.event_manual_repeat) return this.msgWarn('权限不足')
      // }
      const data = {
        eventStatus,
        handleResult,
        ids: [id],
      }
      if (!handleResult) {
        reportEvent(data).then((res) => {
          if (res.data.data) {
            this.msgSuccess('上报成功')
            this.getList()
            this.getStatic()
          }
        })
      } else {
        updateEventStatus(data).then((res) => {
          if (res.data.data) {
            this.msgSuccess('操作成功')
            this.getList()
            this.getStatic()
          }
        })
      }
    },
    handleEvent(eventStatus, handleResult) {
      // if (!eventStatus) {
      //   if (!this.permissions.event_manual_report) return this.msgWarn('权限不足')
      // }
      // if (eventStatus == 1 && handleResult == 4) {
      //   if (!this.permissions.event_manual_false) return this.msgWarn('权限不足')
      // }
      // if (eventStatus == 1 && handleResult == 3) {
      //   if (!this.permissions.event_manual_repeat) return this.msgWarn('权限不足')
      // }

      if (this.selection.length === 0) return this.msgWarn('请至少选择一条事件')
      const ids = this.selection.map((item) => {
        return item.eventId
      })
      const data = {
        eventStatus,
        handleResult,
        ids,
      }
      if (!handleResult) {
        reportEvent({ ids }).then((res) => {
          if (res.data.data) {
            this.msgSuccess('批量上报成功')
            this.getList()
            this.getStatic()
          }
        })
      } else {
        updateEventStatus(data).then((res) => {
          if (res.data.data) {
            this.msgSuccess('批量判定成功')
            this.getList()
            this.getStatic()
          }
        })
      }
    },
    handleDetails(row) {
      // if (!this.permissions.event_manual_view) return this.msgWarn('权限不足')
      const id = row.eventId
      this.$router.push({
        path: '/app/event/manual/info/index/',
        query: {
          id: id,
        },
      })
    },
    eventLevelFormat(row) {
      return this.selectDictLabel(this.dict.eventLevel, row.eventLevel)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
$vw: 100vw/1920;
.chartKJSXTLXXXZB,
.chartZNSBQK,
.chartGSDZYSL {
  height: 260 * $vw;
}
div[class*='chart'] {
  margin: 12 * $vw;
}
div[class*='chart']:empty {
  background: #eee;
}

.count-x {
  display: flex;
  margin-right: -12 * $vw;
  .c1 {
    background: linear-gradient(to right, #4ccaea, #14a3ff);
  }
  .c2 {
    background: linear-gradient(to right, #3deaaf, #18d0aa);
  }
  .c3 {
    background: linear-gradient(to right, #f1c236, #ffa833);
  }
  dl,
  dt,
  dd {
    margin: 0;
  }
  .cell {
    border-radius: 10 * $vw;
    flex: 1;
    margin-right: 12 * $vw;
    margin-top: 12 * $vw;
    padding: 20 * $vw 20 * $vw;
    display: flex;
    align-items: center;
    color: white;
    .icon {
      margin-right: 18 * $vw;
      width: 82 * $vw;
      height: 82 * $vw;
    }
    dd {
      font-size: 38 * $vw;
      line-height: 1;
    }
    dt {
      font-size: 20 * $vw;
    }
  }
}
</style>
