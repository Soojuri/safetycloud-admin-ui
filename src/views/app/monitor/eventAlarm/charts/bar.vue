<template>
  <div ref="chart" :style="{ height: '100%', width: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    msgList: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  watch: {
    msgList(val) {
      this.initChart()
    },
  },
  data() {
    return {
      chart: null,
    }
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
        grid: {
          left: '2%',
          right: '2%',
          bottom: '0%',
          top: '10%',
          containLabel: true,
        },
        color: '#2593fc',
        xAxis: {
          type: 'category',
          axisLabel: {
            textStyle: {
              color: '#7580a6',
            },
            interval: 0,
            rotate: 25,
          },
          axisLine: {
            lineStyle: {
              color: '#7580a6',
            },
          },
          data: this.msgList.map((item) => item.time),
        },
        yAxis: {
          backgroundColor: 'transparent',
          splitLine: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: '#477497',
            },
          },
          axisLine: {
            lineStyle: {
              color: '#557294',
            },
          },
        },
        series: [
          {
            data: this.msgList.map((item) => item.num),
            type: 'bar',
            barMaxWidth: 12,
          },
        ],
      }
      option && this.chart.setOption(option)
    },
  },
}
</script>

<style>
</style>
