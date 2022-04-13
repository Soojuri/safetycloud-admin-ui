<!-- 在线设备柱状图 -->
<template>
  <div ref="chart" :style="{ height: '50px', width: '100%' }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { getOnlineDeviceByMonth } from '@/api/statistics/home'
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
      getOnlineDeviceByMonth().then(res => {
        this.data = res.data.data
        this.initChart()
      })
    },
    initChart () {
      let myChart = echarts.init(this.$refs.chart, 'macarons')
      let option = {
        xAxis: {
          type: 'category',
          show: false,
          data: this.data.map(item => item.date)
        },
        tooltip: {
          show: true
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [{
          data: this.data.map(item => item.count),
          type: 'bar',
          barWidth: 8,
          itemStyle: {
            normal: {
              color: '#1890ff'
            }
          },
        }]
      }
      option && myChart.setOption(option)
      window.addEventListener("resize", () => { myChart.resize() })

    },
  },
}
</script>
<style lang='scss' scoped>
</style>