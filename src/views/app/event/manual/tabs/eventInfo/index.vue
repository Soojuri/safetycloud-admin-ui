<!-- 事件信息 -->
<template>
  <div class="clearfix">
    <div>
      <span class="ft16">事件信息</span>
    </div>
    <div>
      <el-description class="mt-xl">
        <el-description-item label="算法类别" :value="formatAlgorithmType(info)" :span="8" />
        <el-description-item label="事件名称" :value="info.eventName" :span="8" />
        <el-description-item label="发现时间" :value="parseTime(info.createTime)" :span="8" />
        <el-description-item label="事件等级" :value="eventLevel" :span="8" />
        <el-description-item label="处理时间" :value="parseTime(info.eventHandleTime)" :span="8" />
        <el-description-item label="备注" :value="info.remark" :span="8" />
      </el-description>
    </div>
    <div class="mt-xl">
      <span class="ft16">事件进度</span>
    </div>
    <div class="step">
      <el-steps :active="info.eventProgress" finish-status="success">
        <el-step title="事件发现" :description="parseTime(info.eventDetectTime)"></el-step>
        <el-step title="事件处理" :description="parseTime(info.eventHandleTime)"></el-step>
        <el-step v-if="info.eventProgress !== 4 || info.eventCheckTime != null" title="事件复核"
                 :description="parseTime(info.eventCheckTime)">
        </el-step>
        <el-step title="完成" :description="parseTime(info.eventSubmitTime)"></el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import ElDescription from '@/components/ElDescription'
import ElDescriptionItem from '@/components/ElDescriptionItem'
export default {
  components: {
    ElDescription,
    ElDescriptionItem,
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      },
    },
    dict: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},

  mounted() {},

  methods: {
    formatAlgorithmType(row) {
      return this.selectDictLabel(this.dict.algorithmType, row.algorithmType)
    },
  },
}
</script>
<style lang='scss' scoped>
.label {
  width: 120px;
}
.step {
  width: 800px;
  display: inline-block;
  margin: 50px 0px;
  margin-left: -400px;
  position: relative;
  left: 50%;
}
</style>