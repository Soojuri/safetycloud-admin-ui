<!-- 首页设备统计 -->
<template>
  <div class="g-card card_device">
    <div class="g-tit flex v-center">
      <div class="g-tab-button-x">
        <el-tabs v-model="queryParams.status" @tab-click="handleClick">
          <el-tab-pane label="创建设备数" :name="0"></el-tab-pane>
          <el-tab-pane label="激活设备数" :name="1"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="flex-1"></div>
      <div class="card_time_range">
        <el-radio-group v-model="selectDateItem" @change="changeSelect">
          <el-radio-button :label="0">今日</el-radio-button>
          <el-radio-button :label="1">本周</el-radio-button>
          <el-radio-button :label="2">本月</el-radio-button>
          <el-radio-button :label="3">全年</el-radio-button>
        </el-radio-group>
      </div>
      <div class="card_date ml-m">
        <el-date-picker value-format='timestamp' v-model='dateRange' type='daterange' range-separator='至'
                        start-placeholder='开始时间' end-placeholder='结束时间' :default-time="['00:00:00', '23:59:59']" />
      </div>
    </div>
    <el-row>
      <el-col :span="18">
        <div class="device-sta-title"><span>{{`${queryParams.status === 1 ? '激活' : '创建'}设备数趋势`}}</span></div>
        <el-empty v-if="deviceData.length === 0 "></el-empty>
        <device-statistics v-else :data="deviceData"></device-statistics>
      </el-col>
      <el-col :span="6">
        <div>
          <div class="device-sta-title"><span>物联设备排名</span></div>
          <div class="device-sta-list">
            <div class="device-sta-li" v-for="(item,index) in deviceList" :key="item">
              <span class="i-num">{{index+1}}</span>
              <span>{{item.name}}</span>
              <span class="val">{{formatMoney(item.value)}}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import DeviceStatistics from '../chart/device-statistics.vue'
import { getDeviceTrend, deviceProductRanking } from '@/api/statistics/home'
export default {
  components: { DeviceStatistics },
  data() {
    return {
      selectDateItem: 2,
      deviceList: [],
      deviceData: [],
      dateRange: [],
      queryParams: {
        status: 0,
        type: 0,
        startTime: null,
        endTime: null,
      },
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getRank()
    this.changeSelect(2)
  },
  methods: {
    getRank() {
      deviceProductRanking().then((res) => {
        this.deviceList = res.data.data.slice(0, 8)
      })
    },
    getList() {
      this.queryParams.startTime = this.dateRange ? this.dateRange[0] : null
      this.queryParams.endTime = this.dateRange ? this.dateRange[1] : null
      getDeviceTrend(this.queryParams).then((res) => {
        this.deviceData = res.data.data
      })
    },
    timeDefault() {
      // 日期初始化到今天
      let date = new Date()
      let year = date.getFullYear() //获取完整的年份(4位)
      let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      let day = date.getDate() + 1 >= 10 ? date.getDate() : '0' + date.getDate()
      let startTime = year + '-' + month + '-' + day //当前年月日
      let endTime = year + '-' + month + '-' + day //当前年月日
      startTime = new Date(startTime.replace(/-/g, '/') + ' 00:00:00' || 0).getTime()
      endTime = new Date(endTime.replace(/-/g, '/') + ' 23:59:59').getTime()

      this.dateRange.push(startTime)
      this.dateRange.push(endTime)
      this.queryParams.type = 0
      this.getList()
    },
    changeSelect(index) {
      this.selectDate = index
      this.dateRange = []
      // 获取当前时间
      let date = new Date()
      let year = date.getFullYear() //获取完整的年份(4位)
      let month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
      let day = date.getDate() + 1 >= 10 ? date.getDate() : '0' + date.getDate()
      let oneDay = 1000 * 60 * 60 * 24
      let startTime, endTime
      //当日
      if (index === 0) {
        this.timeDefault()
      }
      //本周
      if (index === 1) {
        let nowTime = date.getTime()
        let nowDay = date.getDay()
        let MondayTime = nowTime - (nowDay - 1) * oneDay //显示周一
        let SundayTime = nowTime + (7 - nowDay) * oneDay //显示周日
        MondayTime = this.getTime(new Date(MondayTime))
        SundayTime = this.getTime(new Date(SundayTime))
        startTime = MondayTime
        endTime = SundayTime
        startTime = new Date(startTime.replace(/-/g, '/') + ' 00:00:00' || 0).getTime()
        endTime = new Date(endTime.replace(/-/g, '/') + ' 23:59:59').getTime()
        this.dateRange.push(startTime)
        this.dateRange.push(endTime)
        this.queryParams.type = 0
        this.getList()
      }
      //本月
      if (index === 2) {
        let currentMonth = date.getMonth()
        let nextMonth = ++currentMonth
        let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
        let lastDay = new Date(nextMonthFirstDay - oneDay)
        lastDay = this.getTime(lastDay)
        startTime = year + '-' + month + '-01'
        endTime = lastDay
        startTime = new Date(startTime.replace(/-/g, '/') + ' 00:00:00' || 0).getTime()
        endTime = new Date(endTime.replace(/-/g, '/') + ' 23:59:59').getTime()
        this.dateRange.push(startTime)
        this.dateRange.push(endTime)
        this.queryParams.type = 0
        this.getList()
      }
      //本年
      if (index === 3) {
        let currentYear = date.getFullYear()
        startTime = currentYear + '-01-01'
        endTime = currentYear + '-12-31'
        startTime = new Date(startTime.replace(/-/g, '/') + ' 00:00:00' || 0).getTime()
        endTime = new Date(endTime.replace(/-/g, '/') + ' 23:59:59').getTime()
        this.dateRange.push(startTime)
        this.dateRange.push(endTime)
        this.queryParams.type = 1
        this.getList()
      }
    },
    getTime(strDate) {
      let date = new Date(strDate)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let str = y + '-' + m + '-' + d
      return str
    },
    handleClick() {
      this.getList()
    },
    formatMoney(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
}
</script>
<style lang='scss' scoped>
@import '@/styles/variables.scss';
.device-sta-title {
  @include g-tit-s;
}
.g-tit.flex {
  margin-bottom: 0;
}
.device-sta-li:nth-child(-n + 3) .i-num {
  color: $--color-primary;
}
.device-sta-li {
  display: flex;
  padding: 10px 0;
}
.i-num {
  min-width: 20%;
  font-style: italic;
  padding-left: 16px;
  & ~ span {
    flex: 1 1 auto;
    margin-left: 12px;
  }
}
.val {
  margin-left: 12px;
  text-align: right;
  white-space: nowrap;
}
</style>
