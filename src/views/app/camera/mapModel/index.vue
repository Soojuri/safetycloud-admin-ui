
<template>
  <keep-alive>
    <component :is="currentComponent"></component>
  </keep-alive>
</template>

<script>
import { isVas } from '@/config/env'
export default {
  components: {
    AmapMap: () => import('./amap-map.vue'),
    GisMap: () => import('./gis-map.vue'),
  },
  data() {
    return {
      currentComponent: isVas ? 'GisMap' : 'AmapMap',
    }
  },
  computed: {},
  watch: {},
  mounted() {},
}
</script>
<style lang='scss' scoped>
</style>