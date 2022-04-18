<template>
  <div ref="chart" class="canvas-wrap" />
</template>

<script>
import * as echarts from 'echarts'

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
      return new echarts.graphic.LinearGradient(0, 1, 1, 0, [
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
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '25%',
          containLabel: true,
        },
        legend: {
          top: '0%',
          left: 'center',
          itemGap: 24,
          textStyle: {
            color: '#fff',
            fontSize: '16',
          },
        },
        color: [this.vLinear('#0163eb', '#28c3fa'), this.vLinear('#fc6104', '#f8a911')],
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
              color: '#bfe7ff',
            },
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: '#007aff30',
            },
          },
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            textStyle: {
              color: '#bfe7ff',
            },
            interval: 0,
          },
          axisLine: {
            lineStyle: {
              color: '#007aff30',
            },
          },
          data: ['泉州市', '福州市', '莆田市', '厦门市', '龙岩市'],
        },
        series: [
          {
            name: '安全指数',
            type: 'bar',
            barWidth: '20',
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: this.vLinear('#0163eb', '#28c3fa'),
            },
            data: [60, 50, 65, 55, 45],
          },
          {
            name: '安全指数全国平均数',
            type: 'line',
            symbol: 'none',
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: this.vLinear('#fc6104', '#f8a911'),
            },
            lineStyle: {
              color: this.vLinear('#fc6104', '#f8a911'),
            },
            data: [45, 45, 45, 45, 45],
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
