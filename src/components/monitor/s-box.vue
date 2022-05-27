<template>
  <div class="s-box" :class="isCollapse?'min':''">
    <div class="s-box__tit" v-if="title!=''">
      <span>{{title}}</span>
      <div class="s-box__tit__append">
        <slot name="title-append"></slot>
      </div>
      <div class="icon-collapse" @click="isCollapse=isCollapse?false:true"></div>
    </div>
    <div class="s-box__content">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isCollapse: false,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
$img-url: '/img/ybd-monitor/';

@font-face {
  font-family: monitor-icon;
  src: url('#{$img-url}icon.ttf');
}

.s-box {
  @include scrollbar();
  position: relative;
  background: $--color-white;
  border-radius: 6 * $vw;
  box-shadow: 0 2px 6px #cbcbcb;
  overflow-x: hidden;

  &:not(:last-child) {
    margin-bottom: 12 * $vw;
  }

  &.f1 {
    display: flex;
    flex-direction: column;
    width: 100%;

    .s-box__content {
      @include scrollbar();
      flex: 1 1 0;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }

  &.min {
    flex: 0 0 auto;
    box-sizing: content-box;
    width: 56 * $vw !important;
    min-width: 0 !important;
  }

  &.min .s-box__tit {
    position: relative;
    display: block;
    padding-top: 36 * $vw;
    padding-bottom: 12 * $vw;
    & > span {
      display: block;
      margin-left: auto;
      margin-right: auto;
      padding-left: 0;
      width: 1em;
      word-break: break-all;

      &::before {
        content: none;
      }
    }

    .icon-collapse {
      position: absolute;
      left: 50%;
      top: 0;
      margin-left: 0;
      margin-left: -14 * $vw;
      width: 28 * $vw;
      text-align: center;
      line-height: 28 * $vw;
      transform: scaleX(-1);
    }
  }

  &.min .s-box__tit__append {
    display: none;
  }

  &.min .s-box__content {
    display: none;
  }
}

.s-box__tit {
  display: flex;
  align-items: center;
  margin: 16 * $vw;
  margin-bottom: 0;

  & > span {
    position: relative;
    flex: 1 1 0;
    padding-left: 16 * $vw;
    font-size: 20 * $vw;
    line-height: 24 * $vw;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 1 * $vw;
      left: 0;
      width: 4 * $vw;
      height: 22 * $vw;
      background: $--color-primary;
      border-radius: 4 * $vw;
    }
  }

  .icon-collapse {
    position: relative;
    margin-left: 16 * $vw;
    font-size: 20 * $vw;
    color: #4c4c4c;
    cursor: pointer;

    &:hover {
      color: $--color-primary;
    }

    &::before {
      content: '\e903';
      font-family: monitor-icon;
      vertical-align: top;
    }
  }
}

.s-box__tit__append {
  white-space: nowrap;
}

.s-box__content {
  position: relative;
  padding: 16 * $vw;
  margin-top: 8 * $vw;
}
</style>
