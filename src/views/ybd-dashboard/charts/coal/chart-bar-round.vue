<template>
  <div ref="chart" class="g-full-chart" />
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
        const BarBottom = echarts.graphic.extendShape({
          shape: {
            x: 0,
            y: 0,
          },
          buildPath: function(ctx, shape) {
            const xAxisPoint = shape.xAxisPoint;
            const c1 = [shape.x - 12, shape.y];
            const c2 = [xAxisPoint[0] - 12, xAxisPoint[1]];
            const c3 = [xAxisPoint[0] + 12, xAxisPoint[1]];
            const c4 = [shape.x + 12, shape.y];
            ctx.moveTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath();
          },
        });
        const VALUE = [2000, 1600, 1000, 1400, 4000, 3500, 1800,2600,3000];

        echarts.graphic.registerShape('BarBottom', BarBottom);
        let myChart = echarts.init(this.$refs.chart);
        let option = {
          grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            top: '5%',
            containLabel: true,
          },
          itemStyle: {
            barBorderRadius: [20, 20, 0, 0]
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
            data: ['泉州市', '福州市', '莆田市', '厦门市', '龙岩市', '漳州市', '宁德市','南平市','三明市']
          },
          yAxis: {
            backgroundColor: 'transparent',
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
          series: [{
              type: 'custom',
              renderItem: (params, api) => {
                const location = api.coord([api.value(0), api.value(1)]);
                return {
                  type: 'group',
                  children: [{
                    type: 'BarBottom',
                    shape: {
                      api,
                      xValue: api.value(0),
                      yValue: api.value(1),
                      x: location[0],
                      y: location[1],
                      xAxisPoint: api.coord([api.value(0), 0]),
                    },
                    style: {
                      fill: this.vLinear('#0163eb', '#28c3fa'),
                    },
                  }, ],
                };
              },
              data: VALUE,
            },
            {
              name: '上部圆',
              type: 'pictorialBar',
              silent: true,
              symbolSize: [24, 5],
              symbolOffset: [0, -2.5],
              symbolPosition: 'end',
              z: 12,
              color: this.vLinear('#1595f3', '#1595f3'),
              data: VALUE,
            }
          ],
        }
        option && myChart.setOption(option)
        window.addEventListener("resize", () => {
          myChart.resize()
        })

      },
    },
  }
</script>