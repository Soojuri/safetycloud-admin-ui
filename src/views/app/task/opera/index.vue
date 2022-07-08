<template>
  <div class="sub-page">
    <div class="row">
      <div class="col left">
        <div class="tit">作业数据</div>
        <div class="chartZYSJ" v-if="!isClose">
          <pie-chart :data="pieData" v-if="!isClose"></pie-chart>
        </div>
      </div>
      <div class="col right">
        <div class="tit">
          <span class="cell-btw">
            操作流程
            <el-button v-if="!isClose" size="mini" icon="el-icon-arrow-up" @click="isClose=true"></el-button>
            <el-button v-else size="mini" icon="el-icon-arrow-down" @click="isClose=false"></el-button>
          </span>
        </div>
        <div class="step-box ml-xl" v-if="!isClose">
          <div class="cell">
            <div class="icon">
              <img :src="require('@/assets/images/task-manage/icon-1.png')" />
            </div>
            <p>填写任务作业信息，选择视频分析算法能力包</p>
          </div>
          <div class="cell">
            <div class="icon">
              <img :src="require('@/assets/images/task-manage/icon-2.png')" />
            </div>
            <p>选择视频分析输入数据来源、算法模板配置和算法结果输出配置方式等</p>
          </div>
          <div class="cell">
            <div class="icon">
              <img :src="require('@/assets/images/task-manage/icon-3.png')" />
            </div>
            <p>完成配置后，单击“立即创建”，可查看该作业的详细信息</p>
          </div>
        </div>
      </div>
    </div>
    <div class="g-card mt-m">
      <div>
        <el-form ref="queryParams" :model="queryParams" inline label-width="100px">
          <el-form-item label="作业ID" prop="taskId" :rules="[$formRules.checkLen(50)]">
            <el-input v-model="queryParams.taskId" placeholder="请输入作业ID"></el-input>
          </el-form-item>
          <el-form-item label='作业名称' prop='taskName'>
            <el-input size='small' v-model='queryParams.taskName' placeholder='请输入作业名称'></el-input>
          </el-form-item>
          <el-form-item label="作业状态" prop="status">
            <el-select style="width:191px;" v-model="queryParams.status" placeholder="请选择状态">
              <el-option v-for="item in dict.taskStatus" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="算法类别" prop="algorithmType">
            <el-select style="width:191px;" v-model="queryParams.algorithmType" placeholder="请选择算法类别">
              <el-option v-for="item in dict.algorithmType" :key="item.value" :label="item.label"
                         :value="parseInt(item.value)">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='算法模型' prop='algorithmId'>
            <el-select style="width:191px;" v-model="queryParams.algorithmId" placeholder="请选择算法模型">
              <el-option v-for="item in dict.algorithmList" :key="item.algorithmId" :label="item.algorithmName"
                         :value="item.algorithmId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='摄像机名称' prop='deviceName'>
            <el-input size='small' v-model='queryParams.deviceName' placeholder='请输入摄像机名称'></el-input>
          </el-form-item>
          <el-form-item label='省份' prop='province'>
            <el-select style="width:191px;" v-model="queryParams.province" placeholder="请选择省份"
                       @change="handleSelProvince">
              <el-option v-for="item in areaList.filter(item => item.pid == -1)" :key="item.id" :label="item.name"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='城市' prop='city'>
            <el-select style="width:191px;" v-model="queryParams.city" placeholder="请选择城市" @change="handleSelCity">
              <el-option v-for="item in areaList.filter(item => item.pid == queryParams.province)" :key="item.id"
                         :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="区县" pro="county">
            <el-select style="width:191px;" v-model="queryParams.county" placeholder="请选择区县" @change="handleSelCounty">
              <el-option v-for="item in areaList.filter(item => item.pid == queryParams.city)" :key="item.id"
                         :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='街道' prop='subdistrict'>
            <el-select style="width:191px;" v-model="queryParams.subdistrict" placeholder="请选择街道">
              <el-option v-for="item in subdistrictList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='具体地址' prop='address'>
            <el-input size='small' v-model='queryParams.address' placeholder='请输入详细地址'></el-input>
          </el-form-item>
          <el-form-item label='日期选择'>
            <el-date-picker value-format='timestamp' v-model='dateRange' type='datetimerange' range-separator='至'
                            start-placeholder='开始时间' end-placeholder='结束时间' :default-time="['00:00:00', '23:59:59']" />
          </el-form-item>
          <el-form-item class="ml-xl">
            <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
            <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="g-opera">
        <el-button type="primary" @click="handleAdd">新增作业</el-button>
        <el-button type="success" class="mb-m" size="small" @click="handleOperaBatch('enable')">批量启用</el-button>
        <el-button type="warning" class="mb-m" size="small" @click="handleOperaBatch('disable')">批量禁用</el-button>
        <el-button type="primary" plain class="mb-m" size="small" @click="handleOperaBatch('start')">批量启动</el-button>
        <el-button type="info" plain class="mb-m" size="small" @click="handleOperaBatch('stop')">批量停止</el-button>
        <el-button type="danger" plain class="mb-m" size="small" @click="handleOperaBatch('del')">批量删除</el-button>
        <!-- <el-button type="primary" @click="handleAdd">新 增</el-button> -->
      </div>
      <right-toolbar :columns="columns" @queryTable="getList">
        <template slot="btn">
          <el-tooltip class="item" effect="dark" :content="tableType? '卡片模式':'列表模式'" placement="top">
            <el-button size="mini" circle icon="el-icon-s-operation" @click="toggleTableType()" />
          </el-tooltip>
        </template>
      </right-toolbar>
      <div class="rule-list" v-loading="loading" v-if="!tableType">
        <div class="cell" v-for="(item , index) in tableData" :key="index">
          <template v-if="resultList.length > 0">
            <el-alert v-if="handleFindResult(item.taskId).result == 'true'" title="操作成功" type="success" show-icon>
            </el-alert>
            <el-alert v-else :title="handleFindResult(item.taskId).result" type="error" show-icon>
            </el-alert>
          </template>
          <div class="tit">
            <div class="checked">
              <el-checkbox v-model="item.checked" />
            </div>
            <!-- 图标用拼音首字母 每个类型有对应图标 -->
            <img class="icon" :src="require('@/assets/images/task-manage/icon-grdzjc.png')" />
            <label style="color:#2975ff;cursor:pointer" @click="handleDetails(item.taskId)">{{item.taskName}}</label>
            <el-switch v-model="item.enableStatus" :active-value="1" :inactive-value="0"
                       @change="handleOperaTask(item)"></el-switch>
          </div>
          <div class="info">
            <dl>
              <dt>状态</dt>
              <dd class="">{{formatStatus(item)}}</dd>
            </dl>
            <dl>
              <dt>发现事件</dt>
              <dd><b>{{item.eventCount ? item.eventCount : 0}}</b></dd>
            </dl>
          </div>
          <div class="opera">
            <div class="start blue" @click="handleStart(item)"></div>
            <div class="stop red" @click="handleStop(item)"></div>
            <div class="edit" @click="handleEdit(item)"></div>
            <div class="del" @click="handleDel(item)"></div>
          </div>
        </div>

      </div>

      <div class="g-table" v-if="tableType">
        <el-table v-loading="loading" border :data="tableData" style="width:100%" @selection-change="handleSelectTable">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="操作结果" v-if="resultList.length > 0">
            <template slot-scope="scope">
              <el-tag v-if="handleFindResult(scope.row.taskId).result == 'true'" type="success">操作成功</el-tag>
              <el-tag v-else type="warning">{{handleFindResult(scope.row.taskId).result}}</el-tag>

            </template>
          </el-table-column>
          <el-table-column label="作业ID" v-if="columns[0].visible">
            <template slot-scope="scope">
              <span>
                {{scope.row.taskId}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="taskName" label="作业名称" v-if="columns[1].visible">
            <template slot-scope="scope">
              <label style="color:#2975ff;cursor:pointer"
                     @click="handleDetails(scope.row.taskId)">{{scope.row.taskName}}</label>
            </template>
          </el-table-column>
          <el-table-column prop="algorithmName" label="算法模型" />
          <el-table-column prop="algorithmType" label="算法类别" :formatter="formatType" v-if="columns[14].visible" />
          <el-table-column prop="province" label="省份" v-if="columns[8].visible" />
          <el-table-column prop="city" label="城市" v-if="columns[9].visible" />
          <el-table-column prop="county" label="区县" v-if="columns[10].visible" />
          <el-table-column prop="subdistrict" label="街道" v-if="columns[11].visible" />
          <el-table-column prop="address" label="具体地址" v-if="columns[13].visible" />
          <el-table-column prop="deviceName" label="摄像头名称" v-if="columns[12].visible" />
          <el-table-column prop="eventCount" label="识别事件数" v-if="columns[3].visible" />
          <el-table-column prop="status" label="作业状态" v-if="columns[4].status" :formatter="formatStatus">
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" v-if="columns[5].visible">
            <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
          </el-table-column>
          <el-table-column prop="enableStatus" label="启用状态" v-if="columns[6].visible">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enableStatus" :active-value="1" :inactive-value="0"
                         @change="handleOperaTask(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" v-if="columns[7].visible">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-check" @click="handleStart(scope.row)">启动</el-button>
              <el-button type="text" icon="el-icon-switch-button" @click="handleStop(scope.row)">停止</el-button>
              <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" icon="el-icon-delete" @click="handleDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="g-page-x mt-m">
        <pagination :pageSizes="[8,16,40,80]" :total="total" :page.sync="queryParams.current"
                    :limit.sync="queryParams.size" @pagination="getList" />
      </div>
    </div>
    <!-- 弹窗 -->
    <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
              @ok="getList()">
    </pop-form>
  </div>
</template>

<script>
import { getTaskList, startTask, stopTask, delTask, enableTask, disableTask, getTaskStatic } from '@/api/app/task/opera'
import { getAreaListByPid } from '@/api/app/camera/space'
import { getManageList } from '@/api/app/algorithm/manage.js'
import RightToolbar from '@/components/RightToolbar/index.vue'
import PieChart from './pie.vue'
import PopForm from './popForm.vue'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm, PieChart, RightToolbar },
  data() {
    return {
      pieData: [],
      queryParams: {
        size: 8,
        current: 1,
        taskId: null,
        taskName: null,
        status: null,
        algorithmType: null,
        algorithmId: null,
        deviceName: null,
        city: null,
        county: null,
        province: null,
        subdistrict: null,
      },
      areaList: [],
      total: 0,
      tableData: [],
      dateRange: [],
      list: [],
      dict: {
        taskStatus: [],
        algorithmType: [],
        algorithmList: [],
        week: [],
        eventLevel: [],
      },
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
      checked: false,
      disabled: false,
      resultList: [],
      isClose: false,
      columns: [
        { key: 0, label: `作业ID`, visible: false },
        { key: 1, label: `作业名称`, visible: true },
        { key: 2, label: `算法模型`, visible: true },
        { key: 3, label: `识别事件数`, visible: true },
        { key: 4, label: `作业状态`, visible: true },
        { key: 5, label: `创建时间`, visible: true },
        { key: 6, label: `启用状态`, visible: true },
        { key: 7, label: `操作`, visible: true },
        { key: 8, label: `省份`, visible: true },
        { key: 9, label: `市区`, visible: true },
        { key: 10, label: `县市`, visible: true },
        { key: 11, label: `街道`, visible: false },
        { key: 12, label: `摄像头名称`, visible: true },
        { key: 13, label: `具体地址`, visible: false },
        { key: 14, label: `算法类别`, visible: false },
      ],
      tableType: false,
      selectList: [],
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  mounted() {
    this.getDicts('task_status').then((res) => {
      this.dict.taskStatus = res.data.data
    })
    this.getDicts('algorithm_type').then((res) => {
      this.dict.algorithmType = res.data.data
    })
    getManageList({ size: 1000, current: 1 }).then((res) => {
      this.dict.algorithmList = res.data.data.records
    })
    this.getDicts('week_list').then((res) => {
      this.dict.week = res.data.data
    })
    getAreaListByPid({ pid: '' }).then((res) => {
      this.areaList = res.data.data
    })
    this.getDicts('event_level').then((res) => {
      this.dict.eventLevel = res.data.data
    })
    this.getList()
  },
  methods: {
    getList() {
      const that = this
      that.loading = true
      that.queryParams.startTime = that.dateRange ? that.dateRange[0] : null
      that.queryParams.endTime = that.dateRange ? that.dateRange[1] : null
      getTaskStatic().then((res) => {
        that.pieData = res.data.data
      })
      getTaskList(that.queryParams)
        .then((res) => {
          that.tableData = []
          that.loading = false
          res.data.data.records.forEach((item) => {
            let info = item
            info.checked = false
            info.msg = null
            that.tableData.push(info)
          })
          that.total = res.data.data.total
        })
        .catch(() => {
          that.loading = false
        })
    },
    formatStatus(row) {
      return this.selectDictLabel(this.dict.taskStatus, row.status)
    },
    handleAdd() {
      if (!this.permissions.task_opera_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      if (!this.permissions.task_opera_edit) return this.msgWarn('权限不足')
      if (row.status === 1 || row.status === 2) return this.msgWarn('运行中无法进行编辑操作')
      this.formOptions.data.id = row.taskId
      this.formOptions.visible = true
    },
    handleDel(item) {
      if (!this.permissions.task_opera_delete) return this.msgWarn('权限不足')
      if (item.status === 1 || item.status === 2) return this.msgWarn('运行中无法进行删除操作')
      this.$confirm(`是否确认删除作业-${item.taskName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delTask(item.taskId)
        })
        .then((res) => {
          if (res.data.data) {
            that.handleCurrentPageCalculateByDelete()
            this.msgSuccess('删除成功')
            this.getList()
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
      this.resetForm('queryParams')
      this.getList()
    },
    handleChangeStatus(row) {
      this.loading = true
      const spaceId = row.spaceId
      const status = row.status == 0 ? 1 : 0
      putSpace({ spaceId, status })
        .then((res) => {
          this.loading = false
          if (res.data.data) {
            this.msgSuccess(`${status == 1 ? '启用成功' : '停用成功'}`)
            this.getList()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDetails(id) {
      if (!this.permissions.task_opera_view) return this.msgWarn('权限不足')
      this.$router.push({
        path: '/app/task/opera/info/index/',
        query: {
          id,
        },
      })
    },
    toggleTableType() {
      this.tableType = !this.tableType
    },
    handleStop(row) {
      if (!this.permissions.task_opera_stop) return this.msgWarn('权限不足')
      if (row.enableStatus === 0) return this.msgWarn('禁用状态下无法做停止操作')
      this.loading = true
      stopTask(row.taskId)
        .then((res) => {
          this.loading = false
          if (res.data.code == 0) {
            this.msgSuccess('停止成功')
            this.getList()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleStart(row) {
      if (!this.permissions.task_opera_start) return this.msgWarn('权限不足')
      if (row.enableStatus === 0) return this.msgWarn('禁用状态下无法做启动操作')
      this.loading = true
      startTask(row.taskId)
        .then((res) => {
          this.loading = false
          if (res.data.code == 0) {
            this.msgSuccess('启动成功')
            this.getList()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 启用禁用
    handleOperaTask(row) {
      if (!this.permissions.task_opera_enable) return this.msgWarn('权限不足')
      this.loading = true
      const id = row.taskId
      const status = row.enableStatus
      if (status === 0) {
        disableTask(id)
          .then((res) => {
            this.loading = false
            if (res.data.data) {
              this.msgSuccess('禁用成功')
              this.getList()
            }
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        enableTask(id)
          .then((res) => {
            this.loading = false
            if (res.data.data) {
              this.msgSuccess('启用成功')
              this.getList()
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 批量操作
    handleOperaBatch(opera) {
      let tit = ''
      if (opera === 'enable') {
        if (!this.permissions.task_opera_pienable) return this.msgWarn('权限不足')
        tit = '启用'
      }
      if (opera === 'disable') {
        if (!this.permissions.task_opera_pidisable) return this.msgWarn('权限不足')
        tit = '禁用'
      }
      if (opera === 'start') {
        if (!this.permissions.task_opera_pistart) return this.msgWarn('权限不足')
        tit = '启动'
      }
      if (opera === 'stop') {
        if (!this.permissions.task_opera_pistop) return this.msgWarn('权限不足')
        tit = '停止'
      }
      if (opera === 'del') {
        if (!this.permissions.task_opera_pidel) return this.msgWarn('权限不足')
        tit = '删除'
      }
      let checkedList = []
      if (this.tableType) {
        checkedList = this.selectList
      } else {
        checkedList = this.tableData.filter((item) => item.checked === true)
      }
      if (checkedList.length === 0) return this.msgWarn('请先选择操作作业')
      this.$confirm('是否确认批量' + tit + '作业', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const promises = checkedList.map(async (item) => {
          const id = item.taskId
          let res = null
          let msg = 'true'
          if (opera === 'enable') {
            res = await enableTask(id)
          } else if (opera === 'disable') {
            res = await disableTask(id)
          } else if (opera === 'start') {
            if (!item.enableStatus) {
              msg = '禁用作业无法进行启动操作'
            } else {
              res = await startTask(id)
            }
          } else if (opera === 'stop') {
            if (!item.enableStatus) {
              msg = '禁用作业无法进行停止操作'
            } else {
              res = await stopTask(id)
            }
          } else if (opera === 'del') {
            res = await delTask(id)
          }
          if (res && res.data.data !== true) {
            msg = '操作失败'
          }
          return {
            id,
            name: item.taskName,
            result: msg,
          }
        })
        this.resultList = await Promise.all(promises)
        this.getList()
      })
    },
    handleSelectTable(val) {
      this.selectList = val
    },
    handleFindResult(id) {
      return this.resultList.find((item) => item.id === id)
    },
    handleSelProvince() {
      this.queryParams.city = null
      this.queryParams.county = null
      this.queryParams.subdistrict = null
    },
    handleSelCity() {
      this.queryParams.county = null
      this.queryParams.subdistrict = null
    },
    handleSelCounty(pid) {
      this.queryParams.subdistrict = null
      getAreaListByPid({ pid }).then((res) => {
        this.subdistrictList = res.data.data
      })
    },
    formatType(row) {
      return this.selectDictLabel(this.dict.algorithmType, row.algorithmType)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
$vw: 100vw/1920;
.chartZYSJ {
  height: 280px;
  min-width: 400px;
}
div[class*='chart'] {
  margin-top: 12px;
}
div[class*='chart']:empty {
  background: #eee;
}
.row {
  display: flex;
  max-height: 350px;
  .col {
    padding: 16px;
    background: white;
    border-radius: 3px;
    &.left {
      flex: 3;
    }
    &.right {
      border-left: 1px #ccc dashed;
      flex: 4;
      // margin-left: 12px;
    }
  }
  .tit {
    font-size: 18px;
    display: flex;
    align-items: flex-start;
    position: relative;
    &::before {
      content: '';
      height: 20px;
      width: 4px;
      border-radius: 2px;
      background: $--color-primary;
      display: inline-block;
      margin-right: 8px;
      vertical-align: top;
      margin-top: 3px;
    }
  }
}
// .checked {
//   position: absolute;
//   left: 0;
//   transform: translate(-50%, -50%);
// }
.step-box {
  display: flex;
  .cell {
    padding-top: 40px;
    flex: 1;
    margin-right: 25px;
    p {
      margin-top: 20px;
      line-height: 2;
      font-size: 16 * $vw;
      color: #8b8c8f;
      text-align: justify;
    }
    .icon {
      position: relative;
      display: flex;
      align-items: center;
      &:after {
        content: '';
        display: block;
        flex: 1;
        height: 16px;
        margin-left: 10px;
        background: url(../../../../assets/images/task-manage/arrow.png) no-repeat;
        background-size: 100% 100%;
      }
    }
    &:last-child .icon:after {
      display: none;
    }
  }
}
.sub-page {
  min-height: 100%;
  display: flex;
  font-size: 16 * $vw;
  flex-direction: column;
  align-items: stretch;
  // background-color: white;
  // margin: 0 12*$vw;
}
.rule-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6px;
  margin-top: 12px;
  .cell {
    box-sizing: border-box;
    width: calc(25% - 12px);
    margin: 6px;
    border: solid 1px #e8ecee;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s;
    background: white;
    &:hover {
      cursor: pointer;
      transform: translateY(-3px);
      box-shadow: 0 0 15px rgba($color: #000000, $alpha: 0.1);
    }
  }
  .add {
    min-height: 196px;
    padding: 12px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: calc(25% - 12px);
    margin: 6px;
    border: dashed 1px #e8ecee;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s;
    &:hover {
      cursor: pointer;
      transform: translateY(-3px);
      box-shadow: 0 0 15px rgba($color: #000000, $alpha: 0.1);
    }
    &::before {
      content: '\E916';
      font-family: c-icon-font, sans-serif;
      margin-right: 12px;
    }
  }
  .tit {
    padding: 12px 16px;
    display: flex;
    font-size: 18px;
    border-bottom: solid 1px #e8ecee;
    align-items: center;
    .icon {
      flex-shrink: 0;
      margin-right: 16px;
      width: 50px;
      height: 50px;
    }
    label {
      color: #333;
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
      margin-right: 10px;
    }
    span {
      font-size: 16px;
      color: #999999;
    }
  }
  p {
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    margin: 12px 12px;
    color: #888;
    font-size: 14px;
    height: 38px;
  }
  .info {
    display: flex;
    dl,
    dd,
    dt {
      margin: 0;
    }
    dl {
      flex: 1;
      flex-shrink: 0;
      padding: 12px;
    }
    dt {
      font-size: 14px;
      color: #8b8c8f;
    }
    dd {
      font-size: 16px;
      line-height: 1.5;
    }
  }
  .opera {
    position: relative;
    border-top: solid 1px #e8ecee;
    display: flex;
    justify-content: space-around;
    background: #f5f9ff;
    align-items: center;
    & > div {
      position: relative;
      flex: 1;
      text-align: center;
    }
    & > div::after {
      width: 1px;
      top: 50%;
      content: '';
      position: absolute;
      right: 0;
      background: #e8ecee;
      height: 18px;
      margin-top: -9px;
    }
    & > div:last-child:after {
      display: none;
    }
    .edit {
      cursor: pointer;
      padding: 12px;
      color: #8b8c8f;
      font-size: 22px;
      &::before {
        content: '\e919';
        font-family: c-icon-font, sans-serif;
        margin-right: 4px;
        vertical-align: -2px;
      }
    }
    .del {
      cursor: pointer;
      padding: 12px;
      color: #8b8c8f;
      font-size: 22px;
      &::before {
        content: '\e93e';
        font-family: c-icon-font, sans-serif;
        margin-right: 4px;
        vertical-align: -2px;
      }
    }
    .start {
      cursor: pointer;
      padding: 12px;
      font-size: 22px;
      &::before {
        content: '\e93f';
        font-family: c-icon-font, sans-serif;
        margin-left: 4px;
        vertical-align: -2px;
      }
    }
    .stop {
      cursor: pointer;
      padding: 12px;
      font-size: 22px;
      &:before {
        content: '\e940';
        font-family: c-icon-font, sans-serif;
        margin-left: 4px;
        vertical-align: -2px;
      }
    }
    .link {
      cursor: pointer;
      padding: 12px;
      color: $--color-primary;
      &:after {
        content: '\e932';
        font-family: c-icon-font, sans-serif;
        font-size: 14px;
        margin-left: 4px;
        vertical-align: -2px;
      }
    }
  }
}
.cell-btw {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
