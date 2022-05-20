<!-- 基础信息-危险品登记 -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="危险品编号" prop="goodsNo" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.goodsNo" placeholder="请输入危险品编号"></el-input>
        </el-form-item>
        <el-form-item label="是否为危险化学品" prop="isDangerousChemicals">
          <el-select v-model="queryParams.isDangerousChemicals" placeholder="请选择">
            <el-option label="否" :value="0" />
            <el-option label="是" :value="1" />
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
            <el-table-column prop="goodsNo" align='center' label="危险品编号" />
            <el-table-column prop="goodsName" align='center' label="危险品名称" />
            <el-table-column prop="enterpriseId" align='center' label="企业名称" />
            <el-table-column prop="isDangerousChemicals" align='center' label="是否为危险化学品">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.isDangerousChemicals == 1">是</el-tag>
                <el-tag type="info" v-if="scope.row.isDangerousChemicals == 0">否</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="depositAddress" align='center' label="存放地点" />
            <el-table-column prop="availableQuantity" align='center' label="现有存储量" />
            <el-table-column prop="unit" align='center' label="单位" />
            <el-table-column prop="createTime" align='center' label="登记时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align='center'>
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" icon="el-icon-delete" :disabled="scope.row.status == 1?true:false" type="text"
                           @click="handleDelete(scope.row)">删除</el-button>
                <el-button v-if="scope.row.status" size="mini" icon="el-icon-close" type="text"
                           @click="handleChangeStatus(scope.row)">停用
                </el-button>
                <el-button v-if="scope.row.status == 0" size="mini" icon="el-icon-check" type="text"
                           @click="handleChangeStatus(scope.row)">启用
                </el-button>
                <el-button size="mini" icon="el-icon-info" type="text" @click="handleDetails(scope.row)">详情</el-button>
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
import { getDangerousList, delDangerous, putDangerous } from '@/api/app/baseinfo/dangerous.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        goodsNo: null,
        isDangerousChemicals: 1,
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
      getDangerousList(this.queryParams)
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
      this.formOptions.data.id = row.goodsId
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
      if (!this.permissions.camera_space_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delDangerous(row.goodsId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleChangeStatus(row) {
      if (!this.permissions.camera_space_stop) return this.msgWarn('权限不足')
      const goodsId = row.goodsId
      const status = row.status == 0 ? 1 : 0
      putDangerous({ goodsId, status }).then((res) => {
        if (res.data.data) {
          this.msgSuccess(`${status == 1 ? '启用成功' : '停用成功'}`)
          this.getList()
        }
      })
    },
    handleDetails(row) {
      if (!this.permissions.camera_space_view) return this.msgWarn('权限不足')
      const id = row.goodsId
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