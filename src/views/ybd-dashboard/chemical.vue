<template>
  <div class="db-wrap">
    <db-header :index="index"></db-header>
    <div class="db-content">
      <div class="db-col col-l">
        <db-box title="涉重点监管危化品产业">
          <div class="db-sta-cols card-view col-2">
            <ul>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-ent"></div>
                </div>
                <span><b>2,500</b>涉重点监管危化品企业</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-control-ent"></div>
                </div>
                <span><b>2,635</b>特别管控企业</span>
              </li>
            </ul>
          </div>
        </db-box>
        <db-box class="flex-1" title="危化企业数量">
          <chart-ring style="min-height:200px"></chart-ring>
        </db-box>
        <db-box title="生产企业地区排名">
          <div class="area-ranks-wrap">
            <div class="ent-info">
              <div class="ico-x">
                <img src="/img/ybd-dashboard/icon-ent.png" alt="">
              </div>
              <b>162,141</b>
              <span>生产企业总数</span>
            </div>
            <div class="area-ranks">
              <db-rank-group showIndex hideVal :data="rankDataArea"></db-rank-group>
            </div>
          </div>
        </db-box>
        <db-box class="flex-1" title="涉剧毒/易制爆/易制毒企业数量排行榜">
          <div class="ranks">
            <ul>
              <li class="item-blue">
                <div class="info-x">
                  <div class="shapes"></div>
                  <div class="db-icon db-icon-poison"></div>
                  <span><b>5,591</b>剧毒</span>
                </div>
                <db-rank-group :data="rankData1"></db-rank-group>
              </li>
              <li class="item-orange">
                <div class="info-x">
                  <div class="shapes"></div>
                  <div class="db-icon db-icon-explode"></div>
                  <span><b>38,661</b>易爆炸</span>
                </div>
                <db-rank-group :data="rankData1"></db-rank-group>
              </li>
              <li class="item-green">
                <div class="info-x">
                  <div class="shapes"></div>
                  <div class="db-icon db-icon-poison2"></div>
                  <span><b>49,020</b>易制毒</span>
                </div>
                <db-rank-group :data="rankData1"></db-rank-group>
              </li>
            </ul>
          </div>
        </db-box>
      </div>
      <div class="db-col col-m">
        <div class="map-x flex-8">
          <chart-map></chart-map>
        </div>
        <db-box class="flex-3" title="城市危化企业安全指数统计">
          <chart-bar-round></chart-bar-round>
        </db-box>
      </div>
      <div class="db-col col-r">
        <db-box class="flex-1" title="城市危化行业安全风险态势">
          <chart-v-bar style="min-height: 150px;"></chart-v-bar>
        </db-box>
        <db-box title="危险企业安全风险动态监测">
          <div class="db-table-x">
            <el-table></el-table>
          </div>
        </db-box>
        <db-box title="行政处罚信息">
          <div class="db-table-x">
            <el-table></el-table>
          </div>
        </db-box>
        <db-box title="安全生产事故信息">
          <div class="accident-list">
            <ul>
              <li v-for='item in 3'>
                <div class="time">
                  <span>2022-04-05<i>其他爆炸</i></span>
                </div>
                <div class="content">
                  <p>- - - <br>福建省泉州市丰泽区</p>
                  <div class="right-x">
                    <div class="accident-type">其他事故</div>
                    <div class="data">
                      <span class="orange">伤:4人</span>
                      <span class="red">亡:0人</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </db-box>
      </div>
    </div>
  </div>
</template>

<script>
import chartVBar from './charts/chemical/chart-v-bar.vue'
import chartRing from './charts/chemical/chart-ring.vue'
import chartBarRound from './charts/coal/chart-bar-round.vue'
import dbHeader from './component/db-header.vue'
import dbBox from './component/db-box.vue'
import dbRankGroup from './component/db-rank-group.vue'
export default {
  components: {
    chartVBar,
    chartRing,
    chartBarRound,
    dbHeader,
    dbBox,
    dbRankGroup,
  },
  data() {
    return {
      index: 1,
      rankDataArea: [
        {
          name: '泉州市',
          val: 758,
        },
        {
          name: '福州市',
          val: 720,
        },
        {
          name: '莆田市',
          val: 680,
        },
        {
          name: '厦门市',
          val: 670,
        },
        {
          name: '龙岩市',
          val: 630,
        },
        {
          name: '漳州市',
          val: 610,
        },
      ],
      rankData1: [
        {
          name: '泉州市',
          val: 758,
        },
        {
          name: '福州市',
          val: 720,
        },
        {
          name: '莆田市',
          val: 680,
        },
        {
          name: '厦门市',
          val: 670,
        },
        {
          name: '龙岩市',
          val: 630,
        },
        {
          name: '漳州市',
          val: 610,
        },
        {
          name: '南平市',
          val: 560,
        },
        {
          name: '三明市',
          val: 200,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import './style/chemical.scss';
</style>
