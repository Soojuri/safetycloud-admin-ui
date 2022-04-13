<!-- 首页顶部卡片 -->
<template>
  <div class="statistic-cols mb-m">
    <div class="g-card top1">
      <img :src="require('@/assets/images/home/home1_icon.png')" />
      <div class="ml-m">
        <div class="card_num">{{formatNumber(deviceCountInfo.createDeviceNum)}}</div>
        <div class="card_title">
          <span>累计创建设备数</span>
        </div>
      </div>
    </div>
    <div class="g-card top2">
      <img :src="require('@/assets/images/home/home2_icon.png')" />
      <div class="ml-m">
        <div class="card_num">{{formatNumber(deviceCountInfo.activeDeviceNum)}}</div>
        <div class="card_title">
          <span>累计激活设备数</span>
        </div>
      </div>
    </div>
    <div class="g-card top3">
      <img :src="require('@/assets/images/home/home3_icon.png')" />
      <div class="ml-m">
        <div class="card_num">{{formatNumber(deviceCountInfo.onlineNum)}}</div>
        <div class="card_title">
          <span>当前在线设备数</span>
        </div>
      </div>
    </div>
    <div class="g-card top4">
      <img :src="require('@/assets/images/home/home4_icon.png')" />
      <div class="ml-m">
        <div class="card_num">{{formatNumber(deviceCountInfo.liveNum)}}</div>
        <div class="card_title">
          <span>物联网设备活跃数</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { homeStastics, getProductStatistics } from '@/api/statistics/home'

export default {
  components: {
    'online-device': () => import('../chart/online-device.vue'),
    'process-bar': () => import('../chart/process-bar.vue'),
  },
  data() {
    return {
      deviceCountInfo: {},
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      homeStastics().then((res) => {
        this.deviceCountInfo = res.data.data
      })
    },
    formatNumber(num = 0) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    GetPercent(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0' : Math.round((num / total) * 10000) / 100.0
    },
  },
}
</script>
<style lang='scss' scoped>
.top1 {
  background-image: linear-gradient(to top, #118ced 0%, #33bdf6 100%);
}
.top2 {
  background-image: linear-gradient(to top, #1fb9bc 0%, #54d8e0 100%);
}
.top3 {
  background-image: linear-gradient(to top, #efa71e 0%, #f1cf47 100%);
}
.top4 {
  background-image: linear-gradient(to top, #ed782e 0%, #f4a05c 100%);
}
@import '@/styles/variables.scss';
.statistic-cols {
  color: #fff;
  display: flex;
  align-items: stretch;
  .g-card {
    display: flex;
    flex-direction: row;
    // justify-content: space-between;
    flex: 1 1 0;
    margin-left: 12px;
    padding: 20px;
    margin-bottom: 0;
    &:first-child {
      margin-left: 0;
    }
    img {
      height: 60px;
      width: 60px;
    }
  }
  .card-data {
    height: 50px;
  }
  .card_title {
    font-size: 14px;
  }
  .card_num {
    font-size: 32px;
    font-weight: 800;
  }
  .cus-icon-arrow-up-solid {
    color: $--color-danger;
  }
  .cus-icon-arrow-down-solid {
    color: $--color-success;
  }
  .card_bottom {
    display: flex;
    margin-bottom: -12px;
    height: 48px;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    border-top: solid 1px $--border-color-base;
  }
}
</style>
