<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="统一社会信用代码" prop="enterpriseCode">
          <el-input v-model="queryParams.enterpriseCode" placeholder="请输入统一社会信用代码"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="enterpriseName">
          <el-input v-model="queryParams.enterpriseName" placeholder="请输入企业名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" style="width: 120px">
            <el-option label="未审核" :value="0" />
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="2" />
            <el-option label="存在风险" :value="3" />
            <el-option label="审核未通过" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button type="primary" @click="handleQuery">搜 索</el-button>
          <el-button @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-opera">
          <el-button type="primary" icon='el-icon-plus' @click="handleAdd">新 增</el-button>
        </div>
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="enterpriseCode" align='center' label="统一社会信用代码" />
            <el-table-column prop="enterpriseName" align='center' label="企业名称" />
            <!-- <el-table-column prop="province" align='center' label="所属省市区">
              <template slot-scope="scope">
                <span>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.county }}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="enterpriseType" align='center' label="企业类型">
              <template slot-scope="scope">
                <span>{{ formatType(scope.row) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="enterpriseLeader" align='center' label="主要负责人" />
            <el-table-column prop="enterpriseLeaderCellPhone" align='center' label="负责人手机号" />
            <el-table-column prop="staffNum" align='center' label="从业人数" />
            <el-table-column prop="status" align='center' label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 0" style="color: #909399">
                  未审核
                </span>
                <span v-if="scope.row.status == 1" style="color: #67c23a">
                  正常
                </span>
                <span v-if="scope.row.status == 2" style="color: #f56c6c">
                  停用
                </span>
                <span v-if="scope.row.status == 3" style="color: #e6a23c">
                  存在风险
                </span>
                <span v-if="scope.row.status == 4" style="color: #409eff">
                  审核未通过
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" width="160">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align='center' width="250">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleDetails(scope.row)">详情
                </el-button>
                <el-button size="mini" v-if="scope.row.status == 0" type="text" @click="handleAudit(scope.row)">审核
                </el-button>
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑
                </el-button>
                <el-button size="mini" :disabled="scope.row.status == 1?true:false" type="text"
                           @click="handleDelete(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>
      <!-- 审核弹窗 -->
      <el-dialog title="状态" :visible.sync="dialogVisible" width="width" @close="handleClose">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option label="未审核" :value="0"></el-option>
              <el-option label="正常" :value="1"></el-option>
              <el-option label="停用" :value="2"></el-option>
              <el-option label="存在风险" :value="3"></el-option>
              <el-option label="审核未通过" :value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSure">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹窗 -->
      <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="getList()">
      </pop-form>
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import { getEnterpriseList, delEnterprise, putEnterprise } from '@/api/app/enterprise/enterprise.js'
import { mapGetters } from 'vuex'

export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        enterpriseName: null,
        enterpriseCode: null,
        status: null,
      },
      form: {
        status: null,
      },
      total: 0,
      tableData: [],
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      dialogVisible: false,
      loading: false,
      activeName: 'work',
    }
  },
  watch: {},
  mounted() {
    this.getDicts('enterprise_type').then((res) => {
      this.dict.enterpriseType = res.data.data
      this.getList()
    })
    this.getDicts('economy_type').then((res) => {
      this.dict.economicType = res.data.data
    })
    this.getDicts('main_risk_type').then((res) => {
      this.dict.mainRiskType = res.data.data
    })
    this.getDicts('business_nature').then((res) => {
      this.dict.businessNature = res.data.data
    })
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    getList() {
      this.loading = true
      getEnterpriseList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleClose() {
      this.resetForm('form')
      this.dialogVisible = false
      this.getList()
    },
    handleSure() {
      putEnterprise(this.form).then((res) => {
        if (res.data.data) {
          this.handleClose()
          this.msgSuccess('修改成功')
        }
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    formatType(row) {
      return this.selectDictLabel(this.dict.enterpriseType, row.enterpriseType)
    },
    handleAdd() {
      // if (!this.permissions.baseinfo_tdeviceworkorder_add) {
      //   return this.msgWarn('权限不足')
      // }
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      // if (!this.permissions.baseinfo_tdeviceworkorder_edit) {
      //   return this.msgWarn('权限不足')
      // }
      this.formOptions.data.id = row.enterpriseId
      this.formOptions.visible = true
    },
    handleAudit(row) {
      // if (!this.permissions.baseinfo_tdeviceworkorder_edit) {
      //   return this.msgWarn('权限不足')
      // }
      this.form.enterpriseId = row.enterpriseId
      this.form.status = row.status
      this.dialogVisible = true
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
      // if (!this.permissions.baseinfo_tdeviceworkorder_delete) {
      //   return this.msgWarn('权限不足')
      // }
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delEnterprise(row.enterpriseId)
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
      // if (!this.permissions.baseinfo_tdeviceworkorder_view) {
      //   return this.msgWarn('权限不足')
      // }
      const id = row.enterpriseId
      this.$router.push({
        path: '/app/enterprise/enterprise/info/index/',
        query: { id },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
.step {
  height: 400px;
  width: 80%;
  display: inline-block;
  margin: 50px 0px;
  margin-left: -40%;
  left: 50%;
  position: relative;
}
.fault {
  height: 400px;
  width: 80%;
  display: inline-block;
  margin-left: -40%;
  left: 50%;
  position: relative;
}
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
