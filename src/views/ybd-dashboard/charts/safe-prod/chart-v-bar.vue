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
          top: '5%',
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
        itemStyle: {
          barBorderRadius: [4, 4, 0, 0],
          color: this.vLinear('#fc6104', '#f8a911'),
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
          data: ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市'],
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            barWidth: '24',
            data: [1000, 600, 500, 700, 900, 200, 150, 450, 1000],
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