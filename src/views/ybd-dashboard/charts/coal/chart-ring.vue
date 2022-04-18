<template>
  <div ref="chart" class="canvas-wrap"></div>
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
      const pieData = [
        {
          value: 242,
          name: '特大矿井',
        },
        {
          value: 1836,
          name: '大型矿井',
        },
        {
          value: 1620,
          name: '中型矿井',
        },
        {
          value: 915,
          name: '小型矿井',
        },
      ]
      let option = {
        series: [
          {
            type: 'pie',
            radius: ['15%', '40%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            color: ['#27a0fd', '#464af3', '#ff854d', '#ac46f3'],
            align: 'edge',
            roseType: 'area',
            itemStyle: {
              borderRadius: 8,
            },
            label: {
              formatter: '{name|{c}}\n{value|{b}}',
              rich: {
                name: {
                  fontSize: 14,
                  lineHeight: 20,
                },
                value: {
                  fontSize: 14,
                  color: '#fff',
                  lineHeight: 20,
                },
              },
            },
            data: pieData,
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