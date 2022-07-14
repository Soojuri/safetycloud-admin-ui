<!-- 基础信息-设备产品 -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="设备产品名称" prop="productName" :rules="[$formRules.checkLen()]">
          <el-input v-model.trim="queryParams.productName" placeholder="请输入设备产品名称"></el-input>
        </el-form-item>
        <el-form-item label="产品状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" style="width: 120px">
            <el-option label="未发布" :value="0" />
            <el-option label="已发布" :value="1" />
            <el-option label="已停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button type="primary" @click="handleQuery">搜 索</el-button>
          <el-button @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <!-- <div class="g-opera">
          <el-button type="primary" icon='el-icon-plus' @click="handleAdd">新 增</el-button>
        </div> -->
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="productName" align='center' label="设备产品名称" />
            <el-table-column prop="deviceType" align='center' label="设备类型" :formatter="formatType" />
            <el-table-column prop="deviceModel" align='center' label="设备型号" />
            <el-table-column prop="manufacturer" align='center' label="设备厂商" />
            <el-table-column prop="remark" align='center' label="产品备注" />
            <el-table-column prop="status" align='center' label="产品状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0" style="color: #909399">
                  未发布
                </span>
                <span v-if="scope.row.status == 1" style="color: #67c23a">
                  已发布
                </span>
                <span v-if="scope.row.status == 2" style="color: #f56c6c">
                  已停用
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align='center' label="创建时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align='center' width="250">
              <template slot-scope="scope">
                <!-- <el-button size="mini"  type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini"  :disabled="scope.row.status == 1?true:false" type="text"
                           @click="handleDelete(scope.row)">删除</el-button> -->
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
      <!-- 详情 -->
      <el-dialog :visible="visible" width="800px" title="详情" append-to-body :close-on-click-modal='false'
                 @close="visible = false">
        <el-descriptions :column="2" size="medium">
          <el-descriptions-item labelStyle="white-space: nowrap" contentStyle="overflow:hidden;text-overflow:ellipsis;"
                                label="产品编号">
            <el-tooltip effect="dark" :content="arr.deviceProductId" placement="top">
              <span>{{ arr.deviceProductId }}</span>
            </el-tooltip>
          </el-descriptions-item>
          <el-descriptions-item label="设备类型"> {{ formatType(arr) }}
          </el-descriptions-item>
          <el-descriptions-item label="设备厂商"> {{ arr.manufacturer }}
          </el-descriptions-item>
          <el-descriptions-item label="设备型号"> {{ arr.deviceModel }}
          </el-descriptions-item>
          <el-descriptions-item label="产品状态"> {{ arr.status == 0?'未发布':arr.status == 1?'已发布':'已停用' }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间	"> {{ parseTime(arr.createTime) }}
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import { getProductList, getProduct, delProduct, putProduct } from '@/api/app/baseinfo/product.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        productName: null,
        status: null,
      },
      deviceType: null,
      total: 0,
      tableData: [],
      arr: [],
      dict: {
        commission: [],
      },
      formOptions: {
        visible: false,
        data: {},
      },
      visible: false,
      loading: false,
    }
  },
  watch: {},
  mounted() {
    this.getDicts('device_type').then((res) => {
      this.deviceType = res.data.data
      this.getList()
    })
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    getList() {
      this.loading = true
      getProductList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    formatType(row) {
      return this.selectDictLabel(this.deviceType, row.deviceType)
    },
    handleAdd() {
      // if (!this.permissions.camera_space_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      // if (!this.permissions.camera_space_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.deviceProductId
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
          return delProduct(row.deviceProductId)
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
    handleChangeStatus(row) {
      // if (!this.permissions.camera_space_stop) return this.msgWarn('权限不足')
      const deviceProductId = row.deviceProductId
      const status = row.status == 0 ? 1 : 0
      putProduct({ deviceProductId, status }).then((res) => {
        if (res.data.data) {
          this.msgSuccess(`${status == 1 ? '启用成功' : '停用成功'}`)
          this.getList()
        }
      })
    },
    handleDetails(row) {
      // if (!this.permissions.camera_space_view) return this.msgWarn('权限不足')
      // const id = row.deviceProductId
      // this.$router.push({
      //   path: '/app/camera/space/info/index/',
      //   query: { id },
      // })
      this.visible = true
      getProduct(row.deviceProductId).then((res) => {
        this.arr = res.data.data
      })
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
  background: #409eff;
  border-radius: 50%;
  // border: 1px solid #409eff;
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
  background: #e6a23c;
  border-radius: 50%;
  // border: 1px solid #e6a23c;
}

.status-danger {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #f56c6c;
  border-radius: 50%;
  // border: 1px solid #f56c6c;
}
</style>