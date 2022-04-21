<!--  -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="120px">
        <el-form-item label='边缘计算池ID' prop='edgePoolId'>
          <el-input size='small' v-model='queryParams.edgePoolId' placeholder='请输入边缘计算池ID'></el-input>
        </el-form-item>
        <el-form-item label='边缘计算池名称' prop='poolName'>
          <el-input size='small' v-model='queryParams.poolName' placeholder='请输入边缘计算池名称'></el-input>
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
            <el-table-column prop="poolName" label="边缘计算池名称" show-overflow-tooltip />
            <el-table-column prop="edgePoolId" label="边缘计算池ID" show-overflow-tooltip />

            <el-table-column prop="createTime" label="创建时间" width="150">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="150">
              <template slot-scope="scope">{{parseTime(scope.row.updateTime)}}</template>
            </el-table-column>
            <el-table-column prop="remark" label="描述" />
            <el-table-column prop="createTime" label="操作">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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
                @ok="handleClear()">
      </pop-form>
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import { getPoolList, delPool } from '@/api/app/edge/pool'
import { mapGetters } from 'vuex'
export default {
  components: {
    PopForm,
  },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        edgePoolId: null,
        poolName: null,
      },
      total: 0,
      tableData: [],
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
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getPoolList(this.queryParams)
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
      if (!this.permissions.edge_pool_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      if (!this.permissions.edge_pool_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.edgePoolId
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
      this.queryParams.current = 1
      this.getList()
    },
    handleDelete(row) {
      if (!this.permissions.edge_pool_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该边缘运行池', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delPool(row.edgePoolId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleDetails(row) {
      const id = row.edgePoolId
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