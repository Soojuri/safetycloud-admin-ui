<template>
  <div class="sub-page">
    <div class="main-box">
      <div class="card-box head">
        <div class="left">
          <div class="user-img">
            <img src="@/assets/images/cloud-side/picture.png" alt="" />
            <div class="userAvatar">
              <i class="cs-icon-man">
                <!-- <img src="~@/../public/img/bg/star-squashed.jpg" alt=""> -->
              </i>
              <span>管理员</span>
            </div>
          </div>
          <dl>
            <dt>早安，祝你开心每一天！</dt>
            <dd>管理员</dd>
          </dl>
        </div>
        <ul class="right">
          <li>
            <i class="cs-icon-letter"></i>
            <dl>
              <dt>300</dt>
              <dd>未读消息</dd>
            </dl>
          </li>
          <li>
            <i class="cs-icon-dclrw green-bg"></i>
            <dl>
              <dt>300</dt>
              <dd>待处理任务</dd>
            </dl>
          </li>
          <li>
            <i class="cs-icon-sjbjs orange-bg"></i>
            <dl>
              <dt>70</dt>
              <dd>事件报警数</dd>
            </dl>
          </li>
        </ul>
      </div>
      <div class="cards-group">
        <div class="col-left">
          <div class="card-box">
            <div class="title">
              <h3>进行中的事项</h3>
              <span>全部事项></span>
            </div>
            <ul class="list-1">
              <li>
                <div class="up">
                  <h4><i class="cs-icon-wdfxy"></i>我的风险源</h4>
                  <p>统计图像中的人体个数和流动趋势，以头肩为主要识别目标统计人数。</p>
                </div>
                <div class="down">
                  <span>科学搬砖组</span>
                  <span class="blue">17分钟前</span>
                </div>
              </li>
              <li>
                <div class="up">
                  <h4><i class="cs-icon-wdyh red-bg"></i>我的隐患</h4>
                  <p>统计图像中的人体个数和流动趋势，以头肩为主要识别目标统计人数。</p>
                </div>
                <div class="down">
                  <span>科学搬砖组</span>
                  <span class="blue">17分钟前</span>
                </div>
              </li>
              <li>
                <div class="up">
                  <h4><i class="cs-icon-wdjc blue-bg"></i>我的检查</h4>
                  <p>统计图像中的人体个数和流动趋势，以头肩为主要识别目标统计人数。</p>
                </div>
                <div class="down">
                  <span>科学搬砖组</span>
                  <span class="blue">17分钟前</span>
                </div>
              </li>
              <li>
                <div class="up">
                  <h4><i class="cs-icon-wdzy green-bg"></i>我的作业</h4>
                  <p>统计图像中的人体个数和流动趋势，以头肩为主要识别目标统计人数。</p>
                </div>
                <div class="down">
                  <span>科学搬砖组</span>
                  <span class="blue">17分钟前</span>
                </div>
              </li>
              <li>
                <div class="up">
                  <h4><i class="cs-icon-pxks deep-green-bg"></i>培训考试</h4>
                  <p>统计图像中的人体个数和流动趋势，以头肩为主要识别目标统计人数。</p>
                </div>
                <div class="down">
                  <span>科学搬砖组</span>
                  <span class="blue">17分钟前</span>
                </div>
              </li>
              <li>
                <div class="up">
                  <h4><i class="cs-icon-wdrw yellow-bg"></i>我的任务</h4>
                  <p>统计图像中的人体个数和流动趋势，以头肩为主要识别目标统计人数。</p>
                </div>
                <div class="down">
                  <span>科学搬砖组</span>
                  <span class="blue">17分钟前</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="card-box">
            <div class="title">
              <h3>消息动态</h3>
            </div>
            <ul class="list-2">
              <li v-for="(item,index) in 6" :key="index">
                <span class="cs-icon-flag"></span>
                <dl>
                  <dt>南威科技园西门入口发生了<i>占用消防通道事件，请及时处理</i></dt>
                  <dd>2022-05-07 14:20:36</dd>
                </dl>
              </li>
            </ul>
          </div>
        </div>

        <div class="col-right">
          <div class="card-box">
            <div class="title">
              <h3>快捷导航</h3>
              <span class="cs-icon-add">添加</span>
            </div>
            <ul class="list-3">
              <li class="cs-icon-sbgl"><span>设备管理</span></li>
              <li class="cs-icon-bjsj red-lg-bg"><span>报警事件</span></li>
              <li class="cs-icon-spzs tint-blue-lg-bg"><span>视频展示</span></li>
              <li class="cs-icon-yhgl yellow-lg-bg"><span>隐患管理</span></li>
              <li class="cs-icon-fxqd deep-blue-lg-bg"><span>风险清单</span></li>
              <li class="cs-icon-zyxk green-lg-bg"><span>作业许可</span></li>
            </ul>
          </div>

          <div class="card-box f1">
            <div class="title">
              <h3>安全生产指数</h3>
            </div>
            <div class="echart-x">
              <!-- <chart-ring></chart-ring> -->
            </div>
          </div>

          <div class="card-box">
            <div class="title">
              <h3>安全知识库</h3>
            </div>
            <ul class="list-2 other">
              <li>
                <span class="cs-icon-yjzj"></span>
                <dl>
                  <dt>应急专家信息库</dt>
                </dl>
              </li>
              <li>
                <span class="cs-icon-zyws green-bg"></span>
                <dl>
                  <dt>职业卫生监管信息库</dt>
                </dl>
              </li>
              <li>
                <span class="cs-icon-hyaq yellow-bg"></span>
                <dl>
                  <dt>行业安全知识库</dt>
                </dl>
              </li>
              <li>
                <span class="cs-icon-aqsc blue-bg"></span>
                <dl>
                  <dt>安全生产行政许可与执法信息库</dt>
                </dl>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chartRing from './charts/chemical/chart-ring.vue'
