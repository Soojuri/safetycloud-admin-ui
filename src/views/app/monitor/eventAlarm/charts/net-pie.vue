<template>
  <div style="position: relative">
    <div ref="chart" :style="{ height: '200px', width: '100%' }" />
    <div class="chartTotal">
      <div class="num">{{total}}</div>
      <div>事件个数</div>
    </div>
  </div>

</template>

<script>
import * as echarts from 'echarts'
import { orderBy } from 'lodash'
// import { netComponentProportion } from '@/api/statistics/home'
require('echarts/theme/macarons') // echarts theme
export default {
  components: {},
  data() {
    return {
      data: [],
      total: 0,
      myChart: null,
      colors: ['#2794fc', '#00e899', '#f39614', '#ee4d0d'],
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
    this.$nextTick(function () {
      if (!this.myChart) {
        this.myChart = echarts.init(this.$refs.chart, 'macarons')
      }
      this.getList()
    })
  },
  beforeDestory() {
    echarts.dispose(this.myChart)
    this.myChart = null
  },
  methods: {
    getList() {
      this.total = 0
      const data = orderBy(this.dataList, ['value'], ['desc'])
      const length = data.length
      this.data = data.map((item, index) => {
        const per = 1 / length
        const opt = 1 - per * index
        this.total += parseInt(item.value)
        return {
          name: item.name,
          value: item.value,
          // ratio: item.ratio,
          itemStyle: {
            color: this.colors[index],
          },
        }
      })
      this.initChart()
    },
    initChart() {
      const nameList = this.data.map((item) => item.name)
      const total = this.total
      let myChart = this.myChart
      let option = {
        tooltip: {
          show: true,
        },
        legend: {
          show: true,
          icon: 'circle',
          left: '40%',
          top: '5%',
          orient: 'vertical',
          data: nameList,
          textStyle: {
            fontSize: 13,
            lineHeight: 30,
            rich: {
              a: {
                width: 46,
              },
              b: {
                width: 30,
                padding: [0, 0, 0, 10],
              },
              c: {
                color: '#A9A9A9',
                padding: [0, 0, 0, 20],
              },
              d: {
                lineHeight: 8,
                fontWeight: 'bold',
                color: 'rgba(0,0,0,0.1)',
                padding: [0, 0, 0, 5],
              },
            },
          },
          formatter: function (val) {
            const datas = option.series[0].data
            const legendData = option.legend.data
            const index = _.indexOf(legendData, val)
            const count = datas[index].value
            let arr = [
              '{a|' + val + '}',
              // '{a||}',
              '{b|' + ((count / total) * 100).toFixed(2) + '%' + '}',
              '{c|' + count + '}',
            ]
            return arr.join('')
          },
        },
        series: [
          {
            name: '事件个数',
            type: 'pie',
            radius: ['40%', '20%'],
            center: ['20%', '35%'],
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: this.data,
          },
        ],
      }
      option && myChart.setOption(option, true)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },
  },
}
</script>
<style lang='scss' scoped>
.chartTotal {
  width: 41%;
  left: 0;
  color: #000;
  z-index: 1;
  position: absolute;
  text-align: center;
  font-weight: normal;
  font-size: 14px;
  top: 55%;

  .num {
    font-size: 26px;
    margin-top: 10px;
    font-weight: 800;
  }
}
</style>