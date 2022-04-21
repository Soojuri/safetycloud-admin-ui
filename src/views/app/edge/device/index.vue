<!--  -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
        <el-form-item label='设备名称' prop='edgeDeviceName'>
          <el-input size='small' v-model='queryParams.edgeDeviceName' placeholder='请输入设备名称'></el-input>
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
            <el-table-column prop="edgeDeviceName" label="设备名称" />
            <el-table-column prop="edgeNodeName" label="绑定节点" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="updateTime" label="更新时间">
              <template slot-scope="scope">{{parseTime(scope.row.updateTime)}}</template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" :disabled="validatenull(scope.row.edgeNodeId)"
                           @click="handleUnBindNode(scope.row)">解绑
                </el-button>
                <el-button type="text" :disabled="!validatenull(scope.row.edgeNodeId)"
                           @click="handleBindNode(scope.row)">绑定节点
                </el-button>
                <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" :disabled="!validatenull(scope.row.edgeNodeId)"
                           @click="handleDelete(scope.row)">删除</el-button>
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
      <bind-node v-if="nodeOptions.visible" :visible.sync="nodeOptions.visible" :data="nodeOptions.data"
                 @ok="handleClear()"></bind-node>
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import BindNode from './bindNode.vue'
import { getEdgeDeviceList, delEdgeDevice, putNodeBind } from '@/api/app/edge/device'
import { mapGetters } from 'vuex'
export default {
  components: {
    PopForm,
    BindNode,
  },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        edgeDeviceName: null,
      },
      total: 0,
      tableData: [],
      formOptions: {
        visible: false,
        data: {},
      },
      nodeOptions: {
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
      getEdgeDeviceList(this.queryParams)
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
      if (!this.permissions.edge_device_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      if (!this.permissions.edge_device_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.edgeDeviceId
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
      if (!this.permissions.edge_device_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该终端设备', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delEdgeDevice(row.edgeDeviceId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleUnBindNode(row) {
      if (!this.permissions.edge_device_unbind) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认解绑该节点', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const data = {
            removed: [row.edgeNodeId],
            edgeDeviceId: row.edgeDeviceId,
          }
          return putNodeBind(data)
        })
        .then((res) => {
          if (res.data.code === 0) {
            that.msgSuccess('解绑成功')
            that.getList()
          }
        })
    },
    handleDetails(row) {
      const id = row.spaceId
      this.$router.push({
        path: '/app/camera/space/info/index/',
        query: { id },
      })
    },
    handleBindNode(row) {
      if (!this.permissions.edge_device_bind) return this.msgWarn('权限不足')
      this.nodeOptions.data = row
      this.nodeOptions.visible = true
    },
  },
}
</script>
<style lang='scss' scoped>
</style>