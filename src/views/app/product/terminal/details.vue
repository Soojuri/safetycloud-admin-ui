<!-- 算法分类详情页 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <div class="tit">产品信息</div>
      <div class="information">
        <el-descriptions :column="2" size="medium" class="mt-xl">
          <el-descriptions-item labelStyle="white-space: nowrap" contentStyle="overflow:hidden;text-overflow:ellipsis;"
                                label="产品ID">
            <el-tooltip effect="dark" :content="form.productId" placement="top">
              <span>{{ form.productId }}</span>
            </el-tooltip>
          </el-descriptions-item>
          <el-descriptions-item label="产品名称"> {{ form.productName }}
          </el-descriptions-item>
          <el-descriptions-item label="产品价格"> {{ form.productPrice }}元
          </el-descriptions-item>
          <el-descriptions-item label="产品描述"> {{ form.productDescription }}
          </el-descriptions-item>
          <el-descriptions-item label="产品分类"> 传感器终端
          </el-descriptions-item>
          <el-descriptions-item label="产品子类"> {{ formatType(form) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间"> {{ parseTime(form.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间"> {{ parseTime(form.updateTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人"> {{ form.createName }}
          </el-descriptions-item>
          <el-descriptions-item label="更新人"> {{ form.updateName }}
          </el-descriptions-item>
          <el-descriptions-item labelStyle="white-space: nowrap" :span="2" label="备注"> {{ form.remark }}
          </el-descriptions-item>
        </el-descriptions>
        <img :src="form.productCoverUrl" alt="">
      </div>
      <div class="tit">产品介绍</div>
      {{ form.productDetail }}
      <div class="tit">订单列表</div>
      <div class="g-table mt-xl">
        <el-table v-loading="loading" :data="list" border>
          <el-table-column prop="orderId" show-overflow-tooltip2 align="center" label="订单ID" />
          <el-table-column prop="enterpriseName" align="center" label="企业名称" />
          <el-table-column prop="orderMoney" align="center" label="订单金额" />
          <el-table-column prop="productCount" align="center" label="订单数量" />
          <el-table-column prop="createTime" align='center' label="下单时间">
            <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
          </el-table-column>
          <el-table-column prop="payTime" align='center' label="支付时间">
            <template slot-scope="scope">{{parseTime(scope.row.payTime)}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-info" type="text"
                         @click="handleDetails(scope.row)">查看
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
    <!-- 详情弹窗 -->
    <el-dialog :visible="diaVisible" width="500px" title="订单记录详情" append-to-body :close-on-click-modal='false'
               @close="diaVisible = false">
      <el-descriptions :column="1" border size="medium" class="mt-xl">
        <el-descriptions-item label="企业名称"> {{ arr.enterpriseName }}
        </el-descriptions-item>
        <el-descriptions-item label="购买产品名称"> {{ arr.productName }}
        </el-descriptions-item>
        <el-descriptions-item label="购买数量"> {{ arr.productCount }}
        </el-descriptions-item>
        <el-descriptions-item label="订单金额"> {{ arr.orderMoney }}
        </el-descriptions-item>
        <el-descriptions-item label="支付人员"> {{ arr.payName }}
        </el-descriptions-item>
        <el-descriptions-item label="备注"> {{ arr.remark }}
        </el-descriptions-item>
        <el-descriptions-item label="购买时间"> {{ parseTime(arr.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="支付时间"> {{ parseTime(arr.payTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <span v-if="arr.orderStatus == 1" style="color: #409eff">
                  等待支付
          </span>
          <span v-if="arr.orderStatus == 2" style="color: #67c23a">
                  交易完成
          </span>
          <span v-if="arr.orderStatus == 3" style="color: #909399">
                  交易关闭
          </span>
          <span v-if="arr.orderStatus == 4" style="color: #f56c6c">
                  交易失败
          </span>
          <span v-if="arr.orderStatus == 5" style="color: #f56c6c">
                  全额退款
          </span>
          <span v-if="arr.orderStatus == 6" style="color: #e6a23c">
                  异常处理
          </span>
        </el-descriptions-item>
      </el-descriptions>
      <div slot='footer'>
        <el-button type="primary" @click="diaVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProductInfo } from '@/api/app/product/product.js'
import { getProductOrderList } from '@/api/app/product/order.js'
export default {
  data() {
    return {
      form: {},
      Params: {
        size: 10,
        current: 1,
        productId: null,
      },

      loading: false,
      list: [],
      deviceCategory: [],
      id: null,
      total1: 0,
      diaVisible: false,
      arr: [],
    }
  },
  computed: {},
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getList()
    this.getDicts('equipment_type').then((res) => {
      this.deviceCategory = res.data.data
    })
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      this.Params.productId = this.$route.query.id
      getProductOrderList(this.Params)
        .then((res) => {
          this.loading = false
          this.list = res.data.data.records
          this.total1 = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
      if (this.$route.query.id) {
        getProductInfo(this.$route.query.id).then((res) => {
          this.form = res.data.data
        })
      }
    },
    formatType(row) {
      return this.selectDictLabel(this.deviceCategory, row.deviceCategory)
    },
    handleDetails(row) {
      // if (!this.permissions.camera_space_view) return this.msgWarn('权限不足')
      this.diaVisible = true
      this.arr = row
    }
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
      width: 403px;
      height: 151px;
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
