<template>
  <div class="db-rank__group">
    <div class="db-rank__item" v-for="(item,index) in data" :key="index">
      <template v-if="showIndex">
        <div class="index" v-if="showIndex">
          <span>Top{{index+1}}:</span>
        </div>
        <div class="db-rank__item__content">
          <label>{{item.name}}</label>
          <div class="db-rank__bar">
            <div class="db-rank__bar__thumb" :style="'width:'+resetVal(item.val)+'%'"></div>
            <div class="db-rank__bar__val" v-show="!hideVal">{{item.val}}</div>
          </div>
        </div>
      </template>
      <template v-else>
        <label>{{item.name}}</label>
        <div class="db-rank__bar">
          <div class="db-rank__bar__thumb" :style="'width:'+resetVal(item.val)+'%'"></div>
          <div class="db-rank__bar__val" v-show="!hideVal">{{item.val}}</div>
        </div>
      </template>
    </div>
    <div class="db-progressbar__wrap">
    </div>
  </div>
</template>

<script>
  export default{
    props:{
      showIndex:{
        type:Boolean,
        default:false
      },
      hideVal:{
        type:Boolean,
        default:false
      },
      data:{
        type:Array,
        default:()=>[],
      },
      maxValue:{
        type:Number,
        default:100
      }
    },
    data(){
      return{
        maxVal:-1,
      }
    },
    mounted(){
      this.maxVal=this.maxValue;
      if(this.maxVal==0){
        this.maxVal=1;
      }
      for(let i in this.data){
        this.maxVal=Math.max(this.data[i].val,this.maxVal);
      }
    },
    methods:{
      resetVal(_val){
        return Math.round(_val/this.maxVal*100);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/db-vars.scss';
  .db-rank__item{
    display: flex;
    align-items: center;
    white-space: nowrap;
    &:not(:first-child){
      margin-top: 6*$vw;
    }
    label{
      margin-right: 6*$vw;
      font-size: 14*$vw;
      color: #bfe7ff;
    }
  }
  .db-rank__bar{
    position: relative;
    box-sizing: border-box;
    flex: 1 1 0;
    padding: 2px;
    height: 14*$vw;
    background: fade-out(#189bf4,0.8);
    border-radius: 14*$vw;
  }
  .db-rank__bar__val{
    position: absolute;
    left: 8*$vw;
    top: 50%;
    font-size: 50*$vw;
    line-height: 80*$vw;
    transform-origin: left center;
    transform: translateY(-50%) scale(0.2);
  }
  .db-rank__bar__thumb{
    display: block;
    height: 100%;
    width: 0;
    background: linear-gradient(to right,#0163eb,#28c3fa);
    border-radius: 20*$vw;
    transition: width .8s ease;
  }
  .db-rank__item__content{
    flex: 1 1 0;
    display: flex;
    align-items: center;
  }
</style>
