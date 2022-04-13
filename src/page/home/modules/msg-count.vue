<!-- 上下行消息 -->
<template>
  <div class="g-card mt-m">
    <div class="sub-tit">
      <span>消息通信趋势</span>
    </div>
    <msg-line></msg-line>
  </div>
</template>

<script>
import MsgLine from '../chart/msg-line.vue'
//import {} from '';

export default {
  components: { MsgLine },
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
  @import '@/styles/variables.scss';
  .sub-tit{
    @include g-tit-s;
    margin: 0;
    margin-bottom: 12px;
  }
</style>
