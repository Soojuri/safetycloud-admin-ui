<!-- 算法订单详情页 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <div class="tit">基本信息</div>
      <div class="information">
        <el-descriptions :column="2" size="medium" class="mt-xl">
          <el-descriptions-item label="算法订单ID" :value="1"> {{ form.orderId }}
          </el-descriptions-item>
          <el-descriptions-item label="状态" :value="2">
            <template v-if="form.status == 2">
              <span class="yellow_status"></span>
              <span class="status_text">过期</span>
            </template>
            <template v-if="form.status == 1">
              <span class="green_status"></span>
              <span class="status_text">正常</span>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :value="3"> {{ parseTime(form.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间" :value="4"> {{ parseTime(form.updateTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="购买视频流路数" :value="5"> {{ form.streamingCount }}
          </el-descriptions-item>
          <el-descriptions-item label="剩余视频流路数" :value="5"> {{ form.remainStreamingCount }}
          </el-descriptions-item>
          <el-descriptions-item label="过期时间" :value="6"> {{ parseTime(form.expirationTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="计费模式" :value="7">
            {{ form.chargeMode == 1?'包年包月':form.chargeMode == 2?'按量计费':'' }}
          </el-descriptions-item>
          <el-descriptions-item labelStyle="white-space: nowrap;" :span="2" label="备注" :value="8"> {{ form.remark }}
          </el-descriptions-item>
        </el-descriptions>
        <img :src="form.backgroundUrl" alt="">
      </div>
      <div class="tit">算法模型列表</div>
      <div class="g-table mt-xl">
        <el-table v-loading="loading1" :data="list" border>
          <el-table-column prop="algorithmId" align="center" label="算法ID" />
          <el-table-column prop="algorithmName" align="center" label="算法名称" />
          <el-table-column prop="algorithmVersion" align="center" label="算法版本号" />
          <el-table-column prop="algorithmCapabilitySet" align="center" label="算法能力集" />
          <el-table-column prop="enable" label="算法状态" align="center">
            <template slot-scope="scope">
              <el-tag type="success" plain v-if="scope.row.enable == 1">启用</el-tag>
              <el-tag type="warning" plain v-if="scope.row.enable == 0">未启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-info" type="text"
                         @click="$router.push('/app/algorithm/manage/details/index?id=' + scope.row.algorithmId)">查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total1" :page.sync="Params.current" :limit.sync="Params.size"
                      @pagination="getList" />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { getOrderInfo } from '@/api/app/algorithm/bag.js'
import { getListByOrderId } from '@/api/app/algorithm/manage.js'
export default {
  data() {
    return {
      form: {
        packageName: null,
        algorithmType: null,
        expirationTime: null,
        remark: null,
        backgroundUrl: null,
      },
      Params: {
        size: 10,
        current: 1,
        orderId: null,
      },

      loading1: false,
      list: [],
      id: null,
      total1: 0,
    }
  },
  computed: {},
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getList()
  },
  //方法集合
  methods: {
    getList() {
      this.loading1 = true
      this.Params.orderId = this.$route.query.id
      getListByOrderId(this.Params)
        .then((res) => {
          this.loading1 = false
          this.list = res.data.data.records
          this.total1 = res.data.data.total
        })
        .catch(() => {
          this.loading1 = false
        })

      if (this.$route.query.id) {
        getOrderInfo(this.$route.query.id).then((res) => {
          this.form = res.data.data
        })
      }
    },
    handleClear() {
      this.Params.size = 10
      this.Params.current = 1
      this.getList()
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
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.tit {
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
</style>