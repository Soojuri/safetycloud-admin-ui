<template>
  <div class="pie-wrap">
    <div ref="chart" class="canvas-wrap"></div>
    <div class="pie-data">
      <b>5.20<small>万</small></b>
      <span>企业总数</span>
    </div>
  </div>
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
            value: 1621,
            name: '生产企业'
          },
          {
            value: 1334,
            name: '经营企业'
          },
          {
            value: 2072,
            name: '储存企业'
          },
          {
            value: 775,
            name: '使用企业'
          },
          {
            value: 1168,
            name: '运输企业'
          },
          {
            value: 4300,
            name: '回收处置'
          }
        ];
        let option = {
          legend:{
            right:'0%',
            top: 'center',
            orient: 'vertical',
            formatter: function(name) {
                // 获取legend显示内容
                let data = option.series[0].data;
                let tarValue = 0;
                for (let i = 0, l = data.length; i < l; i++) {
                    if (data[i].name == name) {
                        tarValue = data[i].value;
                    }
                }
                return `{name|${name}}  {value|${tarValue}}  家`;
            },
            textStyle:{
              color: '#fff',
              fontSize: 16,
              rich:{
                name:{
                  fontSize:16,
                },
                value:{
                  fontSize:16,
                  color: '#00fcff'
                }
              },
            }
          },
          series: [{
            type: 'pie',
            radius: ['45%', '60%'],
            center: ["30%", "50%"],
            avoidLabelOverlap: true,
            color: [ '#27a0fd','#464af3','#ff854d','#ac46f3'],
            label: {
              formatter: '{d}%',
              textStyle:{
                fontSize:16
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
<style lang='scss' scoped>
  .pie-wrap{
    position: relative;
    height: 100%;
  }
  .pie-data{
    $vw: 100vw/1920;
    position: absolute;
    left: 30%;
    top: 50%;
    white-space: nowrap;
    font-size: 16*$vw;
    color: white;
    text-align: center;
    transform: translate(-50%,-50%);
    b{
      display: block;
      color: #17e6ff;
      font-weight: normal;
      font-size: 32*$vw;
      small{
        font-size: 14*$vw;
      }
    }
  }
</style>
