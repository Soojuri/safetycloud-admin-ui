<template>
  <div ref="chart" class="canvas-wrap" />
</template>

<script>
  import echarts from 'echarts'

  export default {
    components: {},
    data() {
      return {

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
        let myChart = echarts.init(this.$refs.chart)
        let option = {
          grid: {
            left: '0',
            right: '0',
            top: '5%',
            bottom: '15%',
            containLabel: true
          },
          legend:{
            show:true,
            bottom:0,
            itemGap: 24,
            textStyle:{
              fontSize: 14,
              margin: 5,
              color: '#bfe7ff',
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#007aff30'
              }
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
            barBorderRadius: [4, 4, 0, 0],
          },
          xAxis: {
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
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月','9月','10月','11月','12月']
          },
          series: [
            {
              name: '责令整改总数',
              type: 'bar',
              barWidth: '6',
              color: '#ef3434',
              data: [1000, 400, 800, 200, 400, 570, 112, 225,477,600,200,400]
            },
            {
              name: '行政处罚总数',
              type: 'bar',
              barWidth: '6',
              color: '#eeba15',
              data: [300, 600, 500, 700, 900, 200, 150, 450,1000,800,410,600]
            },
            {
              name: '检查企业总数',
              type: 'bar',
              barWidth: '6',
              color: '#00b5e9',
              data: [800, 700, 40, 770, 480, 200, 300, 600,700,600,400,100]
            },
          ]
        }
        option && myChart.setOption(option)
        window.addEventListener("resize", () => {
          myChart.resize()
        })

      },
    },
  }
</script>