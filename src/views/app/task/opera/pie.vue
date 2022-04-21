<template>
  <div ref="chart" style="height:100%;width:100%">
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
      dataList: [],
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
  mounted() {
    const data = this.data
    this.dataList = Object.keys(data).map((key) => {
      return {
        name: key,
        value: data[key],
      }
    })
    this.dataList = this.dataList.filter((item) => item.name != '总数')
    this.names = Object.keys(data).map((item) => {
      return item
    })
    this.initChart()
  },
  watch: {
    data() {
      const data = this.data
      this.dataList = Object.keys(data).map((key) => {
        return {
          name: key,
          value: data[key],
        }
      })
      this.dataList = this.dataList.filter((item) => item.name != '总数')
      this.names = Object.keys(data).map((item) => {
        return item
      })
      this.initChart()
    },
  },
  methods: {
    initChart() {
      const that = this
      that.chart = echarts.init(that.$refs.chart)
      let option = {
        legend: {
          orient: 'vertical',
          x: 'right',
          itemGap: 12,
          itemHeight: 8,
          itemWidth: 14,
          textStyle: {
            rich: {
              a: {
                color: '#333',
                fontSize: 14,
              },
              b: {
                color: '#2975ff',
                fontSize: 16,
              },
            },
          },
          y: 'middle',
          data: that.names,
          formatter: function (name) {
            const obj = that.dataList.find((item) => {
              return item.name === name
            })
            return `{a|${name}}` + '  ' + `{b|${obj.value}}`
          },
        },
        color: [
          '#63b2ee',
          '#76da91',
          '#f8cb7f',
          '#f89588',
          '#7cd6cf',
          '#9192ab',
          '#7898e1',
          '#efa666',
          '#eddd86',
          '#9987ce',
          '#63b2ee',
          '#76da91',
          '#0780cf',
          '#765005',
          '#fa6d1d',
          '#0e2c82',
          '#b6b51f',
          '#da1f18',
        ],
        series: [
          {
            type: 'pie',
            center: ['25%', '50%'],
            radius: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: that.dataList,
          },
        ],
      }
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
