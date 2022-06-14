<template>
  <div class="dial" ref="chart"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {},
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      var myChart = echarts.init(this.$refs.chart)
      var option = {
        // title: [
        //   {
        //     text: '完成率',
        //     bottom: '0',
        //     x: 'center',
        //     borderColor: '#2593fc',
        //     backgroundColor: '#2593fc',
        //     borderWidth: 1,
        //     borderRadius: 15,
        //     padding: [0, 30],
        //     textStyle: {
        //       lineHeight: 36,
        //       fontWeight: 'normal',
        //       fontSize: 18,
        //       color: '#fff',
        //     },
        //   },
        // ],
        angleAxis: {
          show: false,
          max: (100 * 360) / 360, //-45度到225度，二者偏移值是270度除360度
          type: 'value',
          startAngle: 0, //极坐标初始角度
          splitLine: {
            show: false,
          },
        },
        barMaxWidth: 18, //圆环宽度
        radiusAxis: {
          show: false,
          type: 'category',
        },
        //圆环位置和大小
        polar: {
          center: ['50%', '50%'],
          radius: '100',
        },
        series: [
          {
            type: 'bar',
            data: [
              {
                //上层圆环，显示数据
                value: 75,
                itemStyle: {
                  color: {
                    //图形渐变颜色方法，四个数字分别代表，右，下，左，上，offset表示0%到100%
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1, //从左到右 0-1
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#F3B017',
                      },
                      {
                        offset: 1,
                        color: '#EFCF36',
                      },
                    ],
                  },
                },
              },
            ],
            barGap: '-100%', //柱间距离,上下两层圆环重合
            coordinateSystem: 'polar',
            roundCap: true, //顶端圆角从 v4.5.0 开始支持
            z: 2, //圆环层级，同zindex
          },
          {
            //下层圆环，显示最大值
            type: 'bar',
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#eff2f5',
                },
              },
            ],
            barGap: '-100%',
            coordinateSystem: 'polar',
            roundCap: true,
            z: 1,
          },
          //仪表盘
          {
            name: 'AQI',
            type: 'gauge',
            startAngle: 225, //起始角度，同极坐标
            endAngle: -45, //终止角度，同极坐标
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            splitLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            title: {
              offsetCenter: [-10, 0],
              color: '#333',
              fontSize: 24,
              fontWeight: 700,
              rich: {
                a: {
                  fontWeight: 'normal',
                  fontSize: 16,
                  color: '#FFF',
                  padding: [0, 0, 10, 40],
                },
              },
            },
            detail: {
              formatter: function (e) {
                return '%'
              },
              color: '#333',
              fontSize: 24,
              offsetCenter: [15, 0],
            },
            data: [
              {
                value: 98.6,
                name: 98,
              },
            ],
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

<style>
.dial {
  height: 100%;
}
</style>
