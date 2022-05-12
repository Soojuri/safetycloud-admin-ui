<template>
  <div class="sub-page">
    <div class="count-x">
      <div class="cell c1">
        <i class="icon-tips"></i>
        <div class="info">
          <img class="icon" :src="require('@/assets/images/home/icon-jrsxtzs.png')" />
          <dl>
            <dd>{{formatNumber(cameraInfo.allCount)}}</dd>
            <dt>接入摄像头总数</dt>
          </dl>
        </div>
        <div class="footer">
          <span>当前作业摄像头<b>{{formatNumber(cameraInfo.workingCount)}}</b></span>
          <span>占比<b>{{getPercent(cameraInfo.workingCount,cameraInfo.allCount)}}%</b></span>
        </div>
      </div>
      <div class="cell c2">
        <i class="icon-tips"></i>
        <div class="info">
          <img class="icon" :src="require('@/assets/images/home/icon-zxsxts.png')" />
          <dl>
            <dd>{{cameraInfo.onlineCount}}</dd>
            <dt>在线摄像头数</dt>
          </dl>
        </div>
        <div class="footer">
          <span>在线摄像头占比<b>{{getPercent(cameraInfo.onlineCount,cameraInfo.allCount)}}%</b></span>
        </div>
      </div>
      <div class="cell c3">
        <i class="icon-tips"></i>
        <div class="info">
          <img class="icon" :src="require('@/assets/images/home/icon-lxsxts.png')" />
          <dl>
            <dd>{{cameraInfo.offlineCount}}</dd>
            <dt>离线摄像头数</dt>
          </dl>
        </div>
        <div class="footer" @click="goCameraList()">
          <span class="is-link">查看详情</span>
        </div>
      </div>
      <div class="cell c4">
        <i class="icon-tips"></i>
        <div class="info">
          <img class="icon" :src="require('@/assets/images/home/icon-zyzsxts.png')" />
          <dl>
            <dd>{{cameraInfo.taskAllCount}}</dd>
            <dt>任务作业总数</dt>
          </dl>
        </div>
        <div class="footer">
          <span>当前运行作业<b>{{cameraInfo.taskRunCount}}</b></span>
          <span>占比<b>{{getPercent(cameraInfo.taskRunCount,cameraInfo.taskAllCount)}}%</b></span>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="card flex2">
        <div class="card-tit">算力资源情况</div>
        <div class="countSLZYQK">

          <div class="cell c1">
            <div class="top">
              <img class="icon" :src="require('@/assets/images/home/icon-cpuzs.png')" />
              <dl>
                <dt>CPU总数</dt>
                <dd>{{computedInfo.cpu}}</dd>
              </dl>
            </div>
          </div>
          <div class="cell c2">
            <div class="top">
              <img class="icon" :src="require('@/assets/images/home/icon-gpuzs.png')" />
              <dl>
                <dt>GPU总数</dt>
                <dd>{{computedInfo.gpu}}</dd>
              </dl>
            </div>
          </div>
          <div class="cell c3">
            <div class="top">
              <img class="icon" :src="require('@/assets/images/home/icon-nczs.png')" />
              <dl>
                <dt>内存总数</dt>
                <dd>{{computedInfo.memory}}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="card-tit ">
          <span>算法能力介绍</span>
          <span class="fr link" @click="$router.push('/app/algorithm/manage/index')">查看全部</span>
        </div>
        <div class="listSFNLJS">
          <div class="cell" v-for="item in algoList">
            <div class="state green" v-if="item.enable == 1">启用</div>
            <div class="state orange" v-if="item.enable == 0">未启用</div>
            <div class="tit">
              <img class="icon" :src="item.logoUrl" />
              <label>{{item.algorithmName}}</label>
            </div>
            <p>{{item.remark}}</p>
            <div class="count">
              <span>事件总数<b class="blue">{{item.eventCount}}</b></span>
              <span>调用总数<b class="blue">{{item.callCount}}</b></span>
            </div>
            <div class="operate">
              <div class="type">{{selectDictLabel(algorithmType,item.algorithmType)}}
              </div>
              <div class="link" @click="handleAlgorithmDetails(item)">查看详情
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="card flex1">
        <div class="card-tit">
          <span>消息动态</span>
          <span class="fr link" @click="goAll">查看全部</span>
        </div>
        <div class="tab-radio">
          <div @click="type = 1" :class="type ==1 ? 'item active' : 'item'">
            <i class="cus-icon-case"></i>
            任务事件
            <i class="dot" v-if="event_unReadCount>0">{{event_unReadCount > 99 ? '99+' : event_unReadCount}}</i>
          </div>
          <div @click="type = 2" :class="type ==2 ? 'item active' : 'item'">
            <i class="cus-icon-outline"></i>
            离线告警
            <i class="dot">{{log_unReadCount > 99 ? '99+' : log_unReadCount}}</i>
          </div>
        </div>
        <div class="msg-list" v-show="type === 1">
          <div v-infinite-scroll="getEventList" style="height: 100%;" infinite-scroll-delay="100"
               infinite-scroll-distance="10" infinite-scroll-immediate="false"
               infinite-scroll-disabled="event_disabled">
            <div class="cell" v-for="item in eventList">
              <img class=" icon" :src="require('@/assets/images/home/icon-sj.png')" />
              <div class="info">
                <p>{{item.address}} 发生了<b>{{item.eventName}}</b>事件</p>
                <div class="eventTime">{{parseTime(item.eventDetectTime)}}&nbsp;&nbsp;</div>
                <el-tag type="info" v-if="item.readStatus == 1">已读</el-tag>
                <el-tag type="danger" v-if="item.readStatus == 0">未读</el-tag>
                <div class="link" @click="handleEventDetails(item)">
                  &nbsp;&nbsp;查看详情
                </div>
              </div>
            </div>
            <p v-if="event_loading" class="loading-text">加载中...</p>
            <p v-if="event_noMore" class="loading-text">没有更多了</p>
          </div>
        </div>
        <div class="msg-list" v-show="type === 2">
          <div v-infinite-scroll="getLogList" style="height: 100%;" infinite-scroll-delay="100"
               infinite-scroll-immediate="false" infinite-scroll-disabled="log_disabled">
            <div class="cell" v-for="item in deviceList">
              <img class="icon" :src="require('@/assets/images/home/icon-gj.png')" />
              <div class="info">
                <p>{{item.deviceName}}</b>，在{{item.address}}发生了<b>{{item.content}}</b>事件</p>
                <div class="eventTime">{{parseTime(item.createTime)}}&nbsp;</div>
                <el-tag type="info" v-if="item.readStatus == 1">已读</el-tag>
                <el-tag type="danger" v-if="item.readStatus == 0">未读</el-tag>
                <div class="link" @click="handleDetails(item)">&nbsp;&nbsp;查看详情</div>
              </div>
            </div>
            <p v-if="log_loading" class="loading-text">加载中...</p>
            <p v-if="log_noMore" class="loading-text">没有更多了</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="card flex2">
        <div class="card-tit">
          <span>各时段作业数量统计</span>
          <span class="fr">
            <el-radio-group v-model="timeTaskType" size="mini" @change="getTaskDataList">
              <el-radio-button :label="0">本日</el-radio-button>
              <el-radio-button :label="1">本周</el-radio-button>
              <el-radio-button :label="2">本月</el-radio-button>
              <el-radio-button :label="3">本年</el-radio-button>
            </el-radio-group>
            <el-date-picker size="mini" value-format='timestamp' v-model='taskDateRange' type='daterange'
                            range-separator='至' start-placeholder='开始时间' end-placeholder='结束时间'
                            @change="handleTaskChangeTime" />

          </span>
        </div>
        <div class="chartGSDZYSL">
          <task-static v-if="taskStaticList.length> 0" :msgList="taskStaticList"></task-static>
          <el-empty image-size="100" v-else description="暂无数据"></el-empty>
          <!-- 此处放图表 -->
        </div>
      </div>
      <div class="card flex1">
        <div class="card-tit">区域任务作业数排名</div>
        <table class="tableQYRWZYSPH" v-if="areaList.length > 0">
          <tr v-for="item in areaList" v-if="item">
            <td>{{item.index}}</td>
            <td>{{item.name}}</td>
            <td>{{item.num}}</td>
          </tr>
        </table>
        <el-empty image-size="100" v-else description="暂无数据"></el-empty>
      </div>
    </div>
    <div class="row">
      <div class="card flex2">
        <div class="card-tit">
          <span>智能识别情况</span>
          <span class="fr">
            <el-radio-group v-model="timeType" size="mini" @change="getDataList">
              <el-radio-button :label="0">本日</el-radio-button>
              <el-radio-button :label="1">本周</el-radio-button>
              <el-radio-button :label="2">本月</el-radio-button>
              <el-radio-button :label="3">本年</el-radio-button>
            </el-radio-group>
            <el-date-picker size="mini" value-format='timestamp' v-model='dateRange' type='daterange'
                            range-separator='至' start-placeholder='开始时间' end-placeholder='结束时间'
                            @change="handleChangeTime" />

          </span>
        </div>
        <div class="chartZNSBQK">
          <!-- 此处放图表 -->
          <intelligent-recognition v-if="IntelligentRecognition.length > 0" :data="IntelligentRecognition">
          </intelligent-recognition>
          <el-empty image-size="100" v-else description="暂无数据"></el-empty>
        </div>
      </div>
      <div class="card flex1">
        <div class="card-tit">空间摄像头离线消息占比</div>
        <div class="chartKJSXTLXXXZB">
          <!-- 此处放图表 -->
          <pie :dataList="spaceRateList" v-if="spaceRateList.length > 0"></pie>
          <el-empty image-size="100" v-else description="暂无数据"></el-empty>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <pop-form v-if="formOptions.visible" :visible.sync="formOptions.visible" :data="formOptions.data"
              @ok="refreshLogList">
    </pop-form>
    <!-- 新用户强制修改密码弹窗 -->
    <el-dialog title="修改密码" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
               :visible.sync="visible" width="width">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="原密码" prop="password">
          <el-input :type="passwordType" v-model="ruleForm.password" auto-complete="off">
            <i slot="suffix" class="el-icon-view el-input__icon"
               @click="passwordType == '' ? (passwordType = 'password') : (passwordType = '')" />
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpassword1">
          <el-input :type="passwordType1" v-model="ruleForm.newpassword1" auto-complete="off">
            <i slot="suffix" class="el-icon-view el-input__icon"
               @click="passwordType1 == '' ? (passwordType1 = 'password') : (passwordType1 = '')" />
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newpassword2">
          <el-input :type="passwordType2" v-model="ruleForm.newpassword2" auto-complete="off">
            <i slot="suffix" class="el-icon-view el-input__icon"
               @click="passwordType2 == '' ? (passwordType2 = 'password') : (passwordType2 = '')" />
          </el-input>
        </el-form-item>
      </el-form>
      <div slot='footer' class="dialog-footer">
        <el-button type="primary" @click="submitForm()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
