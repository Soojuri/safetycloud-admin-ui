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
            value: 90,
            name: '一般'
          },
          {
            value: 10,
            name: '重大'
          }
        ];
        let option = {
          title: {
            text: '隐患级别占比',
            left: 'center',
            bottom: '0',
            textStyle:{
              color: '#fff',
              fontSize: '18',
              fontWeight: 'normal',
            }
          },
          series: [{
            type: 'pie',
            radius: ['0%', '50%'],
            center: ["50%", "45%"],
            avoidLabelOverlap: false,
            color: [ '#27a0fd','#f03819'],
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

            labelLine: {
              length: 15,
              length2: 40,
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