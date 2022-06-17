<template>
  <div class="sub-page">
    <div class="main-box">
      <ul class="row_1">
        <li>
          <div class="up">
            <i class="cs-icon-qyfx"></i>
            <dl>
              <dt>126</dt>
              <dd>企业风险源统计</dd>
            </dl>
          </div>
          <div class="down">
            <span>重大<i>32</i></span>
            <span>较大<i>32</i></span>
            <span>一般<i>32</i></span>
            <span>较低<i>32</i></span>
          </div>
        </li>
        <li class="green-bg">
          <div class="up">
            <i class="cs-icon-qyyh"></i>
            <dl>
              <dt>575</dt>
              <dd>企业隐患源数量</dd>
            </dl>
          </div>
          <div class="down">
            <span>重大<i>32</i></span>
            <span>较大<i>32</i></span>
            <span>一般<i>32</i></span>
            <span>较低<i>32</i></span>
          </div>
        </li>
        <li class="yellow-bg">
          <div class="up">
            <i class="cs-icon-bjsjzs"></i>
            <dl>
              <dt>575</dt>
              <dd>报警事件总数</dd>
            </dl>
          </div>
          <div class="down">
            <span>周同比<i class="arrow-up">32%</i></span>
            <span>日环比<i class="arrow-down">16%</i></span>
          </div>
        </li>
        <li class="orange-bg">
          <div class="up">
            <i class="cs-icon-yjgltj"></i>
            <dl>
              <dt>575</dt>
              <dd>应急管理统计</dd>
            </dl>
          </div>
          <div class="down">
            <span>预案数<i>32</i></span>
            <span>演练数<i>32</i></span>
            <span>专家数<i>32</i></span>
          </div>
        </li>
      </ul>
      <div class="row_2 card-box">
        <div class="card-box-head">
          <!-- <div class="tabs-x">
            <div class="tabs">
              <span class="active">事件</span>
              <span>隐患</span>
              <span>风险</span>
            </div>
          </div> -->
          <el-tabs class="week" style="margin-right:auto" type="card" v-model="activeName">
            <el-tab-pane label="事件" name="first"></el-tab-pane>
            <el-tab-pane label="隐患" name="second"></el-tab-pane>
            <el-tab-pane label="风险" name="third"></el-tab-pane>
          </el-tabs>
          <el-tabs class="week" type="card" v-model="eventStateTab">
            <el-tab-pane label="今日" name="0"></el-tab-pane>
            <el-tab-pane label="本周" name="1"></el-tab-pane>
            <el-tab-pane label="本月" name="2"></el-tab-pane>
            <el-tab-pane label="全年" name="3"></el-tab-pane>
          </el-tabs>
          <!-- <div class="week">
            <span class="active">今日</span>
            <span>本周</span>
            <span>本月</span>
            <span>全年</span>
          </div> -->
          <div class="time-pick-x">
            <el-date-picker v-model="value" type="datetime" placeholder="选择日期时间">
            </el-date-picker>
          </div>
        </div>
        <div class="card-box-body">
          <div class="col f1">
            <div class="title">报警事件趋势</div>
            <div class="echart-x">
              <chart-face></chart-face>
            </div>
          </div>
          <div class="col other">
            <div class="title">报警事件排名</div>
            <div class="table-x">
              <el-table ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChange"
                        style="width: 100%">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column property="name">
                </el-table-column>
                <el-table-column property="number">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="row_3">
        <div class="card-box f1">
          <div class="title">AI模型应用数</div>
          <ul class="row-left-up">
            <li>
              <div class="up">
                <span class="cs-icon-rdbaq"></span>
                <dl>
                  <dt>575</dt>
                  <dd>人的不安全行为</dd>
                </dl>
              </div>
              <small>较昨日增长<i class="arrow-down">17.1%</i></small>
            </li>
            <li class="red">
              <div class="up">
                <span class="cs-icon-wdbaq"></span>
                <dl>
                  <dt>575</dt>
                  <dd>物的不安全行为</dd>
                </dl>
              </div>
              <small>较昨日增长<i class="arrow-up">17.1%</i></small>
            </li>
          </ul>
          <div class="row-left-down">
            <div class="table-x_1">
              <el-table ref="singleTable" :data="tableData1" @current-change="handleCurrentChange" height="342">
                <el-table-column type="index" label="排名" width="100" align="center">
                </el-table-column>
                <el-table-column label="AI模型" property="name">
                </el-table-column>
                <el-table-column label="应用数" property="number" sortable>
                </el-table-column>
                <el-table-column label="周涨幅" sortable>
                  <div slot-scope="scope">
                    <i style="position: relative;"
                       :class="scope.row.isUp?'arrow-up':'arrow-down'">{{scope.row.tendency}}</i>
                  </div>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination-x">
              <!-- <el-pagination :current-page="currentPage" background layout="prev, pager, next, slot" :total="1000">
                <div class="jump">
                  <el-input type="text"></el-input>
                  <div class="go">GO</div>
                </div>
              </el-pagination> -->
              <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                          :limit.sync="queryParams.size" @pagination="setCurrent" />
            </div>
          </div>
        </div>
        <div class="card-box other">
          <div class="title">隐患来源与整改情况</div>
          <div class="echart-x f1">
            <!-- <chart-pie></chart-pie> -->
            <net-pie></net-pie>
          </div>
          <div class="echarts-box f1">
            <div class="content">
              <div class="echart-x">
                <chart-dial style="height:173px"></chart-dial>
                <div style="color:#929292; margin-bottom: 10px">完成率</div>
                <span>隐患整改任务</span>
              </div>
            </div>
            <div class="content">
              <div class="echart-x">
                <chart-dial2 style="height:173px"></chart-dial2>
                <div style="color:#929292; margin-bottom: 10px">完成率</div>
                <span>安全检查任务</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row_4">
        <div class="card-box f1">
          <div class="echarts-box">
            <div class="echart-x">
              <chart-dial-plate></chart-dial-plate>
            </div>
            <div class="echart-x">
              <chart-dial-plate></chart-dial-plate>
            </div>
            <div class="echart-x">
              <chart-dial-plate></chart-dial-plate>
            </div>
          </div>
        </div>
        <div class="card-box f1">
          <div class="title">任务数量统计</div>
          <div class="echart-x">
            <chart-face></chart-face>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NetPie from '@/views/app/cloud-side/charts/cloud-side/net-pie.vue'
