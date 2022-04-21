<!-- 算法分类详情页 -->
<template>
  <div class='sub-page'>
    <div class="g-card" v-loading="loading">
      <div class="tit1">
        <img class="logoUrl" :src="form.logoUrl" alt="">
        <span class="msg">&nbsp;{{ form.algorithmName }}</span>
      </div>
      <div class="information">
        <el-descriptions size="medium" :column="2">
          <el-descriptions-item label="算法ID" labelStyle="white-space: nowrap;" :span="2"> {{ form.algorithmId }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="算法名称"></el-descriptions-item> -->
          <el-descriptions-item label="算法类别">
            {{ form.algorithmType == 1? '通用算法类' :form.algorithmType == 2? '城市治理类' :form.algorithmType == 3? '应急管理类' :form.algorithmType == 4?'水域治理类': '' }}
          </el-descriptions-item>
          <el-descriptions-item label="算法版本"> {{ form.algorithmVersion }}</el-descriptions-item>
          <el-descriptions-item label="算法来源">
            {{ form.algorithmSource == 1? '厂商设备算法' :form.algorithmSource == 2? '华为云算法' :form.algorithmSource == 3? '阿里云算法' :form.algorithmSource == 4?'百度云算法': '' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ parseTime(form.createTime) }}</el-descriptions-item>
          <el-descriptions-item label="算法能力集"> {{ form.algorithmCapabilitySet }}</el-descriptions-item>
          <el-descriptions-item label="算法能力值"> {{ form.algorithmCapabilityValue }}</el-descriptions-item>
          <el-descriptions-item label="发现事件数"> {{ form.eventCount }}
          </el-descriptions-item>
          <el-descriptions-item label="算法调用数"> {{ form.operateCount }}
          </el-descriptions-item>
          <el-descriptions-item label="剩余视频流路数"> {{ form.remainStreamingCount }}
          </el-descriptions-item>
          <el-descriptions-item label="算法订单ID" :span="2" labelStyle="white-space: nowrap;"> {{ form.orderId }}
          </el-descriptions-item>
          <el-descriptions-item labelStyle="white-space: nowrap" :span="2" label="备注">{{ form.remark }}
          </el-descriptions-item>
        </el-descriptions>
        <img class="bgImg" :src="form.backgroundUrl" alt="">
      </div>
      <div class="tit">算法介绍</div>
      <el-descriptions size="medium" class="mt-xl">
      </el-descriptions>
      <div class="maxWidth" v-html="form.description"></div>

      <div class="tit">算法订单</div>
      <div class="g-table">
        <el-table v-loading="loading2" :data="arr" border>
          <el-table-column prop="orderId" show-overflow-tooltip label="订单ID" />
          <el-table-column width="120px" prop="streamingCount" align="center" label="购买视频流路数" />
          <el-table-column width="120px" prop="remainStreamingCount" align="center" label="剩余视频流路数" />
          <el-table-column prop="chargeMode" width="100px" align="center" label="计费模式">
            <template slot-scope="scope">
              <span v-if="scope.row.chargeMode == 1">包年包月</span>
              <span v-if="scope.row.chargeMode == 2">按量计费</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" width="100px" align="center" label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.status == 1">正常</el-tag>
              <el-tag type="info" v-if="scope.row.status == 2">过期</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="expirationTime" align="center" label="过期时间">
            <template slot-scope="scope">
              {{ parseTime(scope.row.expirationTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间">
            <template slot-scope="scope">
              {{ parseTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleDetails(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getManageInfo, getOrderList } from '@/api/app/algorithm/manage.js'
export default {
  components: {},
  data() {
    return {
      tableData: [
        {
          name: '算法精度',
          instruction: 'F1-Score',
          fraction: '80',
        },
        {
          name: '算法性能值',
          instruction: '性能分=fps/100，如果fps>100则当满分100计算',
          fraction: '20',
        },
        {
          name: '总分',
          instruction: 'Score=算法精度*80+算法性能值*20',
          fraction: '-',
        },
      ],
      loading: false,
      loading2: false,
      form: {
        algorithmCapabilitySet: null, //算法能力集
        algorithmName: null, //算法名称
        algorithmCapabilityValue: null, //算法能力值
        algorithmVersion: null, //算法版本
        algorithmType: null, //算法类别
        algorithmSource: null, //算法来源
        algorithmLibUrl: null, //算法库地址
        algorithmObjData: null, //算法输出定义json数据
        algorithmPackageId: null, //算法分类id
        enable: null, //状态
        remark: null, //备注
        algorithmCode: null, //算法服务的标识
        orderId: null,
      },
      arr: [],
      id: null,
      total: 0,
      queryParams: {
        size: 10,
        current: 1,
        algorithmId: this.$route.query.id,
      },
    }
  },
  computed: {},
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getList()
    console.log(this.$route.query.id)
  },
  //方法集合
  methods: {
    getList() {
      if (this.$route.query.id) {
        this.loading = true
        this.loading2 = true
        getManageInfo(this.$route.query.id)
          .then((res) => {
            this.loading = false
            this.form = res.data.data
          })
          .catch(() => {
            this.loading = false
          })
        getOrderList(this.queryParams)
          .then((res) => {
            this.loading2 = false
            this.arr = res.data.data.records
            this.total = res.data.data.total
          })
          .catch(() => {
            this.loading2 = false
          })
      }
    },
    handleDetails(row) {
      const id = row.orderId
      this.$router.push('/app/algorithm/order/details/index?id=' + id)
    },
  },
}
</script>
<style lang='scss' scoped>
.g-card {
  font-size: 16px;
  .information {
    display: flex;
    margin: 13px 0;
    .bgImg {
      width: 100%;
      height: 100%;
    }
  }
}
::v-deep .maxWidth {
  img {
    max-width: 100%;
  }
}
.tit {
  position: relative;
  font-size: 18px;
  display: flex;
  align-items: flex-start;
  margin: 13px 0;
  &::before {
    content: '';
    height: 20px;
    width: 4px;
    border-radius: 2px;
    background: #2975ff;
    display: inline-block;
    margin-right: 8px;
    vertical-align: top;
    margin-top: 3px;
  }
}
.tit1 {
  font-size: 18px;
  display: flex;
  .msg {
    display: inline-block;
    height: 40px;
    margin-left: 10px;
    line-height: 40px;
  }
  .logoUrl {
    height: 40px;
  }
}
</style>