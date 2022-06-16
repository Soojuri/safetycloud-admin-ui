<!-- 基础信息-空间目录 -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="70px">
        <el-form-item label="空间名称" prop="spaceName" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.spaceName" placeholder="请输入空间名称">
          </el-input>
        </el-form-item>
        <el-form-item label="空间状态" prop="status">
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
            <el-table-column prop="spaceName" align='center' label="空间名称" />
            <el-table-column prop="deviceCount" align='center' label="设备数量" />
            <el-table-column prop="remark" align='center' label="空间描述" />
            <el-table-column prop="status" align='center' label="空间状态">
              <template slot-scope="scope">
                <template v-if="scope.row.status == 0">
                  <span class="status_text" style="color: #f56c6c">已停用</span>
                </template>
                <template v-if="scope.row.status == 1">
                  <span class="status_text" style="color: #67c23a">已启用</span>
                </template>
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
import { getSpaceList, delSpace, putSpace } from '@/api/app/camera/space'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        spaceName: null,
        status: null,
      },
      total: 0,
      protocolTypeDict: [], //协议类型字典
      tableData: [],
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
    }
  },
  watch: {},
  mounted() {
    this.getList()
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    getList() {
      this.loading = true
      getSpaceList(this.queryParams)
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
      // if (!this.permissions.camera_space_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      // if (!this.permissions.camera_space_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.spaceId
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
      this.$confirm('是否确认删除该空间', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delSpace(row.spaceId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleChangeStatus(row) {
      // if (!this.permissions.camera_space_stop) return this.msgWarn('权限不足')
      const spaceId = row.spaceId
      const status = row.status == 0 ? 1 : 0
      putSpace({ spaceId, status }).then((res) => {
        if (res.data.data) {
          this.msgSuccess(`${status == 1 ? '启用成功' : '停用成功'}`)
          this.getList()
        }
      })
    },
    handleDetails(row) {
      // if (!this.permissions.camera_space_view) return this.msgWarn('权限不足')
      const id = row.spaceId
      this.$router.push({
        path: '/app/baseinfo/space/info/index/',
        query: { id },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>