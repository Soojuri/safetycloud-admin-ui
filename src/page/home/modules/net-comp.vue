<!-- 首页网络组件 -->
<template>
  <div class="g-card">
    <div class="sub-tit">
      <span>网络组件类别占比</span>
      <!-- <i class="el-icon-more fr"></i> -->
    </div>
    <el-radio-group v-model="status" class="mt10">
      <el-radio-button label="">全部状态</el-radio-button>
      <el-radio-button label="1">启动状态</el-radio-button>
      <el-radio-button label="0">停止状态</el-radio-button>
    </el-radio-group>
    <net-pie :status='status'></net-pie>
  </div>
</template>

<script>
import NetPie from '../chart/net-pie.vue'
//import {} from '';

export default {
  components: { NetPie },
  data() {
    return {
      status: '',
    }
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
}
</script>
<style lang='scss' scoped>
@import '@/styles/variables.scss';
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
