<!-- 算法分类详情页 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <div class="tit">待支付订单信息</div>
      <div class="information">
        <el-descriptions :column="2" size="medium" class="mt-xl">
          <el-descriptions-item labelStyle="white-space: nowrap" contentStyle="overflow:hidden;text-overflow:ellipsis;"
                                label="订单编号">
            <el-tooltip effect="dark" :content="form.orderCode" placement="top">
              <span>{{ form.orderCode }}</span>
            </el-tooltip>
          </el-descriptions-item>
          <el-descriptions-item label="产品名称"> {{ form.productName }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额"> {{ form.orderMoney }}元
          </el-descriptions-item>
          <el-descriptions-item label="产品数量"> {{ form.productCount }}
          </el-descriptions-item>
          <el-descriptions-item label="产品分类"> 传感器终端
          </el-descriptions-item>
          <el-descriptions-item label="创建时间"> {{ parseTime(form.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item labelStyle="white-space: nowrap" :span="2" label="备注"> {{ form.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="tit">支付方式</div>
      <div>
        <el-button @click="wxPay">微信支付</el-button>
      </div>
      <div v-if="qrCodeUrl!==''">
        <el-image :src="qrCodeUrl"></el-image>
      </div>
    </div>
  </div>
</template>

<script>
import { getProductInfo } from '@/api/app/product/product.js'
import { getProductOrderList, getProductOrderInfo, pay, queryPayStatus } from '@/api/app/product/order.js'
export default {
  data() {
    return {
      form: {},
      Params: {
        size: 10,
        current: 1,
        productId: null,
      },
      qrCodeUrl: '',
      payType: '0',
      loading: false,
      list: [],
      deviceCategory: [],
      id: null,
      total1: 0,
      timer: null,
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
  destroyed() {
    //离开页面是销毁
    clearInterval(this.timer)
    this.timer = null
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
        getProductOrderInfo(this.$route.query.id).then((res) => {
          this.form = res.data.data
        })
      }
    },
    wxPay() {
      this.form.payChannel = 2
      pay(this.form).then((res) => {
        console.log('发起支付结果:' + res.data.data)
        this.qrCodeUrl = res.data.data.qrCode
        // 实现轮询
        this.timer = window.setInterval(() => {
          setTimeout(this.orderQuery(), 0)
        }, 3000)
      })
    },
    orderQuery() {
      const that = this
      queryPayStatus(this.form.orderCode).then((res) => {
        console.log('轮询结果:' + res.data.data)
        if (res.data.data.tradeState === 'SUCCESS') {
          that.msgSuccess('支付成功')
          clearInterval(this.timer)
          this.$router.push('/app/product/order/index')
        }
      })
    },
    formatType(row) {
      return this.selectDictLabel(this.deviceCategory, row.deviceCategory)
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
