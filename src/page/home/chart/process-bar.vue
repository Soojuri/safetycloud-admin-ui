<!-- 进度柱状图 -->
<template>
  <div ref="processBar" :style="{ height: '50px', width: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
export default {
  components: {},
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.initProcessBar()
  },
  methods: {
    initProcessBar () {
      let myChart = echarts.init(this.$refs.processBar, 'macarons')
      let option = {
        xAxis: {
          type: 'value',
          show: false,
          min: 0,
          max: 100
        },
        yAxis: {
          type: 'category',
          show: false,
          data: ['活跃设备数']
        },
        series: [
          {
            type: 'bar',
            barWidth: 8,
            data: [78],
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
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