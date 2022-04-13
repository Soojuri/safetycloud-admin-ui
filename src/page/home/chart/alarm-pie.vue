<!-- 首页设备告警信息饼状图 -->
<template>
  <div ref="chart" :style="{ height: '250px', width: '100%' }" />
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
    this.initChart()
  },
  methods: {
    initChart () {
      let myChart = echarts.init(this.$refs.chart, 'macarons')
      let option = {
        tooltip: {
          show: true
        },
        legend: {
          show: true,
          icon: "circle",
          left: '50%',
          top: "30%",
          orient: 'vertical',
          data: ['普通告警', '警告告警', '紧急告警'],
          textStyle: {
            fontSize: 13,
            lineHeight: 30,
            rich: {
              b: {
                width: 35,
                padding: [0, 0, 0, 10]
              },
              c: {
                color: '#A9A9A9',
                padding: [0, 0, 0, 60]
              },
              d: {
                lineHeight: 8,
                fontWeight: 'bold',
                color: 'rgba(0,0,0,0.1)',
                padding: [0, 0, 0, 5]
              }
            }
          },

          formatter: function (val) {
            var index = 0
            var datas = option.series[0].data
            var totalNum = 0
            datas.forEach(function (v, i) {
              totalNum += v.value
            })
            var legendData = option.legend.data
            legendData.forEach(function (v, i) {
              if (v == val) {
                index = i
              }
            })
            let arr = ["{a|" + val + "}", "{d| | }", "{b|" + ((datas[index].value / totalNum) * 100).toFixed(2) + '%' + "}", "{c|" + datas[index].value + "}"]
            return arr.join('')
          }
        },
        series: [
          {
            name: '设备告警数',
            type: 'pie',
            radius: '70%',
            center: ['25%', '50%'],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 1048, name: '普通告警', itemStyle: { color: "#73C0DE" } },
              { value: 735, name: '警告告警', itemStyle: { color: "#FFC324" } },
              { value: 580, name: '紧急告警', itemStyle: { color: "#EF6667" } },
            ],
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