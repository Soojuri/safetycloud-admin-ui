<!-- 首页设备告警信息 -->
<template>
  <div class="g-card">
    <div class="sub-tit">
      <span>设备告警信息</span>
      <!-- <i class="el-icon-more"></i> -->
    </div>
    <alarm-line></alarm-line>
  </div>
</template>

<script>
import AlarmLine from '../chart/alarm-line.vue'
import AlarmPie from '../chart/alarm-pie.vue'
//import {} from '';

export default {
  components: { AlarmLine, AlarmPie },
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  mounted () {

  },
  methods: {

  },
}
</script>
<style lang='scss' scoped>
@import "@/styles/variables.scss";
.sub-tit {
  @include g-tit-s;
  margin: 0;
  margin-bottom: 12px;
}
.g-card {
  margin-bottom: 0;
  margin-left: 6px;
  margin-right: 6px;
  width: calc(50% - 12px);
}
</style>
