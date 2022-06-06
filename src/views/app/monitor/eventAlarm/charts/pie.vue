<template>
  <div ref="chart" :style="{ height: '100%', width: '100%' }">
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      chart: null,
      total: 0,
      names: [],
    }
  },
  props: {
    dataList: {
      type: Object,
      default: () => {
        return []
      },
    },
  },
  watch: {
    dataList(val) {
      this.names = this.dataList.map((item) => item.name)
      this.initChart()
    },
  },
  mounted() {
    this.names = this.dataList.map((item) => item.name)
    this.initChart()
  },
  methods: {
    initChart() {
      const that = this
      that.chart = echarts.init(that.$refs.chart)
      var lineColor = '#007aff'
      let option = {
        color: ['#808def', '#42b7d4', '#70d292', '#f76487', '#eac12f', '#f48560'],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
          textStyle: {
            fontSize: 15,
          },
        },
        legend: {
          data: that.names,
          left: 'center',
          type: 'scroll',
          // pageIconInactiveColor: textColor,
          pageIconColor: lineColor,
          // pageTextStyle: {
          //   color: '#fff',
          // },
          bottom: '-5%',
          width: '80%',
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            // color: '#fff',
            fontSize: 14,
          },
          // formatter: function (name) {
          //   const obj = that.dataList.find((item) => {
          //     return item.name === name
          //   })
          //   return `{a|${name}}` + ' ' + `{b|${obj.ratio}}`
          // },
        },
        series: [
          {
            type: 'pie',
            clockwise: false,
            startAngle: 90,
            radius: ['15%', '50%'],
            center: ['50%', '50%'],

            // hoverAnimation: false,
            roseType: 'radius', //area
            data: that.dataList,
            itemStyle: {
              normal: {
                borderColor: '#041743',
                borderWidth: 2,
              },
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{b}  {d}%',
              textStyle: {
                fontSize: 14,
                // color: textColor,
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  width: 1,
                },
              },
            },
          },
        ],
      }

      console.log(option)
      that.chart.setOption(option)
      window.addEventListener('resize', () => {
        that.chart.resize()
      })
    },
  },
}
</script>

<style lang="scss" scope>
.chartTotal {
  width: 51%;
  left: 0;
  color: #000;
  z-index: 1;
  position: absolute;
  text-align: center;
  font-weight: normal;
  font-size: 14px;
  top: 40%;
  .num {
    font-size: 26px;
    margin-top: 10px;
    font-weight: 800;
  }
}
</style>
