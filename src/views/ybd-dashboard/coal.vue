<template>
  <div class="db-wrap">
    <db-header :index="index"></db-header>
    <div class="db-content">
      <div class="db-col col-l">
        <db-box title="煤矿企业数量">
          <div class="db-sta-cols">
            <ul>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-ore-num"></div>
                </div>
                <span><b>2,500</b>煤矿总数(家)</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-open-air"></div>
                </div>
                <span><b>2,635</b>露天煤矿(家)</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-mine"></div>
                </div>
                <span><b>369</b>井工煤矿(家)</span>
              </li>
            </ul>
          </div>
        </db-box>
        <div class="s-cols flex-1">
          <div class="s-col">
            <db-box class="flex-1" title="矿井类型">
              <chart-ring></chart-ring>
            </db-box>
          </div>
          <div class="s-col">
            <db-box class="flex-1" title="安全生产标准化等级">
              <chart-pie></chart-pie>
            </db-box>
          </div>
        </div>
        <db-box class="flex-1" title="煤矿产能TOP6">
          <chart-h-bar></chart-h-bar>
        </db-box>
        <db-box class="flex-1" title="城市煤矿安全态势">
          <chart-v-bar></chart-v-bar>
        </db-box>
      </div>
      <div class="db-col col-m">
        <div class="map-x flex-8">
        </div>
        <db-box class="flex-3" title="城市企业安全指数统计">
          <chart-bar-round></chart-bar-round>
        </db-box>
      </div>
      <div class="db-col col-r">
        <db-box title="安全生产许可证／采矿许可证">
          <div class="db-sta-cols">
            <ul>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-licence-normal"></div>
                </div>
                <span><b>2,500<small>万</small></b>正常</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-licence-none"></div>
                </div>
                <span><b>2,635</b>未办证</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-licence-lock"></div>
                </div>
                <span><b>369</b>暂扣</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-licence-cancel"></div>
                </div>
                <span><b>369</b>注(吊)销</span>
              </li>
              <li>
                <div class="icon-x">
                  <div class="db-icon db-icon-licence-else"></div>
                </div>
                <span><b>369</b>其他</span>
              </li>
            </ul>
          </div>
        </db-box>
        <db-box title="安全生产事故信息">
          <div class="accident-list">
            <ul>
              <li v-for='item in 3'>
                <div class="time">
                  <span>2022-04-05</span>
                </div>
                <div class="content">
                  <span><i>其他事故</i>|&nbsp;华亭煤业大刘煤矿有限公司</span>
                </div>
              </li>
              <li>
                <div class="time">
                  <span>2022-04-05</span>
                </div>
                <div class="content" title="华亭煤业大刘煤矿有限公司华亭煤业大刘煤矿有限公司华亭煤业大刘煤矿有限公司">
                  <span><i>顶板事故</i>|华亭煤业大刘煤矿有限公司华亭煤业大刘煤矿有限公司华亭煤业大刘煤矿有限公司</span>
                </div>
              </li>
            </ul>
          </div>
        </db-box>
        <db-box class="flex-1" title="行政处罚信息">
          <div class="db-table-x">
            <el-table :data="tableData1">
              <el-table-column prop="date" label="处罚时间"></el-table-column>
              <el-table-column prop="organ" label="行政处罚机关"></el-table-column>
              <el-table-column prop="name" label="企业名称"></el-table-column>
              <el-table-column prop="pubDate" label="公示日期"></el-table-column>
            </el-table>
          </div>
        </db-box>
        <db-box class="flex-1" title="煤矿安全风险动态检测">
          <div class="db-table-x">
            <el-table :data="tableData2">
              <el-table-column prop="name" label="企业名称"></el-table-column>
              <el-table-column prop="val" label="安全指数"></el-table-column>
              <el-table-column prop="level" label="风险等级"></el-table-column>
              <el-table-column prop="prevVal" label="上次检测"></el-table-column>
              <el-table-column prop="exchange" label="重大变动"></el-table-column>
            </el-table>
          </div>

        </db-box>
      </div>
    </div>
  </div>
</template>

<script>
import chartBarRound from './charts/coal/chart-bar-round.vue'
import chartVBar from './charts/coal/chart-v-bar.vue'
import chartHBar from './charts/coal/chart-h-bar.vue'
import chartRing from './charts/coal/chart-ring.vue'
import chartPie from './charts/coal/chart-pie.vue'
import dbHeader from './component/db-header.vue'
import dbBox from './component/db-box.vue'
export default {
  components: {
    chartBarRound,
    chartVBar,
    chartHBar,
    chartRing,
    chartPie,
    dbHeader,
    dbBox,
  },
  data() {
    return {
      index: 0,
      tableData1: [
        {
          date: '20220102',
          organ: '(闽)安监',
          name: '闽中能新',
          pubDate: '2022-01-02',
        },
        {
          date: '20220102',
          organ: '(闽)安监',
          name: '闽中能新',
          pubDate: '2022-01-02',
        },
        {
          date: '20220102',
          organ: '(闽)安监',
          name: '闽中能新',
          pubDate: '2022-01-02',
        },
        {
          date: '20220102',
          organ: '(闽)安监',
          name: '闽中能新',
          pubDate: '2022-01-02',
        },
      ],
      tableData2: [
        {
          name: '隆化能源',
          val: '63 30-20',
          level: '一般风险',
          prevVal: '93 01-20',
          exchange: '风险能力',
        },
        {
          name: '隆化能源',
          val: '63 30-20',
          level: '一般风险',
          prevVal: '93 01-20',
          exchange: '风险能力',
        },
        {
          name: '隆化能源',
          val: '63 30-20',
          level: '一般风险',
          prevVal: '93 01-20',
          exchange: '风险能力',
        },
        {
          name: '隆化能源',
          val: '63 30-20',
          level: '一般风险',
          prevVal: '93 01-20',
          exchange: '风险能力',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import './style/coal.scss';
</style>
