<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="订单ID" prop="orderId" :rules="[$formRules.checkLen(50)]">
          <el-input v-model="queryParams.orderId" placeholder="请输入订单ID"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择">
            <el-option label="正常" :value="1" />
            <el-option label="过期" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-opera">
          <el-button type="primary" @click="handleAdd">新 增</el-button>
        </div>
        <div class="g-table">
          <el-table v-loading="loading" :data="tableData" border>
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
            <el-table-column prop="expirationTime" show-overflow-tooltip align="center" label="过期时间">
              <template slot-scope="scope">
                {{ parseTime(scope.row.expirationTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" show-overflow-tooltip align="center" label="创建时间">
              <template slot-scope="scope">
                {{ parseTime(scope.row.createTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="updateTime" show-overflow-tooltip align="center" label="更新时间">
              <template slot-scope="scope">
                {{ parseTime(scope.row.updateTime) }}
              </template>
            </el-table-column>
            <el-table-column align="center" width="150px" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleDetails(scope.row)">详情</el-button>
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="g-page-x mt-m">
            <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                        :limit.sync="queryParams.size" @pagination="getList" />
          </div>
        </div>
      </div>
      <!-- 弹窗 -->
      <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="getList()">
      </pop-form>
    </div>
  </div>
</template>
<script>
import PopForm from '@/views/app/algorithm/order/orderPopFrom.vue'
import { getOrderList, delOrder } from '@/api/app/algorithm/bag.js'
import { getManageList } from '@/api/app/algorithm/manage'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      queryParams: {
        size: 10,
        current: 1,
        orderId: null,
        status: null,
      },
      loading: false,
      tableData: [],
      id: null,
      total: 0,
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    getManageList({ size: 10000, current: 1 }).then((res) => {
      this.dict.algorithmUse = res.data.data.records
    })
    this.getList()
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      getOrderList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAdd() {
      if (!this.permissions.algorithm_order_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      if (!this.permissions.algorithm_order_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.orderId
      this.formOptions.visible = true
    },
    handleClear() {
      this.resetForm('queryParams')
      this.getList()
    },
    handleQuery() {
      const that = this
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          that.getList()
        }
      })
    },
    handleDetails(row) {
      if (!this.permissions.algorithm_order_view) return this.msgWarn('权限不足')
      const id = row.orderId
      this.$router.push('/app/algorithm/order/details/index?id=' + id)
    },
    handleDelete(row) {
      if (!this.permissions.algorithm_order_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该购买订单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delOrder(row.orderId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
  },
}
</script>