<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="70px">
        <el-form-item label="订单编号" prop="orderCode" :rules="[$formRules.checkLen()]">
          <el-input v-model.trim="queryParams.orderCode" placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item label="订单名称" prop="orderName" :rules="[$formRules.checkLen(255)]">
          <el-input v-model.trim="queryParams.orderName" placeholder="请输入订单名称"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="queryParams.orderStatus" placeholder="请选择">
            <el-option label="等待支付" :value="1" />
            <el-option label="交易完成" :value="2" />
            <el-option label="交易关闭" :value="3" />
            <el-option label="交易失败" :value="4" />
            <el-option label="全额退款" :value="5" />
            <el-option label="异常处理" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label='支付时间' prop="payTime">
          <el-date-picker value-format='timestamp' v-model='queryParams.payTime' type='datetimerange'
                          range-separator='至' start-placeholder='开始时间' end-placeholder='结束时间'
                          :default-time="['00:00:00', '23:59:59']" />
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button type="primary" @click="handleQuery">查 询</el-button>
          <el-button @click="handleClear">重 置</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <!-- <div class="g-opera">
          <el-button type="primary" icon='el-icon-plus' @click="handleAdd">新 增</el-button>
        </div> -->
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="orderCode" align='center' label="订单编号" />
            <el-table-column prop="orderName" align='center' label="订单名称" />
            <el-table-column prop="orderType" align='center' label="订单类型">
              <template slot-scope="scope">
                <span v-if="scope.row.orderType == 1">终端设备订单</span>
                <span v-if="scope.row.orderType == 2">边缘计算盒子订单</span>
                <span v-if="scope.row.orderType == 3">软件服务产品订单</span>
              </template>
            </el-table-column>
            <el-table-column prop="createName" align='center' label="下单账号" />
            <el-table-column prop="transactType" align='center' label="交易类型" :formatter="formatTransactType" />
            <el-table-column prop="payChannel" align='center' label="支付渠道">
              <template slot-scope="scope">
                <span v-if="scope.row.payChannel == 1">钱包支付</span>
                <span v-if="scope.row.payChannel == 2">微信支付</span>
                <span v-if="scope.row.payChannel == 3">支付宝</span>
                <span v-if="scope.row.payChannel == 4">线下支付</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderMoney" align='center' label="订单金额" />
            <el-table-column prop="payName" align='center' label="支付人员" />
            <el-table-column prop="orderStatus" align='center' label="订单状态">
              <template slot-scope="scope">
                <span v-if="scope.row.orderStatus == 1" style="color: #409eff">
                  等待支付
                </span>
                <span v-if="scope.row.orderStatus == 2" style="color: #67c23a">
                  交易完成
                </span>
                <span v-if="scope.row.orderStatus == 3" style="color: #909399">
                  交易关闭
                </span>
                <span v-if="scope.row.orderStatus == 4" style="color: #f56c6c">
                  交易失败
                </span>
                <span v-if="scope.row.orderStatus == 5" style="color: #f56c6c">
                  全额退款
                </span>
                <span v-if="scope.row.orderStatus == 6" style="color: #e6a23c">
                  异常处理
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align='center' label="下单时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column prop="payTime" align='center' label="支付时间">
              <template slot-scope="scope">{{parseTime(scope.row.payTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align='center'>
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleDetails(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>
      <!-- 弹窗 -->
      <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="getList()">
      </pop-form>
      <!-- 详情弹窗 -->
      <el-dialog :visible="diaVisible" width="500px" title="订单详情" append-to-body :close-on-click-modal='false'
                 @close="diaVisible = false">
        <el-descriptions :column="1" border size="medium" class="mt-xl">
          <el-descriptions-item label="订单编号"> {{ arr.orderCode }}
          </el-descriptions-item>
          <el-descriptions-item label="订单名称"> {{ arr.orderName }}
          </el-descriptions-item>
          <el-descriptions-item label="下单账号"> {{ arr.createName }}
          </el-descriptions-item>
          <el-descriptions-item label="支付金额"> {{ arr.orderMoney }}
          </el-descriptions-item>
          <el-descriptions-item label="下单时间"> {{ parseTime(arr.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="支付时间"> {{ parseTime(arr.payTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="支付方式">
            <span v-if="arr.payChannel == 1">钱包支付</span>
            <span v-if="arr.payChannel == 2">微信支付</span>
            <span v-if="arr.payChannel == 3">支付宝</span>
            <span v-if="arr.payChannel == 4">线下支付</span>
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
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import { getProductOrderList, delProductOrder, putProductOrder } from '@/api/app/product/order'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        orderCode: null,
        orderStatus: null,
        orderName: null,
        payTime: [],
      },
      total: 0,
      tableData: [],
      dict: {
        commission: [],
      },
      formOptions: {
        visible: false,
        data: {},
      },
      diaVisible: false,
      arr: [],
      loading: false,
      transactType: [],
    }
  },
  watch: {},
  mounted() {
    this.getList()
    this.getDicts('transaction_type').then((res) => {
      this.transactType = res.data.data
    })
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    getList() {
      this.loading = true
      getProductOrderList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    formatTransactType(row) {
      return this.selectDictLabel(this.transactType, row.transactType)
    },
    formatType(row) {
      return this.selectDictLabel(this.dict.protocolType, row.protocolType)
    },
    handleAdd() {
      if (!this.permissions.camera_space_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      if (!this.permissions.camera_space_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.orderId
      this.formOptions.visible = true
    },
    handleQuery() {
      const that = this
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          that.getList()
        }
      })
    },
    handleClear() {
      this.resetForm('queryParams')
      this.getList()
    },
    handleDelete(row) {
      if (!this.permissions.camera_space_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delProductOrder(row.orderId)
        })
        .then((res) => {
          if (res.data.data) {
            that.handleCurrentPageCalculateByDelete()
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleCurrentPageCalculateByDelete() {
      // 减少一条数据后向上取整 获得总页数
      const totalPage = Math.ceil((this.total - 1) / this.queryParams.size)
      this.queryParams.current = this.queryParams.current > totalPage ? totalPage : this.queryParams.current
      // 只有一条数据时,删除后,当前页码设置为 1
      this.queryParams.current = this.queryParams.current < 1 ? 1 : this.queryParams.current
    },
    handleDetails(row) {
      // if (!this.permissions.camera_space_view) return this.msgWarn('权限不足')
      this.diaVisible = true
      this.arr = row
    },
  },
}
</script>
<style lang='scss' scoped>
.status-info {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #909399;
  border-radius: 50%;
}

.status-primary {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #ecf5ff;
  border-radius: 50%;
  border: 1px solid #409eff;
}

.status-success {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #67c23a;
  border-radius: 50%;
}

.status-waring {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #fdf6ec;
  border-radius: 50%;
  border: 1px solid #e6a23c;
}

.status-danger {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #fef0f0;
  border-radius: 50%;
  border: 1px solid #f56c6c;
}
</style>
