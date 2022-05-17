<template>
  <div ref="chart" class="canvas-wrap"></div>
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
        let myChart = echarts.init(this.$refs.chart);
        const pieData = [{
            value: 242,
            name: '未评级'
          },
          {
            value: 1620,
            name: '一级'
          },
          {
            value: 1836,
            name: '二级'
          },
          {
            value: 915,
            name: '三级'
          }
        ];
        let option = {
          series: [{
            type: 'pie',
            radius: ['0%', '50%'],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            color: [ '#27a0fd','#ff854d','#464af3','#46d4f3'],
            label: {
              alignTo: 'edge',
              formatter: '{name|{c}%}\n{value|{b}}',
              alignTo: 'middle',
              margin: 15,
              rich: {
                name: {
                  fontSize: 16,
                },
                value: {
                  fontSize: 12,
                  color: '#fff'
                }
              }
            },
            data: pieData
          }]
        }
        option && myChart.setOption(option)
        window.addEventListener("resize", () => {
          myChart.resize()
        })

      },
    },
  }
</script>

<style lang="scss" scoped>
  .canvas-wrap{
    height: 100%;
  }
</style>