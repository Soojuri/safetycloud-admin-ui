<template>
  <div @mouseover="myChart.resize()" ref="chart" class="g-full-chart" />
</template>

<script>
  import echarts from 'echarts'

  export default {
    components: {},
    data() {
      return {
        myChart: null,
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.initChart()
    },
    methods: {
      vLinear: function(_c1, _c2) {
        return new echarts.graphic.LinearGradient(
          0, 1, 1, 0, [{
              offset: 1,
              color: _c1
            },
            {
              offset: 0,
              color: _c2
            }
          ]
        )
      },

      initChart() {
        this.myChart = echarts.init(this.$refs.chart)
        let option = {
          grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            top: '5%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: "#bfe7ff"
              },
              interval: 0,
            },
            axisLine: {
              lineStyle: {
                color: '#007aff30'
              }
            },
          },
          itemStyle: {
            barBorderRadius: [0, 5, 5, 0],
            color: this.vLinear('#00f5fd', '#00b3ff'),
          },
          yAxis: {
            type: 'category',
            axisLabel: {
              textStyle: {
                color: "#bfe7ff"
              },
              interval: 0,
            },
            axisLine: {
              lineStyle: {
                color: '#007aff30'
              }
            },
            data: ['泉州市', '福州市', '厦门市', '莆田市', '龙岩市', '漳州市']
          },
          series: [{
            name: '2011',
            type: 'bar',
            barWidth: '10',
            data: [5000, 3000, 800, 400, 600, 1800]
          }]
        }
        option && this.myChart.setOption(option)
        window.addEventListener("resize", () => {
          this.myChart.resize()
        })

      },
    },
  }
</script>