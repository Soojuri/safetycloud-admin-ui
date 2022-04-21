<template>
  <div ref="chart" :style="{ height: '100%', width: '100%' }" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  components: {},
  data() {
    return {
      chart: null,
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return []
      },
    },
  },
  computed: {},
  watch: {
    data(val) {
      this.initChart()
    },
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart)
        window.addEventListener('resize', () => {
          this.chart.resize()
        })
      }
      let option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          icon: 'rect',
          itemGap: 40,
          itemWidth: 30,
          data: ['智能识别数量', '人工审核数量', '通过上报数量'],
          top: '20',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval: 0,
          },
          axisLine: { show: true },
          axisTick: { show: false },
          data: this.data.map((item) => item.time),
        },
        yAxis: {
          axisLine: { show: true },
          show: true,
        },
        series: [
          {
            name: '智能识别数量',
            itemStyle: {
              color: '#fc8e13',
            },
            type: 'line',
            data: this.data.map((item) => item.intelligentIdentificationCount),
          },
          {
            name: '人工审核数量',
            type: 'line',

            itemStyle: {
              color: '#30b789',
            },
            data: this.data.map((item) => item.manualAuditCount),
          },
          {
            name: '通过上报数量',
            type: 'line',
            itemStyle: {
              color: '#2593fc',
            },
            data: this.data.map((item) => item.reportCount),
          },
        ],
      }
      option && this.chart.setOption(option)
    },
  },
}
</script>
<style lang='scss' scoped>
</style>