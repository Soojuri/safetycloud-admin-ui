<template>
  <div class='sub-page'>
    <div class="g-card">
      <!-- <div class="tit">账号信息</div>
      <div class="information">
        <el-descriptions :column="3" size="medium" class="mt-xl">
          <el-descriptions-item label="管理员账号"> {{ form.username }}
          </el-descriptions-item>
          <el-descriptions-item label="账号状态">
            <template v-if="form.status == 0">
              <span class="grey_status"></span>
              <span class="status_text">未启用</span>
            </template>
            <template v-if="form.status == -2">
              <span class="yellow_status"></span>
              <span class="status_text">检查状态超时</span>
            </template>
            <template v-if="form.status == -1">
              <span class="grey_status"></span>
              <span class="status_text">离线</span>
            </template>
            <template v-if="form.status == -3">
              <span class="yellow_status"></span>
              <span class="status_text">未激活</span>
            </template>
            <template v-if="form.status == 1">
              <span class="green_status"></span>
              <span class="status_text">在线</span>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="账号创建时间"> {{ parseTime(form.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item labelStyle="white-space: nowrap;" :span="3" label="备注"> {{ form.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </div> -->
      <div class="tit">企业信息</div>
      <div class="information">
        <el-descriptions :column="3" size="medium" class="mt-xl">

          <el-descriptions-item label="企业名称"> {{ form.enterpriseName }}
          </el-descriptions-item>
          <el-descriptions-item label="统一社会信用代码"> {{ form.enterpriseCode }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="所属省市区">
            {{ form.province }}{{ form.city }}{{ form.county }}
          </el-descriptions-item> -->
          <el-descriptions-item label="详细地址"> {{ form.address }}
          </el-descriptions-item>
          <el-descriptions-item label="企业类型"> {{ formatType(form) }}
          </el-descriptions-item>
          <el-descriptions-item label="企业电话"> {{ form.enterprisePhone }}
          </el-descriptions-item>
          <el-descriptions-item label="传真"> {{ form.fax }}
          </el-descriptions-item>
          <el-descriptions-item label="经济类型"> {{ formatEconomicType(form) }}
          </el-descriptions-item>
          <el-descriptions-item label="企业性质"> {{ formatBusinessNature(form) }}
          </el-descriptions-item>
          <el-descriptions-item label="主要危险类型"> {{ formatMainRiskType(form) }}
          </el-descriptions-item>
          <el-descriptions-item label="从业人数"> {{ form.staffNum }}
          </el-descriptions-item>
          <el-descriptions-item label="成立日期"> {{ parseTime(form.establishmentDate) }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="注册资金（万元）">
          </el-descriptions-item>
          <el-descriptions-item label="年利润（万元）">
          </el-descriptions-item>
          <el-descriptions-item label="监管机构">
          </el-descriptions-item>
          <el-descriptions-item label="应急机构">
          </el-descriptions-item>
          <el-descriptions-item label="安全生产许可证号">
          </el-descriptions-item>
          <el-descriptions-item label="资格证编号">
          </el-descriptions-item>
          <el-descriptions-item label="安全生产标准化等级">
          </el-descriptions-item>
          <el-descriptions-item label="安全标准化评定单位">
          </el-descriptions-item> -->
          <!-- <el-descriptions-item label="安全标准化评定时间"> {{ parseTime(form.establishmentDate) }}
          </el-descriptions-item> -->
          <!-- <el-descriptions-item label="安全标准类型">
          </el-descriptions-item>
          <el-descriptions-item label="占地面积（平方米）">
          </el-descriptions-item>
          <el-descriptions-item label="有无重大危险源">
          </el-descriptions-item> -->
          <el-descriptions-item label="邮政编码"> {{ form.postCode }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="安全生产管理机构">
          </el-descriptions-item> -->
          <el-descriptions-item label="主要负责人"> {{ form.enterpriseLeader }}
          </el-descriptions-item>
          <el-descriptions-item label="主要负责人电话"> {{ form.enterpriseLeaderPhone }}
          </el-descriptions-item>
          <el-descriptions-item label="主要负责人手机"> {{ form.enterpriseLeaderCellPhone }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="日常联系人">
          </el-descriptions-item>
          <el-descriptions-item label="日常联系人电话">
          </el-descriptions-item>
          <el-descriptions-item label="日常联系人手机">
          </el-descriptions-item> -->
          <el-descriptions-item labelStyle="white-space: nowrap;" :span="3" label="备注"> {{ form.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="tit">资质证书</div>
      <div class="g-table mt-xl">
        <el-table v-loading="loading" border :data="tableData">
          <el-table-column prop="certificateGainDate" align="center" label="发证日期" width="160">
            <template slot-scope="scope">{{parseTime(scope.row.certificateGainDate)}}</template>
          </el-table-column>
          <el-table-column prop="certificateValidDate" align="center" label="有效日期" width="160">
            <template slot-scope="scope">{{parseTime(scope.row.certificateValidDate)}}</template>
          </el-table-column>
          <el-table-column prop="certificateId" align='center' label="资质编号" />
          <el-table-column prop="certificateName" align='center' label="资质名称" />
          <el-table-column prop="certificateType" align='center' label="资质类型">
            <template slot-scope="scope">
              <span v-if="scope.row.certificateType == 1">安全生产资质证书</span>
              <span v-if="scope.row.certificateType == 2">其他资质证书</span>
            </template>
          </el-table-column>
          <el-table-column prop="certificateInstitution" align='center' label="发证单位" />
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
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total1" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { getEnterprise, getEnterpriseInfoCertificateList } from '@/api/app/enterprise/enterprise.js'
export default {
  data() {
    return {
      form: {},
      queryParams: {
        size: 10,
        current: 1,
        enterpriseId: null,
      },

      loading: false,
      list: [],
      enterpriseType: [],
      economicType: [],
      businessNature: [],
      mainRiskType: [],
      tableData: [],
      id: null,
      total1: 0,
    }
  },
  computed: {},
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getDicts('enterprise_type').then((res) => {
      this.enterpriseType = res.data.data
      this.getList()
    })
    this.getDicts('economy_type').then((res) => {
      this.economicType = res.data.data
    })
    this.getDicts('business_nature').then((res) => {
      this.businessNature = res.data.data
    })
    this.getDicts('main_risk_type').then((res) => {
      this.mainRiskType = res.data.data
    })
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      this.queryParams.enterpriseId = this.$route.query.id
      getEnterpriseInfoCertificateList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })

      if (this.$route.query.id) {
        getEnterprise(this.$route.query.id).then((res) => {
          this.form = res.data.data
        })
      }
    },
    formatType(row) {
      return this.selectDictLabel(this.enterpriseType, row.enterpriseType)
    },
    formatEconomicType(row) {
      return this.selectDictLabel(this.economicType, row.economicType)
    },
    formatBusinessNature(row) {
      return this.selectDictLabel(this.businessNature, row.businessNature)
    },
    formatMainRiskType(row) {
      return this.selectDictLabel(this.mainRiskType, row.mainRiskType)
    },
    handleClear() {
      this.queryParams.size = 10
      this.queryParams.current = 1
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