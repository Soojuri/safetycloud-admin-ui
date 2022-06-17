<template>
  <div class="dial-plate" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      var myChart = echarts.init(this.$refs.chart)
      var option = {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 1,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, '#379EFD'],
                  [0.5, '#379EFD'],
                  [0.75, '#379EFD'],
                  [1, '#379EFD'],
                ],
              },
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                width: 2,
              },
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto',
                width: 5,
              },
            },
            axisLabel: {
              color: '#464646',
              fontSize: 16,
              distance: 5,
              formatter: function (value) {
                if (value === 0.875) {
                  return '优'
                } else if (value === 0.625) {
                  return '良'
                } else if (value === 0.375) {
                  return '中'
                } else if (value === 0.125) {
                  return '差'
                }
                return ''
              },
            },
            title: {
              offsetCenter: [0, ' 80%'],
              fontSize: 20,
            },
            detail: {
              fontSize: 24,
              offsetCenter: [0, '35%'],
              valueAnimation: true,
              formatter: function (value) {
                return Math.round(value * 100) + '分'
              },
              color: 'auto',
            },
            data: [
              {
                value: 0.7,
                name: '安全指数',
              },
            ],
          },
        ],
      }
      option && myChart.setOption(option)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
  },
}
</script>

<style>
.dial-plate {
  height: 100%;
}
</style>
