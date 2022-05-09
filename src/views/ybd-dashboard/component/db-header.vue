<template>
  <div class="db-header">
    <div class="db-header__left">
      <div class="db-header__nav">
        <ul>
          <li @click="navChange(0)" :class="navIndex(0)"><span>煤矿企业安全</span></li>
          <li @click="navChange(1)" :class="navIndex(1)"><span>危险化学品企业安全</span></li>
        </ul>
      </div>
    </div>
    <div class="db-header__title">
      <h1>云边端一体化安全监管平台</h1>
      <div class="time">
        <span>2022-04-11 14:33:21 星期一</span>
      </div>
    </div>
    <div class="db-header__right">
      <div class="db-header__nav">
        <ul>
          <li @click="navChange(2)" :class="navIndex(2)"><span>安全生产大数据</span></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    index: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    navIndex(_id) {
      return _id == this.index ? 'active' : ''
    },
    navChange(_id) {
      this.index = _id
      if (_id === 0) {
        this.$router.push('/coal')
      }
      if (_id === 1) {
        this.$router.push('/chemical')
      }
      if (_id === 2) {
        this.$router.push('/safe-prod')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../style/db-vars.scss';
.db-header {
  z-index: 2;
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-bottom: -34 * $vw;
  height: 130 * $vw;
}
.db-header__left,
.db-header__right {
  position: relative;
  display: flex;
  align-items: flex-start;
  flex: 1 1 0;
  height: 100%;
}
.db-header__left::before,
.db-header__right::after {
  content: '';
  display: block;
  height: 100%;
  flex: 1 1 0;
  background: url('#{$img-url}db-top-bg-lr.png') repeat-x 0 0;
  background-size: auto 100%;
}
.db-header__left::after,
.db-header__right::before {
  content: '';
  display: block;
  height: 100%;
  flex: 0 0 260 * $vw;
  background: url('#{$img-url}db-top-bg-m-lr.png') repeat-x 0 0;
  background-size: auto 100%;
}
.db-header__right::before {
  transform: scaleX(-1);
}
.db-header__title {
  position: relative;
  height: 100%;
  margin-left: -1px;
  margin-right: -1px;
  flex: 0 0 auto;
  background: url('#{$img-url}db-top-bg-middle.png') repeat-x 0 0;
  background-size: auto 100%;
  h1 {
    @include linear-text(#b3feff, #00fcff);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 94 * $vw;
    white-space: nowrap;
    text-align: center;
    font-weight: bold;
    filter: drop-shadow(0px 3px 7px #000);
  }
  .time {
    position: absolute;
    left: -20 * $vw;
    right: -20 * $vw;
    top: 94 * $vw;
    height: 34 * $vw;
    font-size: 20 * $vw;
    text-align: center;
    white-space: nowrap;
    color: $db-primary-color;
    line-height: 34 * $vw;
    perspective: 300px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 180%;
      transform-style: preserve-3d;
      transform-origin: top center;
      transform: rotateX(305deg);
      background: linear-gradient(to bottom, fade-out(#007aff, 1), fade-out(#007aff, 0.5));
    }
    &::after {
      content: '';
      position: absolute;
      left: 28 * $vw;
      right: 28 * $vw;
      bottom: 0;
      height: 4 * $vw;
      background: #007aff;
    }
    span {
      z-index: 1;
      display: block;
      position: relative;
    }
  }
}
.db-header__nav {
  position: absolute;
  top: 32 * $vw;
  width: calc(100% - 280 *#{$vw});
  margin-top: -20 * $vw;
  line-height: 38 * $vw;
  ul {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
  li {
    box-sizing: border-box;
    display: block;
    flex: 0 0 auto;
    margin-right: 15 * $vw;
    padding: 0 16 * $vw;
    width: calc(50% - 15 *#{$vw});
    font-size: 18 * $vw;
    color: #fff;
    text-align: center;
    background: fade-out(#2862f0, 0.5);
    box-shadow: 0 0 0 1px #4891f5;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.5s ease;
    &.active,
    &:hover {
      color: #000928;
      box-shadow: 0 0 0 1px #00fcff;
      background: #00fcff;
    }
  }
}
.db-header__left {
  .db-header__nav {
    left: 48 * $vw;
  }
}
.db-header__right {
  .db-header__nav {
    right: 33 * $vw;
  }
}
</style>
