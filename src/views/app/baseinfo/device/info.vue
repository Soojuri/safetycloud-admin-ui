<template>
  <div class='sub-page'>
    <div class="g-card">
      <div class="tit">设备信息</div>
      <div class="information">
        <el-descriptions :column="3" size="medium" class="mt-xl">
          <el-descriptions-item label="设备编号"> {{ form.deviceId }}
          </el-descriptions-item>
          <el-descriptions-item label="设备状态">
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
          <el-descriptions-item label="企业名称"> {{ form.enterpriseName }}
          </el-descriptions-item>
          <el-descriptions-item label="设备名称"> {{ form.deviceName }}
          </el-descriptions-item>
          <el-descriptions-item label="设备类型"> {{formatDeviceType(form)}}
          </el-descriptions-item>
          <el-descriptions-item label="父级设备"> {{ form.parentId }}
          </el-descriptions-item>
          <el-descriptions-item label="物联产品"> {{ form.productName }}
          </el-descriptions-item>
          <el-descriptions-item label="设备型号"> {{ form.deviceModel }}
          </el-descriptions-item>
          <el-descriptions-item label="设备厂商"> {{ form.manufacturers }}
          </el-descriptions-item>
          <el-descriptions-item label="所属空间"> {{ form.spaceName }}
          </el-descriptions-item>
          <el-descriptions-item label="所属省市区"> {{ form.city }}
          </el-descriptions-item>
          <el-descriptions-item label="设备地址"> {{ form.deviceAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间"> {{ parseTime(form.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人员"> {{ form.creatorId }}
          </el-descriptions-item>
          <el-descriptions-item label="最后上线时间"> {{ form.lastOnlineTime }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间"> {{ parseTime(form.updateTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新人员"> {{ form.updatorId }}
          </el-descriptions-item>
          <el-descriptions-item label="最后离线时间"> {{ form.lastOfflineTime }}
          </el-descriptions-item>
          <el-descriptions-item labelStyle="white-space: nowrap;" :span="3" label="备注"> {{ form.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="tit">设备故障维修记录</div>
      <div class="g-table mt-xl">
        <el-table v-loading="loading" border :data="tableData">
          <el-table-column prop="workOrderId" align='center' label="工单编号" />
          <el-table-column prop="faultName" align='center' label="故障名称" />
          <el-table-column prop="faultType" align='center' label="故障类型">
            <template slot-scope="scope">
              <span v-if="scope.row.faultType == 1">网络通信</span>
              <span v-if="scope.row.faultType == 2">设备断电</span>
              <span v-if="scope.row.faultType == 3">设备损坏</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceName" align='center' label="目标设备" />
          <el-table-column prop="deviceId" align='center' label="设备编号" />
          <el-table-column prop="status" align='center' label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">
                <a class="status-info"></a>
                待处理
              </span>
              <span v-if="scope.row.status == 1">
                <a class="status-primary"></a>
                处理中
              </span>
              <span v-if="scope.row.status == 2">
                <a class="status-success"></a>
                已处理
              </span>
              <span v-if="scope.row.status == 3">
                <a class="status-danger"></a>
                误报
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="creator" align='center' label="创建人" />
          <el-table-column prop="repairer" align='center' label="修理人" />
          <el-table-column prop="repairTime" align='center' label="维修时间" />
          <el-table-column label="操作" align='center' width="100">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-info" type="text" @click="handleDetails(scope.row)">详情
              </el-button>
              <!-- <el-button size="mini" icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑
              </el-button>
              <el-button size="mini" icon="el-icon-delete" :disabled="scope.row.status == 1?true:false" type="text"
                         @click="handleDelete(scope.row)">删除
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total1" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>
      <!-- 详情 -->
      <el-dialog title="故障记录详情" :visible.sync="dialogVisible" width="888px">
        <el-descriptions :column="2" size="medium" class="mt-xl">
          <el-descriptions-item labelStyle="white-space: nowrap" contentStyle="overflow:hidden;text-overflow:ellipsis;"
                                label="工单编号">
            <el-tooltip effect="dark" :content="arr.workOrderNo" placement="top">
              <span>{{ arr.workOrderNo }}</span>
            </el-tooltip>
          </el-descriptions-item>
          <el-descriptions-item label="故障名称"> {{ arr.faultName }}
          </el-descriptions-item>
          <el-descriptions-item label="故障类型">
            {{ arr.faultType == 0?'其它故障':arr.faultType == 1?'网络通信':arr.faultType == 2?'设备断电':arr.faultType == 3?'设备损坏':'配置错误' }}
          </el-descriptions-item>
          <el-descriptions-item label="故障来源"> {{ arr.source == 1?'设备上报':'用户报修' }}
          </el-descriptions-item>
          <el-descriptions-item label="目标设备"> {{ arr.deviceName }}
          </el-descriptions-item>
          <el-descriptions-item label="故障状态">
            {{ arr.status == 0?'待处理':arr.status == 1?'处理中':arr.status == 2?'已处理':'误报' }}
          </el-descriptions-item>
          <el-descriptions-item label="故障时间"> {{parseTime(arr.faultTime)}}
          </el-descriptions-item>
          <el-descriptions-item label="故障描述"> {{arr.faultDescription}}
          </el-descriptions-item>
          <el-descriptions-item :span="2" label="故障图片">
            <img :src="arr.faultPictureUrl" alt="">
          </el-descriptions-item>
          <el-descriptions-item label="故障备注"> {{arr.remark}}
          </el-descriptions-item>
          <el-descriptions-item label="故障可能原因"> {{arr.repairPossibleReason}}
          </el-descriptions-item>
          <el-descriptions-item label="维修时间"> {{parseTime(arr.repairTime)}}
          </el-descriptions-item>
          <el-descriptions-item label="维修人"> {{arr.repairer}}
          </el-descriptions-item>
          <el-descriptions-item label="维修方法"> {{arr.repairSolution}}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间"> {{parseTime(arr.createTime)}}
          </el-descriptions-item>
          <el-descriptions-item label="创建人"> {{arr.creator}}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间"> {{parseTime(arr.updateTime)}}
          </el-descriptions-item>
          <el-descriptions-item label="更新人"> {{arr.updator}}
          </el-descriptions-item>
          <el-descriptions-item :span="2" label="维修图片">
            <img :src="arr.repairPictureUrl" alt="">
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
  </div>
  </div>
</template>

<script>
import { getDeviceInfo } from '@/api/app/baseinfo/device.js'
import { getFaultRecordList, delFaultRecord, putFaultRecord } from '@/api/app/fault/record'
export default {
  data() {
    return {
      form: {},
      queryParams: {
        size: 10,
        current: 1,
        faultType: null,
        deviceId: null,
        status: null,
      },

      loading: false,
      list: [],
      deviceTypeOptions: [],
      tableData: [],
      id: null,
      total1: 0,
      dialogVisible: false,
      arr: [],
    }
  },
  computed: {},
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getList()
    this.getDicts('device_type').then((res) => {
      this.deviceTypeOptions = res.data.data
    })
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      this.queryParams.deviceId = this.$route.query.id
      getFaultRecordList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })

      if (this.$route.query.id) {
        getDeviceInfo(this.$route.query.id).then((res) => {
          this.form = res.data.data
        })
      }
    },
    formatDeviceType(row) {
      return this.selectDictLabel(this.deviceTypeOptions, row.deviceType)
    },
    handleClear() {
      this.queryParams.size = 10
      this.queryParams.current = 1
      this.getList()
    },
    handleDetails(row) {
      this.dialogVisible = true
      this.arr = row
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