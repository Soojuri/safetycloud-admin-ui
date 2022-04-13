<!-- 首页消息折线图-->
<template>
  <div>
    <el-empty v-if="receivedMsg.length === 0"></el-empty>
    <div v-else ref="chart" :style="{ height: '300px', width: '100%' }" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { getReceivedMessageTrend, getSendMessageTrend } from '@/api/statistics/home'
export default {
  components: {},
  data () {
    return {
      receivedMsg: [],
      sendMsg: []
    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.getList()
  },
  methods: {
    async getList () {
      const res1 = await getReceivedMessageTrend()
      this.receivedMsg = res1.data.data || []
      const res2 = await getSendMessageTrend()
      this.sendMsg = res2.data.data || []
      if (this.receivedMsg.length > 0) {
        this.initChart()
      }
    },
    initChart () {
      var emphasisStyle = {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        }
      }
      let myChart = echarts.init(this.$refs.chart)
      let option = option = {
        legend: {
          data: ['上行消息', '下行消息'],
          right: '10%'
        },
        tooltip: {},
        xAxis: {
          splitLine: { show: false },
          axisLine: { show: true },
          axisTick: { show: false },
          data: this.sendMsg.map(item => item.date)
        },
        yAxis: {
          axisLine: { show: true },
          show: true
        },
        series: [
          {
            name: '下行消息',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            data: this.receivedMsg.map(item => item.count),
            itemStyle: {
              color: '#00bf00'
            }
          },
          {
            name: '上行消息',
            type: 'bar',
            stack: 'one',
            emphasis: emphasisStyle,
            data: this.sendMsg.map(item => item.count),
            itemStyle: {
              color: '#3086f8'
            }
          }
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