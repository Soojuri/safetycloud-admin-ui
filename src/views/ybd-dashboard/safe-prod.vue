<template>
  <div class="db-wrap">
    <db-header :index="index"></db-header>
    <div class="db-content">
      <div class="db-col col-l">
        <db-box class="flex-1" title="安全生产趋势图">
          <chart-face></chart-face>
        </db-box>
        <db-box title="全省安全生产评分">
          <div class="c-slide">
            <p>全省安全生产评分：<b>{{progressVal}}</b></p>
            <el-slider disabled :show-tooltip="false" v-model="progressVal"></el-slider>
          </div>
          <div class="sta-cards">
            <ul>
              <li class="item-orange">
                <div class="db-icon db-icon-dangerous"></div>
                <span><b>1,250</b>隐患总数</span>
              </li>
              <li class="item-blue">
                <div class="db-icon db-icon-org"></div>
                <span><b>1,250</b>企业自报隐患数量</span>
              </li>
            </ul>
          </div>
        </db-box>
        <db-box class="flex-1" title="城市隐患数据统计">
          <chart-v-bar></chart-v-bar>
        </db-box>
      </div>
      <div class="db-col col-m">
        <db-box hideTitle>
          <div class="sta-box">
            <div class="shapes"></div>
            <ul>
              <li>
                <b>55,8 89</b>
                <span>联网企业数量</span>
              </li>
              <li>
                <b>7,562</b>
                <span>重大危险源数量</span>
              </li>
              <li>
                <b>258/254</b>
                <span>预警/响应数量</span>
              </li>
              <li>
                <b>1</b>
                <span>重大安全生产事故数量</span>
              </li>
            </ul>
          </div>
        </db-box>
        <div class="map-x flex-1">
          <div class="canvas-wrap"></div>
          <div class="map-info-x">
            <div class="map-info-x__tit">
              <span>泉州市</span>
              <a href="javascript:void(0);" class="link">详情&nbsp;&gt;</a>
            </div>
            <!-- 这里放折线图 -->
            <div class="canvas-wrap" style="height: 4.2vw;"></div>
            <div class="sta-info">
              <div class="sta-info__line">
                <label>联网企业：</label>
                <span>65</span>
              </div>
              <div class="sta-info__line">
                <label>重大危险源：</label>
                <span>25</span>
              </div>
              <div class="sta-info__line">
                <label>预警／响应：</label>
                <span>78/76</span>
              </div>
              <div class="sta-info__line">
                <label>重大安全生产事故：</label>
                <span>12</span>
              </div>
            </div>
            <div class="c-slide size-25">
              <el-slider disabled :show-tooltip="false" v-model="progressVal"></el-slider>
              <p>安全生产评分：{{progressVal}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="db-col col-r">
        <db-box class="flex-1" title="隐患级别占比和整改情况">
          <div class="s-cols">
            <div class="s-col">
              <chart-pie></chart-pie>
            </div>
            <div class="s-col">
              <div class="canvas-wrap">
                <chart-ring></chart-ring>
              </div>
            </div>
          </div>
        </db-box>
        <db-box class="flex-1" title="行政执法统计">
          <chart-v-bars></chart-v-bars>
        </db-box>
        <db-box title="应急资源统计">
          <div class="db-sta-cols">
            <ul>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-expert"></div>
                </div>
                <span><b>2,500</b>应急专家</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-resource"></div>
                </div>
                <span><b>2,635</b>救援物质装备</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-safe-org"></div>
                </div>
                <span><b>369</b>专业保障机构</span>
              </li>
            </ul>
          </div>
        </db-box>
        <db-box title="安全文化教育">
          <div class="db-sta-cols">
            <ul>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-article"></div>
                </div>
                <span><b>2,500</b>宣传文章数量</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-appeal"></div>
                </div>
                <span><b>2,635</b>投诉情况</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-train"></div>
                </div>
                <span><b>369</b>安全培训情况</span>
              </li>
            </ul>
          </div>
        </db-box>
      </div>
    </div>
  </div>
</template>

<script>
import chartVBars from './charts/safe-prod/chart-v-bars.vue'
import chartPie from './charts/safe-prod/chart-pie.vue'
import chartRing from './charts/safe-prod/chart-ring.vue'
import chartFace from './charts/safe-prod/chart-face.vue'
import chartVBar from './charts/safe-prod/chart-v-bar.vue'
import dbHeader from './component/db-header.vue'
import dbBox from './component/db-box.vue'
export default {
  components: {
    chartVBars,
    chartPie,
    chartRing,
    chartFace,
    chartVBar,
    dbHeader,
    dbBox,
  },
  data() {
    return {
      index: 2,
      progressVal: 70,
    }
  },
}
</script>

<style lang="scss" scoped>
@import './style/safe-prod.scss';
</style>
