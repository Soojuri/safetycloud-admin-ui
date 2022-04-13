<!--  -->
<template>
  <div class="app_container">
    <top-card></top-card>
    <device-statistics></device-statistics>
    <div class="col-lr">
        <device-alarm></device-alarm>
        <net-comp></net-comp>
    </div>
    <msg-count></msg-count>
  </div>
</template>

<script>

import resize from '@/mixins/resize'
import TopCard from './modules/top-card.vue'
import DeviceStatistics from './modules/device-statistics.vue'
import DeviceAlarm from './modules/device-alarm.vue'
import NetComp from './modules/net-comp.vue'
import MsgCount from './modules/msg-count.vue'
export default {
  mixins: [resize],
  components: {
    TopCard,
    DeviceStatistics,
    DeviceAlarm,
    NetComp,
    MsgCount
  },
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  mounted () {

  },
  methods: {

    handleClick () { }
  }
}
</script>
<style lang="scss" scoped>
  .col-lr{
    display: flex;
    align-items: stretch;
    margin-left: -6px;
    margin-right: -6px;
  }
</style>
