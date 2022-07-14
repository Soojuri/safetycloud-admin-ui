<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="100px">
        <el-form-item label="摄像头编号" prop="deviceNo">
          <el-input v-model.trim="queryParams.deviceNo" placeholder="请输入摄像头编号"></el-input>
        </el-form-item>
        <el-form-item label="摄像头名称" prop="deviceName">
          <el-input v-model.trim="queryParams.deviceName" placeholder="请输入摄像头名称"></el-input>
        </el-form-item>
        <el-form-item label="操作类型" prop="logType">
          <el-select v-model="queryParams.logType" placeholder="操作类型">
            <el-option label="设备离线" :value="0" />
            <el-option label="设备上线" :value="1" />
            <el-option label="设备生命周期变更" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">查 询</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column type="index" align="center" label="序号" />
            <el-table-column prop="deviceNo" align="center" label="摄像头编号" />
            <el-table-column prop="deviceName" align="center" label="摄像头名称" />
            <el-table-column prop="logType" align="center" label="日志类型">
              <template slot-scope="scope">
                <el-tag type="warning" plain v-if="scope.row.logType == 0">设备离线</el-tag>
                <el-tag type="success" plain v-if="scope.row.logType == 1">设备上线</el-tag>
                <el-tag plain v-if="scope.row.logType == 2">设备生命周期变更</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="spaceName" align="center" label="空间目录" />
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">详情</el-button>
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
      <pop-form v-if="formOptions.visible" :visible.sync="formOptions.visible" :data="formOptions.data" @ok="getList()">
      </pop-form>
    </div>
  </div>
</template>

<script>
import PopForm from '@/views/admin/diary/device/popForm.vue'
import { getDeviceList, delDevice } from '@/api/admin/diary'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        deviceNo: null,
        deviceName: null,
        logType: null,
      },
      total: 0,
      tableData: [],
      list: [],
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getList()
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      getDeviceList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleEdit(row) {
      if (!this.permissions.diary_device_view) return this.msgWarn('权限不足')
      this.formOptions.data = row
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
      if (!this.permissions.diary_device_view) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delDevice(row.logId)
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

<style lang='scss' scoped>
</style>