import chartFace from './charts/safe-prod/chart-face.vue'
import chartPie from './charts/coal/chart-pie.vue'
import chartDialPlate from './charts/cloud-side/chart-dial-plate.vue'
import chartDial from './charts/cloud-side/chart-dial.vue'
import chartDial2 from './charts/cloud-side/chart-dial2.vue'
export default {
  components: {
    chartFace,
    chartPie,
    chartDialPlate,
    chartDial,
    chartDial2,
    NetPie,
  },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
      },
      eventStateTab: '2',
      activeName: 'first',
      value1: '',
      currentPage: 4,
      tableData: [
        {
          name: '违章动作识别',
          number: '323,234',
        },
        {
          name: '脱岗/睡岗识别',
          number: '323,234',
        },
        {
          name: '危险闯入检测',
          number: '323,234',
        },
        {
          name: '防护穿戴识别',
          number: '323,234',
        },
        {
          name: '烟火报警识别',
          number: '323,234',
        },
        {
          name: '设备故障检测',
          number: '323,234',
        },
      ],
      tableData1: [
        {
          name: '违章动作识别模型',
          number: '323,234',
          tendency: '128%',
          isUp: true,
        },
        {
          name: '脱岗/睡岗识别模型',
          number: '323,234',
          tendency: '128%',
          isUp: true,
        },
        {
          name: '危险闯入检测模型',
          number: '323,234',
          tendency: '128%',
          isUp: false,
        },
        {
          name: '耳机',
          number: '323,234',
          tendency: '128%',
          isUp: false,
        },
      ],
      currentRow: null,
    }
  },
  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row)
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
  },
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

.arrow-up::after,
.arrow-down::after {
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  font-family: cs-icon-font;
  font-size: 24 * $vw;
}
.arrow-up::after {
  content: '\e94c';
  color: #38d23c;
}
.arrow-down::after {
  content: '\e94d';
  color: #e72d1f;
}

.title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16 * $vw;
  font-size: 20 * $vw;
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
    font-size: 18 * $vw;
    color: #2593fc;
  }
}

.main-box {
  padding: 16 * $vw;
  border-radius: 3 * $vw;
  background-color: #fff;
  overflow-x: hidden;
}

.card-box {
  padding: 16 * $vw;
  background-color: #ffffff;
  box-shadow: 0 * $vw 1 * $vw 3 * $vw 0 * $vw #cbcbcb;
  border-radius: 6 * $vw;
}

