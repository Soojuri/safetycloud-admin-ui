<template>
  <div class="db-box">
    <div class="db-box__title" :class="hideTitle?'db-box__title--hidden':''">
      <span>{{title}}</span>
      <div class="db-box__title__right"></div>
      <div class="db-box__title__border"></div>
    </div>
    <div class="db-box_content_shape">
      <div class="shapes"></div>
    </div>
    <div class="db-box__content">
      <slot name="default">

      </slot>
    </div>
  </div>
</template>

<script>
  export default{
    props:{
      hideTitle:{
        type:Boolean,
        default:false
      },
      title:{
        type:String,
        default: '默认标题'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/db-vars.scss';
  .db-box{
    position: relative;
    display: flex;
    margin-bottom: 16*$vw;
    flex-direction: column;
  }
  .db-box_content_shape{
    @include borders-card();
    position: absolute;
    left: 0;
    right: 0;
    top: calc(36*#{$vw} + 13px);
    bottom: 0;
    pointer-events: none;
  }
  .db-box__title{
    display: flex;
    position: relative;
    align-items: flex-end;
    margin-bottom: 4*$vw;
    padding-bottom: 13px;
    &>span{
      position: relative;
      display: block;
      padding-left: 20*$vw;
      margin-right: 16*$vw;
      font-size: 24*$vw;
      line-height: 32*$vw;
      white-space: nowrap;
      &::before{
        content: "";
        position: absolute;
        left: 0;
        bottom: 4*$vw;
        width: 4*$vw;
        height: 11*$vw;
        background: $db-primary-color;
      }
    }
  }
  .db-box__title--hidden{
    opacity: 0;
    pointer-events: none;
  }
  .db-box__title__border{
    position: absolute;
    display: flex;
    align-items: flex-end;
    bottom: 0;
    left: 0;
    right: 0;
    &::before{
      content: "";
      display: block;
      width: 164*$vw;
      height: 8px;
      background: url('#{$img-url}db-box-b-l.png') no-repeat 0 0;
    }
    &::after{
      content: "";
      display: block;
      flex: 1 1 0;
      height: 8px;
      background: url('#{$img-url}db-box-b-r.png') no-repeat 0 0;
    }
  }
  .db-box__title__right{
    position: relative;
    display: flex;
    flex: 1 1 0;
    height: 10px;
    overflow: hidden;
    &::before,&::after{
      content: "";
      display: block;
      height: 100%;
    }
    &::before{
      flex: 1 1 0;
      background: url('#{$img-url}db-title-r-l.png') repeat-x right top;
    }
    &::after{
      flex: 0 0 39px;
      background: url('#{$img-url}db-title-r-r.png') no-repeat 0 0;
    }
  }
  .db-box__content{
    z-index: 1;
    @include scrollbar();
    position: relative;
    flex: 1 1 0;
    padding: 20*$vw;
  }
</style>
