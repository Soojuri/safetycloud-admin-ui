<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="状态">
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则名称" prop="configName" :rules="[$formRules.checkLen()]">
          <el-input v-model.trim="queryParams.configName" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label='事件模型' prop='algorithmId'>
          <el-select v-model="queryParams.algorithmId" placeholder="请选择事件模型">
            <el-option v-for="item in dict.algorithmIds" :key="item.algorithmId" :label="item.algorithmName"
                       :value="item.algorithmId">
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
            <el-table-column prop="configName" align="center" label="规则名称" />
            <el-table-column prop="algorithmName" align="center" label="事件模型" />
            <el-table-column prop="messageConfigName" align="center" label="消息配置" />
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1" style="color: #67c23a">
                  启用
                </span>
                <span v-if="scope.row.status == 0" style="color: #f56c6c">
                  禁用
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="updator" align="center" label="更新人" />
            <el-table-column prop="creator" align="center" label="创建人" />
            <el-table-column prop="createTime" align="center" label="发现时间">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" :disabled='scope.row.status == 1?true:false' type="text"
                           @click="handleDelete(scope.row)">删除
                </el-button>
                <el-button type="text" v-if="scope.row.status == 1 " @click="handleStop(scope.row)">禁用</el-button>
                <el-button type="text" v-if="scope.row.status == 0 " @click="handleStart(scope.row)">启用</el-button>
                <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
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
      <!-- 详情弹窗 -->
      <el-dialog :visible="diaVisible" width="500px" title="详情" append-to-body :close-on-click-modal='false'
                 @close="diaVisible = false">
        <el-descriptions :column="1" border size="medium" class="mt-xl">
          <el-descriptions-item label="规则名称"> {{ arr.configName }}
          </el-descriptions-item>
          <el-descriptions-item label="事件模型"> {{ arr.algorithmName }}
          </el-descriptions-item>
          <el-descriptions-item label="消息配置"> {{ arr.messageConfigName }}
          </el-descriptions-item>
          <el-descriptions-item label="更新人"> {{ arr.updator }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人"> {{ arr.creator }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            {{ arr.status == 1?'启用':'禁用' }}
          </el-descriptions-item>
        </el-descriptions>
        <div slot='footer'>
          <el-button type="primary" @click="diaVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import {
  getAlgorithmList,
  getAlertEventConfigList,
  delAlertEventConfig,
  putAlertEventConfig,
  updateStatus,
} from '@/api/app/alertEvent/alertEvent.js'
import { getConfigList } from '@/api/app/news/news.js'
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
        algorithmId: null,
      },
      total: 0,
      tableData: [],
      arr: [],
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
      diaVisible: false,
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    getConfigList({ size: 10000, current: 1 }).then((res) => {
      this.dict.messageConfigId = res.data.data.records
    })
    getAlgorithmList({ size: 10000, current: 1 }).then((res) => {
      this.dict.algorithmIds = res.data.data.records
    })
    this.getList()
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
      this.formOptions.data.id = row.configId
      this.formOptions.visible = true
    },
    handleDetail(row) {
      this.diaVisible = true
      this.arr = row
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
          return delAlertEventConfig(row.configId)
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
    handleStart(row) {
      updateStatus({ configId: row.configId, status: 1 }).then((res) => {
        if (res.data.data) {
          this.msgSuccess('启用成功')
          this.getList()
        }
      })
    },
    handleStop(row) {
      updateStatus({ configId: row.configId, status: 0 }).then((res) => {
        if (res.data.data) {
          this.msgSuccess('禁用成功')
          this.getList()
        }
      })
    },
    formatType(row) {
      return this.selectDictLabel(this.dict.algorithmIds, row.algorithmId)
    },
    formatMessageType(row) {
      return this.selectDictLabel(this.dict.messageConfigId, row.configId)
    },
    handleDetails(row) {
      // if (!this.permissions.camera_space_view) return this.msgWarn('权限不足')
      const id = row.eventId
      this.$router.push({
        path: '/app/event/manual/info/index/',
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