.row_1 {
  display: flex;
  align-items: center;
  margin: 0 -18 * $vw 6 * $vw 0;
  li {
    width: calc(25% - 18 *#{$vw});
    margin: 0 18 * $vw 18 * $vw 0;
    font-size: 20 * $vw;
    color: #fff;
    border-radius: 5 * $vw;
    box-shadow: 0 * $vw 2 * $vw 0 * $vw 0 * $vw #0a69dd;
    background-image: linear-gradient(0deg, #0b84eb 0%, #1fa1f1 55%, #33bdf6 100%);
    box-sizing: border-box;
    overflow: hidden;
    &.green-bg {
      box-shadow: 0 * $vw 2 * $vw 0 * $vw 0 * $vw #098d95;
      background-image: linear-gradient(0deg, #14b2b4 0%, #34c5ca 55%, #54d8e0 100%);
      .up {
        &:not(:last-child)::after {
          background-color: #1db4b9;
        }
        i {
          box-shadow: 0 * $vw 0 * $vw 10 * $vw 0 * $vw #098d95;
          &::before {
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-image: linear-gradient(0deg, #51d6de 0%, #6dedf5 100%);
          }
        }
      }
    }
    &.yellow-bg {
      box-shadow: 0 * $vw 2 * $vw 0 * $vw 0 * $vw #b38801;
      background-image: linear-gradient(0deg, #efa016 0%, #f0b82f 55%, #f1cf47 100%);
      .up {
        &:not(:last-child)::after {
          background-color: #dd9c0f;
        }
        i {
          box-shadow: 0 * $vw 0 * $vw 10 * $vw 0 * $vw #b38801;
          &::before {
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-image: linear-gradient(0deg, #fcb305 0%, #ffd144 100%);
          }
        }
      }
    }
    &.orange-bg {
      box-shadow: 0 * $vw 2 * $vw 0 * $vw 0 * $vw rgba(134, 54, 0, 0.75);
      background-image: linear-gradient(0deg, #ec7025 0%, #f08841 55%, #f4a05d 100%);
      .up {
        &:not(:last-child)::after {
          background-color: #e47429;
        }
        i {
          box-shadow: 0 * $vw 0 * $vw 10 * $vw 0 * $vw rgba(134, 54, 0, 0.75);
          &::before {
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            background-image: linear-gradient(0deg, #fc8705 0%, #fdc383 100%);
          }
        }
      }
    }
  }
  .up {
    position: relative;
    display: flex;
    align-items: center;
    padding: 22 * $vw 22 * $vw 22 * $vw 42 * $vw;
    &:not(:last-child)::after {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      content: '';
      height: 1 * $vw;
      background-color: #088ce3;
    }
    i {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 65 * $vw;
      height: 65 * $vw;
      margin-right: 26 * $vw;
      font-size: 40 * $vw;
      color: #2593fc;
      border-radius: 100%;
      background-color: #ffffff;
      box-shadow: 0 * $vw 0 * $vw 10 * $vw 0 * $vw #004f86;
    }
    dt {
      font-size: 48 * $vw;
    }
  }
  .down {
    display: flex;
    align-items: center;
    padding: 20 * $vw 22 * $vw;
    font-size: 18 * $vw;
    color: fade-out($color: #fff, $amount: 0.3);
    span {
      flex: 1 0 0;
      text-align: center;
    }
    i {
      position: relative;
      margin-left: 7 * $vw;
      color: #fff;
    }
  }
}

.card-box-head {
  position: relative;
  display: flex;
  align-items: center;
  padding-bottom: 16 * $vw;
  font-size: 16 * $vw;
  color: #555858;
  &::after {
    position: absolute;
    bottom: 0;
    left: -16 * $vw;
    right: -16 * $vw;
    content: '';
    height: 1 * $vw;
    background: #e0e0e0;
  }
}
.tabs-x {
  flex: 1 0 0;
  .tabs {
    display: inline-flex;
    align-items: center;
    border-radius: 4px;
    border: 1 * $vw solid #dcdcdc;
    overflow: hidden;
    span {
      position: relative;
      display: block;
      text-align: center;
      min-width: 120 * $vw;
      padding: 10 * $vw 0;
      &:not(:last-child)::after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        content: '';
        width: 1px;
        background-color: #e0e0e0;
      }
      &.active {
        border: none;
        // border: 1px solid #2975ff;
        background-color: fade-out($color: #2975ff, $amount: 0.9);
        color: #2975ff;
      }
    }
  }
}
.week {
  display: flex;
  align-items: center;
  margin-right: 16 * $vw;
  span {
    min-width: 60 * $vw;
    text-align: center;
    &.active {
      color: #2975ff;
    }
  }
}
::v-deep.time-pick-x {
  .el-input__prefix {
    display: none;
  }
  .el-input--suffix .el-input__inner {
    padding-left: 16 * $vw;
  }
  .el-input__suffix {
    display: flex;
    align-items: center;
    justify-content: center;
    right: 8 * $vw;
    &::after {
      content: '\e951';
      line-height: 1;
      font-family: cs-icon-font;
      font-size: 16 * $vw;
      color: #595959;
    }
  }
}

.card-box-body {
  display: flex;
  flex: 1 0 0;
  font-size: 16 * $vw;
  color: #555858;
  overflow: hidden;
  .col {
    display: flex;
    flex-direction: column;
    padding: 16 * $vw 20 * $vw 0 0;
    &.other {
      width: 400 * $vw;
    }
  }
}
::v-deep.table-x {
  margin-top: 10 * $vw;
  .el-table {
    font-size: 16 * $vw;
    color: #323333;
    &::before {
      content: none;
    }
  }
  .el-table__header {
    display: none;
  }
  .el-table th.el-table__cell.is-leaf,
  .el-table td.el-table__cell {
    border-bottom: none;
  }
  .el-table__row .el-table_1_column_1 {
    font-style: italic;
  }
  .el-table__row:nth-child(1) .el-table_1_column_1,
  .el-table__row:nth-child(2) .el-table_1_column_1,
  .el-table__row:nth-child(3) .el-table_1_column_1 {
    color: #2975ff;
  }
}

.row_3 {
  display: flex;
  margin-top: 20 * $vw;
  .row-left-up {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 20 * $vw -18 * $vw -18 * $vw 0;
    li {
      width: calc(50% - 18 *#{$vw});
      margin: 0 18 * $vw 18 * $vw 0;
      padding: 20 * $vw;
      font-size: 20 * $vw;
      color: #000;
      box-sizing: border-box;
      background-color: #fafbff;
      box-shadow: 0 * $vw 2 * $vw 0 * $vw 0 * $vw #5068e2;
      border-radius: 5 * $vw;
      border: solid 1 * $vw #cee0fc;
      overflow: hidden;
      &.red {
        background-color: #fffdfd;
        box-shadow: 0 * $vw 2 * $vw 0 * $vw 0 * $vw #f67f79;
        border: solid 1 * $vw #fff0f1;
        .up {
          span {
            background-color: fade-out($color: #fff0f1, $amount: 0.2);
            &::before {
              color: #f67f79;
            }
          }
        }
      }
    }
    .up {
      display: flex;
      align-items: center;
      margin: 0 45 * $vw;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 72 * $vw;
        height: 72 * $vw;
        margin-right: 32 * $vw;
        border-radius: 50%;
        background-color: fade-out($color: #eceffe, $amount: 0.2);
        &::before {
          font-size: 36 * $vw;
          color: #5068e2;
        }
      }
      dt {
        font-size: 48 * $vw;
      }
    }
    small {
      display: block;
      margin-top: 10 * $vw;
      margin-left: 50 * $vw;
      i {
        position: relative;
        margin-left: 10 * $vw;
      }
    }
  }
  .row-left-down {
    margin-top: 20 * $vw;
    border-radius: 10 * $vw;
    border: solid 1px #dcdcdc;
  }
  ::v-deep.table-x_1 {
    .el-table {
      font-size: 18 * $vw;
      color: #333;
      background: transparent;
      th {
        padding: 20 * $vw 0;
        background: fade-out($color: #f4f4f4, $amount: 0.6);
        border-bottom: #dcdcdc;
      }
      tr {
        background: transparent;
      }
      td {
        padding: 21 * $vw 0;
        border-bottom: 1px solid #efefef;
      }
      &::before {
        content: none;
      }
    }
  }
  ::v-deep.pagination-x {
    padding: 16 * $vw 0;
    text-align: center;
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .el-pager li {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 33 * $vw;
      background-color: transparent;
      border: 1 * $vw solid #d9d9d9;
      border-radius: 6 * $vw;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #2975ff !important;
    }
    .btn-next,
    .btn-prev {
      border: 1px solid #2975ff;
    }
    .jump {
      display: inline-flex;
      align-items: center;
      margin-left: 10 * $vw;
      .go {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 33 * $vw;
        margin-left: 10 * $vw;
        padding: 0 5 * $vw;
        box-sizing: border-box;
        font-size: 16 * $vw;
        color: #fff;
        background-color: #2975ff;
        border-radius: 6 * $vw;
      }
      .el-input__inner {
        width: 81 * $vw;
        height: 33 * $vw;
      }
    }
  }
  .card-box {
    overflow-x: hidden;
    overflow-y: auto;
    &:not(:last-child) {
      margin-right: 20 * $vw;
    }
    &.other {
      min-width: 753 * $vw;
      display: flex;
      flex-direction: column;
    }
  }
}
.echarts-box {
  display: flex;
  flex: 1 0 0;
  margin-top: 20 * $vw;
  overflow: hidden;
  .content {
    display: flex;
    flex-direction: column;
    flex: 1 0 0;
    overflow: hidden;
    text-align: center;
    span {
      font-size: 21 * $vw;
      color: #333;
    }
  }
}
.row_4 {
  display: flex;
  margin-top: 16 * $vw;
  .card-box {
    display: flex;
    flex-direction: column;
    min-height: 396 * $vw;
    &:not(:last-child) {
      margin-right: 20 * $vw;
    }
  }
}
.echart-x {
  flex: 1 0 0;
  margin-top: 20 * $vw;
  min-height: 240 * $vw;
  &:empty {
    background-color: fade-out($color: #000000, $amount: 0.9);
  }
}
</style>
