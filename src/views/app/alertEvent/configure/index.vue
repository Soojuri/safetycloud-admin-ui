<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="启用状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="启用状态">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称" prop="configName" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.configName" placeholder="请输入规则名称"></el-input>
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
            <el-table-column prop="configName" align="center" label="规则名称" />
            <!-- <el-table-column prop="noticeType" align="center" label="公告类型" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.noticeType == 1">通知</span>
                <span v-if="scope.row.noticeType == 2">公告</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1">
                  <a class="status-info"></a>
                  启用
                </span>
                <span v-if="scope.row.status == 0">
                  <a class="status-danger"></a>
                  禁用
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="notifierName" align="center" label="通知人" />
            <el-table-column prop="createName" align="center" label="创建人" />
            <el-table-column prop="createTime" align="center" label="发现时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" icon="el-icon-delete" type="text" @click="handleDelete(scope.row)">删除
                </el-button>
                <el-button type="text" icon="el-icon-close" v-if="scope.row.status == 1 "
                           @click="handleStop(scope.row)">禁用</el-button>
                <el-button type="text" icon="el-icon-check" v-if="scope.row.status == 0 "
                           @click="handleStart(scope.row)">启用</el-button>
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
import { getAlertEventConfigList, delAlertEventConfig, putAlertEventConfig } from '@/api/app/alertEvent/alertEvent.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        status: null,
        configName: null,
      },
      total: 0,
      tableData: [],
      dict: {},
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
    this.getDicts('space_protocol_type').then((res) => {
      this.dict.protocolType = res.data.data
      this.getList()
    })
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      getAlertEventConfigList(this.queryParams)
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
      // if (!this.permissions.notice_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      // if (!this.permissions.notice_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.noticeId
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
      // if (!this.permissions.notice_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delAlertEventConfig(row.noticeId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleStart(row) {
      putAlertEventConfig({ configId: row.configId, status: 1 }).then((res) => {
        if (res.data.data) {
          this.msgSuccess('启用成功')
          this.getList()
        }
      })
    },
    handleStop(row) {
      putAlertEventConfig({ configId: row.configId, status: 0 }).then((res) => {
        if (res.data.data) {
          this.msgSuccess('禁用成功')
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
  background: #409eff;
  border-radius: 50%;
  // border: 1px solid #409eff;
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
  background: #e6a23c;
  border-radius: 50%;
  // border: 1px solid #e6a23c;
}

.status-danger {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #f56c6c;
  border-radius: 50%;
  // border: 1px solid #f56c6c;
}
</style>