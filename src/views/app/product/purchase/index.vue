<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="70px">
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="queryParams.productName" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input v-model="queryParams.enterpriseName" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="缴费状态" prop="payStatus">
          <el-select v-model="queryParams.payStatus" placeholder="请选择缴费状态">
            <el-option label="未缴费" :value="0" />
            <el-option label="已缴费" :value="1" />
            <el-option label="已退款" :value="2" />
          </el-select>
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
            <el-table-column prop="enterpriseName" align='center' label="企业名称" />
            <el-table-column prop="productName" align='center' label="购买产品名称" />
            <el-table-column prop="productCount" align='center' label="购买数量" />
            <el-table-column prop="orderMoney" align='center' label="订单金额" />
            <el-table-column prop="payName" align='center' label="支付人员" />
            <el-table-column prop="remark" align='center' label="备注" />
            <el-table-column prop="payStatus" align='center' label="缴费状态">
              <template slot-scope="scope">
                <span v-if="scope.row.payStatus == 0" style="color: #409eff">
                  未缴费
                </span>
                <span v-if="scope.row.payStatus == 1" style="color: #67c23a">
                  已缴费
                </span>
                <span v-if="scope.row.payStatus == 2" style="color: #f56c6c">
                  已退款
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align='center' label="购买时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column prop="payTime" align='center' label="支付时间">
              <template slot-scope="scope">{{parseTime(scope.row.payTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align='center'>
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleDetails(scope.row)">详情</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
      <el-dialog :visible="diaVisible" width="500px" title="产品购买记录详情" append-to-body :close-on-click-modal='false'
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
          <el-descriptions-item label="缴费状态">
            <span v-if="arr.payStatus == 0" style="color: #409eff">
              未缴费
            </span>
            <span v-if="arr.payStatus == 1" style="color: #67c23a">
              已缴费
            </span>
            <span v-if="arr.payStatus == 2" style="color: #f56c6c">
              已退款
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
import { getPurchaseList, delPurchase, putPurchase } from '@/api/app/product/purchase.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        productName: null,
        enterpriseName: null,
        payStatus: null,
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
      loading: false,
      transactType: [],
      diaVisible: false,
      arr: [],
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
      getPurchaseList(this.queryParams)
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
      // if (!this.permissions.camera_space_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delPurchase(row.recordId)
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
