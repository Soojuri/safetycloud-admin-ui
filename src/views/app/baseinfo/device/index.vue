<!-- 基础信息-设备管理 -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="设备编号" prop="deviceNo" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.deviceNo" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.deviceName" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 150px">
            <el-option v-for="item in statusOptions" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属空间" prop="spaceId">
          <el-select v-model="queryParams.spaceId" placeholder="请选择所属空间">
            <el-option v-for="item in arr" :key="item.spaceId" :label="item.spaceName" :value="item.spaceId">
            </el-option>
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
            <el-table-column prop="deviceNo" align='center' label="设备编号" />
            <el-table-column prop="deviceName" align='center' label="设备名称" />
            <!-- <el-table-column prop="productName" align='center' label="产品名称" /> -->
            <el-table-column prop="productName" align='center' label="产品名称">
              <template slot-scope="scope">{{scope.row.productName || '/'}}</template>
            </el-table-column>
            <!-- <el-table-column prop="deviceModel" align='center' label="设备型号" /> -->
            <el-table-column prop="deviceModel" align='center' label="设备型号">
              <template slot-scope="scope">{{scope.row.deviceModel || '/'}}</template>
            </el-table-column>
            <!-- <el-table-column prop="manufacturers" align='center' label="设备厂家" /> -->
            <el-table-column prop="manufacturers" align='center' label="设备厂家">
              <template slot-scope="scope">{{scope.row.manufacturers || '/'}}</template>
            </el-table-column>
            <el-table-column prop="enterpriseName" align='center' label="所属企业">
              <template slot-scope="scope">{{scope.row.enterpriseName  || '/'}}</template>
            </el-table-column>
            <!-- <el-table-column prop="enterpriseName" align='center' label="所属企业" /> -->
            <el-table-column prop="deviceType" align='center' label="设备类型" :formatter="formatDeviceType" />
            <!-- <el-table-column prop="spaceName" align='center' label="所属空间" /> -->
            <el-table-column prop="spaceName" align='center' label="所属空间">
              <template slot-scope="scope">{{scope.row.spaceName  || '/'}}</template>
            </el-table-column>
            <el-table-column prop="status" align='center' label="状态" :formatter="formatStatus" />
            <el-table-column prop="createTime" align='center' label="创建时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align='center' width="200">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" :disabled="scope.row.status == 1?true:false" type="text"
                           @click="handleDelete(scope.row)">删除</el-button>
                <el-button type="text" v-if="scope.row.status == -1 " @click="handleUndeploy(scope.row)">禁用</el-button>
                <el-button type="text" v-if="scope.row.status == 0 || scope.row.status == -3 "
                           @click="handleDeploy(scope.row)">启用</el-button>
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
      <pop-form v-if="formOptions.visible" :visible.sync="formOptions.visible" :data="formOptions.data" @ok="getList()">
      </pop-form>
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import { fetchList, undeploy, deploy, delObj, getStastics, refresh } from '@/api/device/instance'
import { getDeviceInfoList, delDeviceInfo, putDeviceInfo } from '@/api/app/baseinfo/device.js'
import { mapGetters } from 'vuex'
import { getSpaceList } from '@/api/app/camera/space.js'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        deviceNo: null,
        deviceName: null,
        spaceId: null,
        status: null,
      },
      total: 0,
      tableData: [],
      statusOptions: [],
      deviceTypeOptions: [],
      arr: [], //表格数据
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
    }
  },
  watch: {},
  mounted() {
    getSpaceList({ size: 10000, current: 1 }).then((res) => {
      this.arr = res.data.data.records
    })
    this.getList()
    this.getDicts('equipment_status').then((res) => {
      this.statusOptions = res.data.data
    })
    this.getDicts('device_type').then((res) => {
      this.deviceTypeOptions = res.data.data
    })
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    getList() {
      this.loading = true
      getDeviceInfoList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    formatStatus(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    formatDeviceType(row) {
      return this.selectDictLabel(this.deviceTypeOptions, row.deviceType)
    },
    handleAdd() {
      // if (!this.permissions.camera_space_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      // if (!this.permissions.camera_space_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.deviceId
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
          return delDeviceInfo(row.deviceId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleUndeploy(row) {
      // if (!this.permissions.device_instance_enable) return this.msgWarn('权限不足')
      undeploy(row.deviceId).then((res) => {
        if (res.data.data) {
          this.msgSuccess('禁用成功')
          this.getList()
        }
      })
    },
    handleDeploy(row) {
      // if (!this.permissions.device_instance_disable) return this.msgWarn('权限不足')
      deploy(row.deviceId).then((res) => {
        if (res.data.data) {
          this.msgSuccess('启用成功')
          this.getList()
        }
      })
    },
    handleDetails(row) {
      // if (!this.permissions.camera_space_view) return this.msgWarn('权限不足')
      const id = row.deviceId
      this.$router.push({
        path: '/app/baseinfo/device/info/index/',
        query: { id },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>