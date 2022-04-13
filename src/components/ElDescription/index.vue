<template>
  <div class="descriptions">
    <div v-if="Boolean(title)" class="descriptions-title">{{ title }}</div>
    <div class="descriptions-view">
      <slot v-if="$slots.default" />
      <div v-else style="text-align: center; color: grey;">暂无数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElDescription',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.descriptions {
  .descriptions-title {
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 700;
    font-size: 16px;
    line-height: 1.5;
  }
  .descriptions-view {
    width: 100%;
    overflow: hidden;
    border-top: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
    border-radius: 4px;
    table {
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
    }
  }
}
</style>
