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
          value: 15,
          name: '已完成',
        },
        {
          value: 55,
          name: '未完成',
        },
        {
          value: 30,
          name: '进行中',
        },
      ]
      let option = {
        title: {
          text: '隐患整改情况',
          left: 'center',
          bottom: '0',
          textStyle: {
            color: '#fff',
            fontSize: '18',
            fontWeight: 'normal',
          },
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '50%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            color: ['#27a0fd', '#ff854d', '#464af3'],
            label: {
              alignTo: 'edge',
              formatter: '{name|{c}%}\n{value|{b}}',
              alignTo: 'middle',
              margin: 15,
              rich: {
                name: {
                  fontSize: 18,
                },
                value: {
                  fontSize: 14,
                  color: '#fff',
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