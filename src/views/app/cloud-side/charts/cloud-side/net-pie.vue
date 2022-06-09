<!-- 首页隐患个数状态占比饼状图 -->
<template>
  <div style="position: relative">
    <div ref="chart" :style="{ height: '410px', width: '100%' }" />
    <div class="chartTotal">
      <div class="num">{{total}}</div>
      <div>隐患个数</div>
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
      arr: [
        {
          value: '1',
          ratio: '5.2632%',
          name: '其他',
        },
        {
          value: '4',
          ratio: '21.0526%',
          name: '隐患上报',
        },
        {
          value: '7',
          ratio: '36.8421%',
          name: '安全检查',
        },
        {
          value: '2',
          ratio: '10.5263%',
          name: '岗位自查',
        },
        {
          value: '4',
          ratio: '21.0526%',
          name: '事故整改',
        },
        {
          value: '1',
          ratio: '5.2632%',
          name: '其他来源',
        },
      ],
      compentType: [],
      total: 0,
      myChart: null,
      colors: ['#ee4d0d', '#f39614', '#2794fc', '#00e899', '#c766ff', '#00ffde', '#c0ffee', '#1368da', '#15ec6b'],
    }
  },
  props: {
    status: '',
  },
  watch: {
    status() {
      this.getList()
    },
  },
  mounted() {
    this.$nextTick(function () {
      if (!this.myChart) {
        this.myChart = echarts.init(this.$refs.chart, 'macarons')
      }
      this.getDicts('compent_type').then((res) => {
        this.compentType = res.data.data || []
      })
      this.getList()
    })
  },
  beforeDestory() {
    echarts.dispose(this.myChart)
    this.myChart = null
  },
  methods: {
    formatCompType(val) {
      return this.selectDictLabel(this.compentType, val)
    },
    getList() {
      this.total = 0

      const data = orderBy(this.arr, ['value'], ['desc'])
      const length = data.length
      this.data = data.map((item, index) => {
        const per = 1 / length
        const opt = 1 - per * index
        this.total += parseInt(item.value)
        return {
          name: item.name,
          value: item.value,
          ratio: item.ratio,
          itemStyle: {
            color: this.colors[index],
          },
        }
      })
      this.initChart()

      // netComponentProportion({ status: this.status }).then((res) => {
      //   const data = orderBy(res.data.data, ['value'], ['desc'])
      //   const length = data.length
      //   this.data = data.map((item, index) => {
      //     const per = 1 / length
      //     const opt = 1 - per * index
      //     this.total += parseInt(item.value)
      //     return {
      //       name: item.name,
      //       value: item.value,
      //       ratio: item.ratio,
      //       itemStyle: {
      //         color: this.colors[index],
      //       },
      //     }
      //   })
      //   this.initChart()
      // })
    },
    initChart() {
      const nameList = this.data.map((item) => item.name)
      const total = this.total
      let myChart = this.myChart
      let option = {
        // tooltip: {
        //   show: true
        // },
        legend: {
          show: true,
          icon: 'circle',
          left: '45%',
          top: '5%',
          orient: 'vertical',
          data: nameList,
          textStyle: {
            fontSize: 13,
            lineHeight: 30,
            rich: {
              a: {
                width: 65,
              },
              b: {
                width: 35,
                padding: [0, 0, 0, 10],
              },
              c: {
                color: '#A9A9A9',
                padding: [0, 0, 0, 60],
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
              '{d| | }',
              '{b|' + ((count / total) * 100).toFixed(2) + '%' + '}',
              '{c|' + count + '}',
            ]
            return arr.join('')
          },
        },
        series: [
          {
            name: '隐患个数',
            type: 'pie',
            radius: ['40%', '30%'],
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
  top: 25%;

  .num {
    font-size: 26px;
    margin-top: 10px;
    font-weight: 800;
  }
}
</style>