<!-- 基础信息-车辆管理 -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="70px">
        <el-form-item label="车辆名称" prop="carName" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.carName" placeholder="请输入车辆名称"></el-input>
        </el-form-item>
        <el-form-item label="车牌号" prop="carNo" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.carNo" placeholder="请输入车牌号"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择" style="width: 120px">
            <el-option label="已禁用" :value="0" />
            <el-option label="已启用" :value="1" />
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
            <!-- <el-table-column prop="spaceId"  label="空间ID" /> -->
            <el-table-column prop="carName" align='center' label="车辆名称" />
            <el-table-column prop="carNo" align='center' label="车牌号" />
            <el-table-column prop="remark" align='center' label="描述" />
            <el-table-column prop="status" align='center' label="车辆状态">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status == 1">已启用</el-tag>
                <el-tag type="info" v-if="scope.row.status == 0">已停用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align='center' label="创建时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align='center' width="250">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" :disabled="scope.row.status == 1?true:false" type="text"
                           @click="handleDelete(scope.row)">删除</el-button>
                <el-button v-if="scope.row.status" size="mini" type="text" @click="handleChangeStatus(scope.row)">停用
                </el-button>
                <el-button v-if="scope.row.status == 0" size="mini" type="text" @click="handleChangeStatus(scope.row)">
                  启用
                </el-button>
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
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import { getCarInfoList, delCarInfo, putCarInfo } from '@/api/app/baseinfo/car.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        carName: null,
        carNo: null,
      },
      total: 0,
      protocolTypeDict: [], //协议类型字典
      tableData: [],
      dict: {
        commission: [],
      },
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
    }
  },
  watch: {},
  mounted() {
    this.getDicts('space_protocol_type').then((res) => {
      this.dict.protocolType = res.data.data
      this.getList()
    })
    this.getDicts('commission_list').then((res) => {
      this.dict.commission = res.data.data
    })
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    getList() {
      this.loading = true
      getCarInfoList(this.queryParams)
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
      return this.selectDictLabel(this.dict.protocolType, row.protocolType)
    },
    handleAdd() {
      // if (!this.permissions.camera_space_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      // if (!this.permissions.camera_space_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.carId
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
          return delCarInfo(row.carId)
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
      const carId = row.carId
      const status = row.status == 0 ? 1 : 0
      putCarInfo({ carId, status }).then((res) => {
        if (res.data.data) {
          this.msgSuccess(`${status == 1 ? '启用成功' : '停用成功'}`)
          this.getList()
        }
      })
    },
    handleDetails(row) {
      // if (!this.permissions.camera_space_view) return this.msgWarn('权限不足')
      const id = row.carId
      this.$router.push({
        path: '/app/camera/space/info/index/',
        query: { id },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>