export default {
  components: {
    chartRing,
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
@import './styles/icon-font.css';
h2,
h3,
h4,
dl,
dt,
dd,
ul,
li {
  margin: 0;
  padding: 0;
}
li {
  list-style-type: none;
}
i {
  font-style: normal;
}
$vw: 100vw/1920;
.main-box {
  padding: 16 * $vw;
  border-radius: 3 * $vw;
  background-color: #fff;
}
.card-box {
  height: 100%;
  background-color: #ffffff;
  box-shadow: 0 * $vw 1 * $vw 3 * $vw 0 * $vw #cbcbcb;
  border-radius: 6 * $vw;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    flex: 0.5 0 0;
    display: flex;
    align-items: center;
    background-color: #fefefe;
    dl {
      flex: 1 0 0;
      font-size: 22 * $vw;
      color: #333;
      dd {
        padding: 6 * $vw 0;
        font-size: 16 * $vw;
        color: #666;
      }
    }
  }
  .right {
    flex: 0.7 0 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 16 * $vw;
    color: #333;
    li {
      display: flex;
      align-items: center;
      margin-right: 40 * $vw;
    }
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 60 * $vw;
      height: 60 * $vw;
      margin-right: 16 * $vw;
      border-radius: 50%;
      background-image: linear-gradient(0deg, #13a3ff 0%, #4dd0f1 100%);
      &::before {
        font-size: 38 * $vw;
        color: #fff;
      }
      &.green-bg {
        background-image: linear-gradient(0deg, #16be9c 0%, #2be4a5 100%);
      }
      &.orange-bg {
        background-image: linear-gradient(0deg, #ee9828 0%, #f3ac1e 50%, #f8bf14 100%);
      }
    }
    dl {
      flex-shrink: 0;
    }
    dt {
      font-size: 30 * $vw;
    }
  }
  .user-img {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 148 * $vw;
    margin-right: 20 * $vw;
    img {
      display: block;
      width: 100%;
    }
    .userAvatar {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      flex-direction: column;
    }
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80 * $vw;
      height: 80 * $vw;
      background-image: linear-gradient(0deg, #0d82f2 0%, #42c3ff 99%);
      border: solid 2px #ffffff;
      border-radius: 100%;
      box-sizing: border-box;
      overflow: hidden;
      &::before {
        text-align: center;
        font-size: 44 * $vw;
        color: #fff;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    span {
      margin-top: -22 * $vw;
      padding: 2 * $vw 16 * $vw;
      white-space: nowrap;
      line-height: 1;
      font-size: 14 * $vw;
      color: #fff;
      background-image: linear-gradient(0deg, #1990f5 0%, #58c9ff 100%);
      border-radius: 9 * $vw;
      border: solid 2px #ffffff;
      box-sizing: border-box;
      overflow: hidden;
    }
  }
}
.cards-group {
  display: flex;
  align-items: flex-start;
  margin-top: 16 * $vw;
  font-size: 20 * $vw;
  color: #212121;
  .col-left {
    flex: 0.7;
    margin-right: 18 * $vw;
  }
  .col-right {
    display: flex;
    flex-direction: column;
    flex: 0.3;
    min-width: 344 * $vw;
    height: 100%;
  }
  .card-box {
    padding: 22 * $vw;
    &:not(:last-child) {
      margin-bottom: 16 * $vw;
    }
  }
}
.title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16 * $vw;
  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    content: '';
    width: 6 * $vw;
    height: 22 * $vw;
    background-color: #2593fc;
    border-radius: 2 * $vw;
  }
  span {
    display: flex;
    align-items: center;
    font-size: 18 * $vw;
    color: #2593fc;
  }
}
.list-1 {
  display: flex;
  flex-wrap: wrap;
  margin: 30 * $vw -16 * $vw -16 * $vw 0;
  li {
    width: calc(33.33% - 16 *#{$vw});
    margin: 0 16 * $vw 16 * $vw 0;
    background-color: #ffffff;
    border-radius: 10 * $vw;
    border: solid 1 * $vw #dcdcdc;
    box-sizing: border-box;
    overflow: hidden;
  }
  .up {
    position: relative;
    padding: 24 * $vw 16 * $vw;
    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      content: '';
      height: 1 * $vw;
      background-color: #e0e0e0;
    }
    h4 {
      display: flex;
      align-items: center;
    }
    i {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 52 * $vw;
      height: 52 * $vw;
      margin-right: 16 * $vw;
      font-size: 32 * $vw;
      color: #5169f4;
      border-radius: 100%;
      background-color: fade-out($color: #eceffe, $amount: 0);
      &.red-bg {
        color: #ee6d34;
        background-color: fade-out($color: #feefec, $amount: 0);
      }
      &.blue-bg {
        color: #269ff3;
        background-color: fade-out($color: #ecf8fe, $amount: 0);
      }
      &.green-bg {
        color: #3bc148;
        background-color: fade-out($color: #ecfeed, $amount: 0);
      }
      &.deep-green-bg {
        color: #1adec0;
        background-color: fade-out($color: #ecfefc, $amount: 0);
      }
      &.yellow-bg {
        color: #eea315;
        background-color: fade-out($color: #fef8ec, $amount: 0);
      }
    }
    p {
      min-height: 4em;
      margin-top: 16 * $vw;
      text-align: justify;
      font-size: 16 * $vw;
      color: #282121;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      white-space: normal;
      word-break: break-all;
      overflow: hidden;
    }
  }
  .down {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12 * $vw 16 * $vw;
    font-size: 16 * $vw;
    color: #999;
    span.blue {
      color: fade-out($color: #2593fc, $amount: 0.2);
    }
  }
}
.list-2 {
  margin-bottom: -20 * $vw;
  &.other {
    dt {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      white-space: normal;
      word-break: break-all;
      overflow: hidden;
    }
  }
  li {
    position: relative;
    display: flex;
    align-items: center;
    padding: 20 * $vw 0;
    &:not(:last-child)::after {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      content: '';
      height: 1 * $vw;
      background-color: #e0e0e0;
    }
    span {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50 * $vw;
      height: 50 * $vw;
      margin-right: 16 * $vw;
      font-size: 28 * $vw;
      color: #2593fc;
      border-radius: 100%;
      box-sizing: border-box;
      background-color: #e6f3ff;
      &.blue-bg {
        color: #27c6e3;
        background-color: fade-out($color: #e6fff9, $amount: 0);
      }
      &.green-bg {
        color: #19c842;
        background-color: fade-out($color: #e6ffeb, $amount: 0);
      }
      &.yellow-bg {
        color: #e9821e;
        background-color: fade-out($color: #fff5e6, $amount: 0);
      }
    }
    dt {
      color: #333;
      i {
        color: #2593fc;
      }
    }
    dd {
      padding-top: 6 * $vw;
      font-size: 18 * $vw;
      color: #999;
    }
  }
}
.list-3 {
  display: flex;
  flex-wrap: wrap;
  margin: 30 * $vw -10 * $vw -10 * $vw 0;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(33.33% - 10 *#{$vw});
    min-height: 52 * $vw;
    margin: 0 10 * $vw 10 * $vw 0;
    font-size: 25 * $vw;
    color: #fff;
    box-sizing: border-box;
    border-radius: 6 * $vw;
    background: linear-gradient(0deg, #4fb1f0 0%, #79e4ff 100%);
    overflow: hidden;
    &::before {
      margin-right: 6 * $vw;
    }
    &.red-lg-bg {
      background: linear-gradient(0deg, #f46f55 0%, #fb9983 100%);
    }
    &.tint-blue-lg-bg {
      background: linear-gradient(0deg, #55d0f4 0%, #85f4f3 100%);
    }
    &.yellow-lg-bg {
      background: linear-gradient(0deg, #f09f25 0%, #f6b917 100%);
    }
    &.deep-blue-lg-bg {
      background: linear-gradient(0deg, #409df4 0%, #83ccfb 100%);
    }
    &.green-lg-bg {
      background: linear-gradient(0deg, #1bc69e 0%, #5af3c1 100%);
    }
    span {
      font-size: 18 * $vw;
    }
  }
}
.echart-x {
  min-height: 453 * $vw;
  margin-top: 10 * $vw;
  & > div {
    width: 100%;
    height: 100%;
  }
  &:empty {
    background-color: fade-out($color: #000000, $amount: 0.9);
  }
}
</style>
