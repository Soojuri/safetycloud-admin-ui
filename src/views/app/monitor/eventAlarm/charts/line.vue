<template>
  <div ref="chart" class="chart" :style="{ height: '100%', width: '100%' }" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  components: {},
  data() {
    return {
      chart: null,
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return []
      },
    },
  },
  computed: {},
  watch: {
    data(val) {
      this.initChart()
    },
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart)
        window.addEventListener('resize', () => {
          this.chart.resize()
        })
      }
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        xAxis: [
          {
            data: this.data.map((item) => item.time),
          },
        ],
        yAxis: [
          {
            splitLine: { show: false },
          },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '3%',
          containLabel: true,
        },
        series: [
          {
            itemStyle: {
              color: '#2593fc',
            },
            type: 'line',
            data: this.data.map((item) => item.num),
            smooth: true,
          },
        ],
        // tooltip: {
        //   trigger: 'axis',
        // },
        // grid: {
        //   left: '3%',
        //   right: '4%',
        //   bottom: '3%',
        //   top: '3%',
        //   containLabel: true,
        // },
        // xAxis: {
        //   type: 'category',
        //   boundaryGap: false,
        //   axisLabel: {
        //     interval: 0,
        //   },
        //   axisLine: { show: true },
        //   axisTick: { show: false },
        //   data: this.data.map((item) => item.time),
        // },
        // yAxis: {
        //   axisLine: { show: true },
        //   show: true,
        //   type: 'value',
        // },
        // series: [
        //   {
        //     name: '智能识别数量',
        //     itemStyle: {
        //       color: '#2593fc',
        //     },
        //     type: 'line',
        //     data: this.data.map((item) => item.num),
        //     smooth: true,
        //   },
        // ],
      }
      option && this.chart.setOption(option)
    },
  },
}
</script>
<style lang='scss' scoped>
.chart {
  min-width: 0vh;
}
</style>