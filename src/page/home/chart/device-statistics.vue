<!-- 首页设备统计图表 -->
<template>
  <div ref="chart" :style="{ height: '350px', width: '100%' }" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme

export default {
  components: {},
  data () {
    return {
      myChart: null
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {},
  watch: {
    data () {
      this.initChart()
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestory () {
    echarts.dispose(this.myChart)
    this.myChart = null
  },
  methods: {
    initChart () {
      if (!this.myChart) {
        this.myChart = echarts.init(this.$refs.chart, 'macarons')
      }
      let option = {
        grid: {
          show: true,
          top: 10,
          bottom: 50,
          left: 30,
          right: 10
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            interval: 0,
            rotate: -20
          },
          data: this.data.map(item => item.name)
        },
        yAxis: {
          type: 'value',
          min: 0,
          interval: 1,
        },
        series: [{
          data: this.data.map(item => item.value),
          type: 'line',
          areaStyle: {
            color: 'rgba(24, 144, 255, 0.6)'
          }
        }]
      }
      option && this.myChart.setOption(option)
      window.addEventListener("resize", () => { this.myChart.resize() })

    },
  },
}
</script>
<style lang='scss' scoped>
</style>