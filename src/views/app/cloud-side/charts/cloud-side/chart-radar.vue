<template>
  <div class="radar" ref="chart" :style="{ height: '100%', width: '100%' }"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      var myChart = echarts.init(this.$refs.chart)
      var option = {
        color: ['#198FFE', '#EF9E25', '#E05A18'],
        // title: {
        //   text: 'Basic Radar Chart',
        // },
        legend: {
          data: ['已处理', '未处理', '不处理'],
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '巡检', max: 6500 },
            { name: '隐患', max: 16000 },
            { name: '事件', max: 30000 },
            { name: '作业', max: 52000 },
            { name: '风险', max: 25000 },
          ],
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 50000, 18000],
                name: '已处理',
                areaStyle: {
                  color: '#EAF3FC',
                },
              },
              {
                value: [5000, 14000, 28000, 42000, 21000],
                name: '未处理',
                areaStyle: {
                  color: '#FBF3E8',
                },
              },
              {
                value: [2000, 3000, 5000, 4000, 11800],
                name: '不处理',
                areaStyle: {
                  color: '#F9ECE6',
                },
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
.radar {
  height: 100%;
  width: 100%;
}
</style>
