<!-- 故障管理-工单管理 -->
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
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-opera">
          <el-button type="primary" @click="handleAdd">新 增</el-button>
        </div>
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="enterpriseCode" align='center' label="统一社会信用代码" />
            <el-table-column prop="enterpriseName" align='center' label="企业名称" />
            <el-table-column prop="province" align='center' label="所属省市区">
              <template slot-scope="scope">
                <span>{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.county }}</span>
              </template>
            </el-table-column>
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
                <span v-if="scope.row.status == 0">
                  <a class="status-info"></a>
                  未审核
                </span>
                <span v-if="scope.row.status == 1">
                  <a class="status-success"></a>
                  正常
                </span>
                <span v-if="scope.row.status == 2">
                  <a class="status-danger"></a>
                  停用
                </span>
                <span v-if="scope.row.status == 3">
                  <a class="status-waring"></a>
                  存在风险
                </span>
                <span v-if="scope.row.status == 4">
                  <a class="status-primary"></a>
                  审核未通过
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" width="160">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align='center' width="250">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-info" type="text" @click="handleDetails(scope.row)">详情
                </el-button>
                <el-button size="mini" icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑
                </el-button>
                <el-button size="mini" icon="el-icon-delete" :disabled="scope.row.status == 1?true:false" type="text"
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
      <!-- 弹窗 -->
      <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="getList()">
      </pop-form>
      <!-- 详情 -->
      <el-dialog :visible.sync="dialogVisible" width="width">
        <el-tabs v-model="activeName" @tab-click="handleClick" stretch='true'>
          <el-tab-pane label="工单状态" name="work">
            <div class="step">
              <el-steps direction="vertical" :active="arr.status">
                <el-step title="已指派" :description="parseTime(arr.sentTime) "></el-step>
                <el-step title="驳回" :description="parseTime(arr.createTime) "></el-step>
                <el-step title="已受理" :description="parseTime(arr.acceptTime)"></el-step>
                <!-- <el-step v-if="arr.eventProgress !== 4 || arr.eventCheckTime != null" title="事件复核"
                     :description="parseTime(arr.eventCheckTime)">
            </el-step> -->
                <el-step title="已完成" :description="parseTime(arr.finishTime)"></el-step>
                <el-step title="已关闭" :description="parseTime(arr.createTime) "></el-step>
              </el-steps>
            </div>
          </el-tab-pane>
          <el-tab-pane label="基本信息" name="base">基本信息</el-tab-pane>
          <el-tab-pane label="故障记录" name="fault">
            <div class="fault">
              <el-descriptions :column="1" size="medium" class="mt-xl">
                <el-descriptions-item label="故障名称"> {{ arr.faultName }}
                </el-descriptions-item>
                <el-descriptions-item label="设备类型"> {{ arr.deviceType }}
                </el-descriptions-item>
                <el-descriptions-item label="设备型号"> {{ arr.deviceModel }}
                </el-descriptions-item>
                <el-descriptions-item label="故障描述"> {{ arr.faultDescription }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-tab-pane>
          <el-tab-pane label="维修记录" name="repair">维修记录</el-tab-pane>
        </el-tabs>
      </el-dialog>
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
      total: 0,
      tableData: [],
      arr: [],
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
      dialogVisible: false,
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
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleDetails(row) {
      this.dialogVisible = true
      this.arr = row
      // if (!this.permissions.baseinfo_tdeviceworkorder_view) {
      //   return this.msgWarn('权限不足')
      // }
      // const enterpriseId = row.enterpriseId
      // this.$router.push({
      //   path: '/app/camera/space/info/index/',
      //   query: { enterpriseId },
      // })
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
