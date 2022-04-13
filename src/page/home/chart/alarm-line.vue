<!-- 首页设备告警折线图 -->
<template>
  <div ref="chart" :style="{ height: '100%', width: '100%' }" />
</template>

<script>
import * as echarts from 'echarts'
import { deviceAlarmCondition } from '@/api/statistics/home'
export default {
  components: {},
  data () {
    return {
      data: []
    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      deviceAlarmCondition().then(res => {
        this.data = res.data.data
        this.initChart()
      })
    },
    initChart () {
      let myChart = echarts.init(this.$refs.chart)
      let option = option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'rect',
          itemGap: 40,
          itemWidth: 30,
          data: ['普通告警', '警告告警', '紧急告警']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval: 0
          },
          axisLine: { show: true },
          axisTick: { show: false },
          data: this.data.map(item => item.name)
        },
        yAxis: {
          axisLine: { show: true },
          show: true
        },
        series: [
          {
            name: '普通告警',
            itemStyle: {
              color: '#3086f8'
            },
            type: 'line',
            data: this.data.map(item => item.normal)
          },
          {
            name: '警告告警',
            type: 'line',

            itemStyle: {
              color: '#faab0c'
            },
            data: this.data.map(item => item.alarm)
          },
          {
            name: '紧急告警',
            type: 'line',
            itemStyle: {
              color: '#ff3b30'
            },
            data: this.data.map(item => item.urgency)
          },

        ]
      }
      option && myChart.setOption(option)
      window.addEventListener("resize", () => { myChart.resize() })

    },
  },
}
</script>
<style lang='scss' scoped>
</style>