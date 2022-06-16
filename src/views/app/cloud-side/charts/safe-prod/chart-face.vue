<template>
  <div ref="chart" class="canvas-wrap" />
</template>

<script>
import echarts from 'echarts'

export default {
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {
    this.initChart()
  },
  methods: {
    vLinear: function (_c1, _c2) {
      return new echarts.graphic.LinearGradient(1, 1, 1, 0, [
        {
          offset: 1,
          color: _c1,
        },
        {
          offset: 0,
          color: _c2,
        },
      ])
    },
    initChart() {
      let myChart = echarts.init(this.$refs.chart)
      let option = {
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#007aff30',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#8D8E91',
            },
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: '#007aff30',
            },
          },
        },
        itemStyle: {
          color: '#2A75FE',
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: true,
            lineStyle: {
              color: '#007aff30',
            },
          },
          axisLabel: {
            textStyle: {
              color: '#8D8E91',
            },
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: '#007aff30',
            },
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
        series: [
          {
            data: [0, 2000, 2500, 2700, 1900, 1200, 1950, 2400, 2800, 500, 3000],
            type: 'line',
            smooth: 'true',
            areaStyle: {
              color: this.vLinear('#2A75FE', '#fff'),
            },
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

<style lang="scss" scoped>
.canvas-wrap {
  height: 100%;
  width: 100%;
  min-height: 24vh;
}
</style>