import {
  getCamera,
  getAreaRank,
  getTaskStatic,
  getComputingResources,
  getIntelligentRecognition,
  getAlgoStatic,
} from '@/api/app/home/index'
import { getSpaceRate } from '@/api/app/camera/space'
import { getManageList } from '@/api/app/algorithm/manage.js'
import TaskStatic from './charts/bar.vue'
import IntelligentRecognition from './charts/line.vue'
import { getEventList, getUnreadCount } from '@/api/app/event/manual'
import { getDeviceList, getDeviceInfo } from '@/api/admin/diary'
import Pie from './charts/pie.vue'
import { imagePath } from '@/config/env'
import PopForm from '@/views/admin/diary/device/popForm.vue'
import { rule } from '@/util/validateRules'
import { getUserInfo } from '@/api/login'
import { editInfo, getPasswordAlertDay } from '@/api/admin/user'
import { getPublicKey } from '@/api/publicKey.js'
import { encrypt, decrypt, serveEncrypt } from '@/util/jsencrypt'
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
  components: { TaskStatic, IntelligentRecognition, Pie, PopForm },
  data() {
    const validatePass = (rule, value, callback) => {
      if (this.ruleForm.password !== '') {
        if (value !== this.ruleForm.newpassword1) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        username: '',
        password: '',
        newpassword1: '',
        newpassword2: '',
        firstUpdatePassword: true,
      },
      rules: {
        password: [this.$formRules.checkNecessary('请输入原密码')],
        newpassword1: [
          this.$formRules.checkNecessary('请输入新密码'),
          {
            min: 8,
            max: 32,
            message: '长度在 8 到 32 个字符',
            trigger: 'blur',
          },
          {
            validator: rule.checkPassword,
            trigger: 'blur',
          },
        ],
        newpassword2: [
          this.$formRules.checkNecessary('请再次输入新密码'),
          { required: false, validator: validatePass, trigger: 'blur' },
        ],
      },
      publicKey: '',
      visible: false,
      cameraInfo: {},
      taskStaticList: [],
      areaList: [],
      computedInfo: {},
      algoList: [],
      countList: [],
      algorithmType: [],
      spaceRateList: [],
      IntelligentRecognition: [], //智能识别算法数据
      eventList: [], //任务事件
      type: 1,
      timeType: 0,
      dateRange: [],
      deviceList: [],
      timeTaskType: 0,
      taskDateRange: [],
      imagePath,
      formOptions: {
        visible: false,
        data: {},
      },
      log_count: 0,
      log_loading: false,
      log_pages: 0,
      event_count: 0,
      event_loading: false,
      event_pages: 0,
      log_unReadCount: 0,
      event_unReadCount: 0,
      passwordType: '',
      passwordType1: 'password',
      passwordType2: 'password',
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    event_noMore() {
      return this.event_count >= this.event_pages - 1
    },
    event_disabled() {
      return this.event_loading || this.event_noMore
    },
    log_noMore() {
      return this.log_count >= this.log_pages - 1
    },
    log_disabled() {
      return this.log_loading || this.log_noMore
    },
    ...mapGetters(['permissions']),
  },
  watch: {},
  mounted() {
    this.ruleForm.username = this.userInfo.username
    this.getDicts('algorithm_type').then((res) => {
      this.algorithmType = res.data.data
    })

    // this.getInfo()
    // this.getList()
    // this.getDataList()
    // this.getTaskDataList()
  },
  methods: {
    getInfo() {
      getUserInfo().then((res) => {
        const data = res.data.data
        if (!data.sysUser.firstLoginTime) {
          this.visible = true
        }
      })
      getPublicKey().then((res) => {
        this.publicKey = res.data.data
      })
      getPasswordAlertDay(this.userInfo.username).then((res) => {
        if (res.data.code == 1) {
          this.$notify({
            title: '密码即将过期',
            message: res.data.msg,
            duration: 0,
          })
        }
      })
    },
    getList() {
      getCamera().then((res) => {
        this.cameraInfo = res.data.data
      })
      getAreaRank().then((res) => {
        this.areaList = res.data.data || []
      })

      getComputingResources().then((res) => {
        this.computedInfo = res.data.data
      })

      getAlgoStatic().then((res) => {
        this.algoList = res.data.data
      })

      getUnreadCount().then((res) => {
        this.event_unReadCount = res.data.data
      })
      getEventList({ size: 10, current: 1 }).then((res) => {
        this.eventList = res.data.data.records
        this.event_total = res.data.data.total
        this.event_pages = res.data.data.pages
      })
      getDeviceList({ size: 10, current: 1, logType: 0 }).then((res) => {
        this.deviceList = res.data.data.records
        this.log_pages = res.data.data.pages
        this.log_unReadCount = res.data.data.maxLimit
      })
      getSpaceRate().then((res) => {
        this.spaceRateList = res.data.data
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false
        }
        this.ruleForm.password = serveEncrypt(this.ruleForm.password, this.publicKey)
        this.ruleForm.newpassword1 = serveEncrypt(this.ruleForm.newpassword1, this.publicKey)
        this.ruleForm.newpassword2 = serveEncrypt(this.ruleForm.newpassword2, this.publicKey)
        editInfo(this.ruleForm).then((response) => {
          this.msgSuccess('修改成功')
          // 修改后注销当前token,重新登录
          this.$store.dispatch('LogOut').then(() => {
            location.reload()
          })
        })
      })
    },
    getEventList() {
      if (this.type !== 1) return
      //滑到底部时进行加载
      this.event_loading = true
      setTimeout(() => {
        this.event_count += 1
        getEventList({ size: 10, current: this.event_count }).then((res) => {
          this.event_loading = false
          this.eventList = this.eventList.concat(res.data.data.records)
          this.event_pages = res.data.data.pages
        })
      }, 1000)
    },
    refreshLogList() {
      getDeviceList({ size: 10, current: 1, logType: 0 }).then((res) => {
        this.log_unReadCount = res.data.data.maxLimit
      })
    },
    getLogList() {
      if (this.type !== 2) return
      this.log_loading = true
      setTimeout(() => {
        this.log_count += 1
        getDeviceList({ size: 10, current: this.log_count, logType: 0 }).then((res) => {
          this.log_loading = false
          this.deviceList = this.deviceList.concat(res.data.data.records)
          this.log_pages = res.data.data.pages
        })
      }, 1000)
    },
    getDataList() {
      const timeType = this.timeType
      this.dateRange = []
      getIntelligentRecognition({ timeType }).then((res) => {
        this.IntelligentRecognition = res.data.data
      })
    },
    getTaskDataList() {
      const timeType = this.timeTaskType
      this.taskDateRange = []
      getTaskStatic({ timeType }).then((res) => {
        this.taskStaticList = res.data.data || []
      })
    },
    handleTaskChangeTime() {
      this.timeTaskType = null
      const startTime = this.taskDateRange ? this.taskDateRange[0] : null
      const endTime = this.taskDateRange ? this.taskDateRange[1] : null
      getTaskStatic({ startTime, endTime }).then((res) => {
        this.taskStaticList = res.data.data
      })
    },
    handleChangeTime() {
      this.timeType = null
      const startTime = this.dateRange ? this.dateRange[0] : null
      const endTime = this.dateRange ? this.dateRange[1] : null
      getIntelligentRecognition({ startTime, endTime }).then((res) => {
        this.IntelligentRecognition = res.data.data
      })
    },
    goAll() {
      if (this.type === 1) {
        this.$router.push('/app/event/manual/index')
      } else {
        this.$router.push('/admin/diary/device/index')
      }
    },
    handleDetails(row) {
      if (!this.permissions.wel_alert_view) return this.msgWarn('权限不足')
      getDeviceInfo(row.logId).then((res) => {})
      this.formOptions.data = row
      this.formOptions.visible = true
    },
    goCameraList() {
      if (!this.permissions.wel_offlinecamera_view) return this.msgWarn('权限不足')
      this.$router.push({
        path: '/app/camera/videoDevice/index',
        query: {
          status: -1,
        },
      })
    },
    formatNumber(num = 0) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    getPercent(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0' : Math.round((num / total) * 10000) / 100.0
    },
    handleEventDetails(row) {
      if (!this.permissions.wel_task_view) return this.msgWarn('权限不足')
      const id = row.eventId
      this.$router.push({
        path: '/app/event/manual/info/index/',
        query: {
          id,
        },
      })
    },
    handleAlgorithmDetails(row) {
      if (!this.permissions.wel_algorithm_view) return this.msgWarn('权限不足')
      this.$router.push('/app/algorithm/manage/details/index?id=' + row.algorithmId)
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
  height: 260px;
  padding-top: 20px;
}
div[class*='chart'] {
  margin: 12 * $vw;
}
div[class*='chart']:empty {
  background: #eee;
}
::v-deep .dialog-footer {
  text-align: center;
}
.sub-page {
  min-height: 100%;
  display: flex;
  font-size: 16 * $vw;
  flex-direction: column;
  align-items: stretch;
  background-color: white;
  margin: 0 12 * $vw;
  width: auto;
}
.count-x {
  display: flex;
  margin-right: -12 * $vw;

  .c1 {
    background: linear-gradient(to bottom, #33bdf6, #118ced);
  }
  .c2 {
    background: linear-gradient(to bottom, #54d8e0, #1db7ba);
  }
  .c3 {
    background: linear-gradient(to bottom, #f1cf47, #efa71e);
  }
  .c4 {
    background: linear-gradient(to bottom, #f4a05d, #ed772d);
  }
  dl,
  dt,
  dd {
    margin: 0;
  }
  .cell {
    position: relative;
    border-radius: 5 * $vw;
    flex: 1;
    margin-right: 12 * $vw;
    margin-top: 12 * $vw;
    padding: 20 * $vw 28 * $vw;
    color: white;
    .info {
      display: flex;
      align-items: center;
    }
    .icon-tips {
      position: absolute;
      right: 12 * $vw;
      top: 12 * $vw;
      font-size: 18 * $vw;
    }
    .icon-tips:before {
      content: '\e941';
      font-family: c-icon-font, sans-serif;
      color: white;
    }
    .icon {
      margin-right: 18 * $vw;
      width: 83 * $vw;
      height: 83 * $vw;
    }
    dd {
      font-size: 48 * $vw;
    }
    dt {
      font-size: 20 * $vw;
    }
    .footer {
      margin: -20 * $vw -28 * $vw;
      margin-top: 20 * $vw;
      padding: 16 * $vw 28 * $vw;
      display: flex;
      justify-content: space-between;
      border-top: solid 1px rgba($color: #000000, $alpha: 0.1);
      font-size: 18 * $vw;
      position: relative;
      .is-link {
        cursor: pointer;
        display: block;
        &::after {
          content: '\e901';
          font-family: c-icon-font, sans-serif;
          color: white;
          position: absolute;
          right: 16 * $vw;
          top: 18 * $vw;
        }
      }
    }
  }
}
.eventTime {
  color: #666666;
  display: inline-block;
}
.flex1 {
  flex: 1;
}
.flex2 {
  flex: 2;
}
.row {
  display: flex;
  margin-right: -12 * $vw;
}
.card {
  margin-right: 12 * $vw;
  border-radius: 6 * $vw;
  box-shadow: 0 0 10 * $vw rgba(0, 0, 0, 0.1);
  margin-top: 12 * $vw;
}
.card-tit {
  font-size: 20 * $vw;
  margin: 12 * $vw;
  &:before {
    display: inline-block;
    vertical-align: top;
    width: 4 * $vw;
    height: 22 * $vw;
    border-radius: 2 * $vw;
    background: $--color-primary;
    content: '';
    margin-right: 8 * $vw;
    margin-top: 3 * $vw;
  }
}
.join-btn {
  display: inline-block;
}
.tableQYRWZYSPH {
  font-size: 16 * $vw;
  line-height: 22px;
  width: 100%;
  text-align: center;
  td {
    padding: 10px;
    &:first-child {
      font-weight: bold;
      transform: skewX(-8deg);
    }
  }
}
.countSLZYQK {
  display: flex;
  padding: 0 12 * $vw;
  margin-right: -12 * $vw;
  .c1 {
    border-color: #5068e2;
    background: #fafbff;
  }
  .c2 {
    border-color: #30b789;
    background: #f8fffd;
  }
  .c3 {
    border-color: #f67f79;
    background: #fefcfc;
  }
  dl,
  dt,
  dd {
    margin: 0;
  }
  .cell {
    border-radius: 5 * $vw;
    flex: 1;
    margin-right: 12 * $vw;
    margin-bottom: 12 * $vw;
    border-style: solid;
    border-width: 1 * $vw;
    border-bottom-width: 3 * $vw;
    .top {
      align-items: center;
      display: flex;
      padding: 20 * $vw 28 * $vw;
    }
    .icon {
      margin-right: 18 * $vw;
      width: 71 * $vw;
      height: 71 * $vw;
    }
    dd {
      font-size: 48 * $vw;
    }
    dt {
      font-size: 20 * $vw;
    }
  }
  .footer {
    padding-top: 12 * $vw;
    display: flex;
    justify-content: space-between;
    font-size: 20 * $vw;
    padding: 12 * $vw 20 * $vw;
    b {
      margin-left: 4 * $vw;
    }
  }
  .c1 {
    .footer {
      border-top: solid 1px #5068e2;
    }
  }
  .c2 {
    .footer {
      border-top: solid 1px #30b789;
    }
  }
  .c3 {
    .footer {
      border-top: solid 1px #f67f79;
    }
  }
}
.listSFNLJS {
  margin: 0 12 * $vw;
  margin-right: 0;
  display: flex;
  flex-wrap: wrap;
  .count {
    display: flex;
    justify-content: space-between;
    margin-top: 14 * $vw;
    b {
      margin-left: 4 * $vw;
    }
  }
  .state {
    position: absolute;
    // height: 24*$vw;
    font-size: 16 * $vw;
    color: white;
    right: -24px;
    top: 10px;
    text-align: center;
    width: 4em;
    box-sizing: content-box;
    transform: rotate(45deg);
    background: #26d90e;
    padding: 0 20px;
    &.orange {
      background: #f68119;
    }
  }
  .cell {
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    border-radius: 10 * $vw;
    border: solid 1 * $vw #e0e0e0;
    padding: 10 * $vw;
    padding-top: 20 * $vw;
    width: calc(33.3% - #{12 * $vw});
    margin-right: 12 * $vw;
    margin-bottom: 12 * $vw;
  }
  p {
    font-size: 16 * $vw;
    margin-top: 12 * $vw;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    height: 42 * $vw;
    word-break: break-all;
    min-height: 32px;
  }
  .operate {
    margin: -10 * $vw;
    margin-top: 10 * $vw;
    padding: 8 * $vw 10 * $vw;
    display: flex;
    border-top: solid 1 * $vw #e0e0e0;
    font-size: 16 * $vw;
    .type {
      flex: 1;
      color: #999;
    }
  }
  .tit {
    display: flex;
    align-items: center;
    font-size: 20 * $vw;
    label {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      word-break: break-all;
    }
    img {
      flex-shrink: 0;
      width: 51 * $vw;
      height: 51 * $vw;
      margin-right: 12 * $vw;
    }
  }
}
.tab-radio {
  font-size: 20 * $vw;
  display: flex;
  justify-content: space-around;
  padding-bottom: 12 * $vw;
  border-bottom: solid 1 * $vw #e0e0e0;
  .dot {
    background: red;
    line-height: 22px;
    height: 22px;
    min-width: 22px;
    text-align: center;
    font-size: 12px;
    padding: 0 4px;
    border-radius: 11px;
    color: white;
    margin-left: 6px;
  }
  i {
    margin-right: 6 * $vw;
  }
  .cus-icon-case::before {
    content: '\e930';
  }
  .cus-icon-outline::before {
    content: '\e931';
  }
  .item {
    padding: 0 24 * $vw;
    line-height: 44 * $vw;
    border-radius: 4 * $vw;
    cursor: pointer;
    &.active {
      background-color: $--color-primary;
      color: white;
    }
  }
}
.link {
  cursor: pointer;
  display: inline-block;
  font-size: 16 * $vw;
  color: $--color-primary;
  &:after {
    content: '\e932';
    font-family: c-icon-font, sans-serif;
    font-size: 14 * $vw;
    margin-left: 4 * $vw;
    margin-top: 4 * $vw;
  }
}
.msg-list {
  margin: 0 12 * $vw;
  height: 600 * $vw;
  overflow-y: auto;
  .cell {
    display: flex;
    align-items: flex-start;
    padding: 16 * $vw 12 * $vw;
    border-bottom: solid 1 * $vw #e0e0e0;
  }
  .icon {
    margin-right: 12 * $vw;
    flex-shrink: 0;
    width: 49 * $vw;
    height: 49 * $vw;
  }
  .link {
    margin-top: 8 * $vw;
  }
  .info {
    font-size: 18 * $vw;
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
      b {
        font-weight: normal;
        color: $--color-primary;
      }
    }
  }
}
.loading-text {
  text-align: center;
  font-size: 14px;
  padding: 10px;
}
</style>
