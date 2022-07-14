<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
        <el-form-item label="作业ID" prop="taskId">
          <el-input v-model.trim="queryParams.taskId" placeholder="请输入作业ID"></el-input>
        </el-form-item>
        <el-form-item label="作业名称" prop="taskName">
          <el-input v-model.trim="queryParams.taskName" placeholder="请输入作业名称"></el-input>
        </el-form-item>
        <el-form-item label="操作结果" prop="status">
          <el-select v-model="queryParams.status" placeholder="操作结果">
            <el-option label="成功" :value="1" />
            <el-option label="失败" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间" prop="createTime">
          <el-date-picker v-model="value" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                          end-placeholder="结束日期" value-format="timestamp">
          </el-date-picker>
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
            <el-table-column prop="taskId" align="center" label="任务作业ID" />
            <el-table-column prop="taskName" align="center" label="任务作业名称" />
            <el-table-column prop="operationType" align="center" label="变更类型">
              <template slot-scope="scope">
                <el-tag type="success" plain v-if="scope.row.operationType == 1">创建作业</el-tag>
                <el-tag type="success" plain v-if="scope.row.operationType == 2">启动作业</el-tag>
                <el-tag type="success" plain v-if="scope.row.operationType == 3">更新作业</el-tag>
                <el-tag type="warning" plain v-if="scope.row.operationType == 4">停止作业</el-tag>
                <el-tag type="warning" plain v-if="scope.row.operationType == 5">删除作业</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="creator" align="center" label="操作人员" />

            <el-table-column prop="status" align="center" label="操作结果">
              <template slot-scope="scope">
                <el-tag type="primary" plain v-if="scope.row.status == 1">成功</el-tag>
                <el-tag type="info" plain v-if="scope.row.status == 0">失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="操作时间">
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
      <el-dialog :visible="formOptions.visible" width="888px" title="作业日志详情" append-to-body
                 :close-on-click-modal='false' @close="handleClose">
        <el-descriptions :column="2" size="medium" class="mt-xl">
          <el-descriptions-item label="作业ID" :value="1"> {{ list.taskId }}
          </el-descriptions-item>
          <el-descriptions-item label="作业名称" :value="2"> {{ list.content }}
          </el-descriptions-item>
          <el-descriptions-item label="作业状态" :value="3">{{ formatTaskStatus(list) }}
          </el-descriptions-item>
          <el-descriptions-item label="变更类型" :value="4">
            {{ list.operationType == 1? '创建作业' :list.operationType == 2? '启动作业' :list.operationType == 3? '更新作业' :list.operationType == 4?'停止作业' :list.operationType == 5?'删除作业' : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="操作人" :value="5"> {{ list.creator }}
          </el-descriptions-item>
          <el-descriptions-item label="操作结果" :value="6"> {{ list.status == 1?'成功':'失败' }}
          </el-descriptions-item>
          <el-descriptions-item label="算法模型" :value="7"> {{ list.algorithmName }}
          </el-descriptions-item>
          <el-descriptions-item label="操作时间" :value="8"> {{ parseTime(list.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item labelStyle="white-space: nowrap"
                                contentStyle="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" label="摄像机ID"
                                :value="9">
            <el-tooltip effect="dark" :content="list.deviceId" placement="top">
              <span>{{ list.deviceId }}</span>
            </el-tooltip>
          </el-descriptions-item>
          <el-descriptions-item label="摄像机名称" :value="10"> {{ list.deviceName }}
          </el-descriptions-item>
        </el-descriptions>
        <div slot='footer' class="dialog-footer">
          <el-button @click="handleClose">关 闭</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getWorkList, delWork } from '@/api/admin/diary'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        taskId: null,
        taskName: null,
        status: null,
        startTime: null,
        endTime: null,
      },
      dict: {
        taskStatus: [],
      },
      total: 0,
      value: [],
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
    this.getDicts('task_status').then((res) => {
      this.dict.taskStatus = res.data.data
    })
  },
  //方法集合
  methods: {
    getList() {
      this.queryParams.startTime = this.value[0]
      this.queryParams.endTime = this.value[1]
      this.loading = true
      getWorkList(this.queryParams)
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
      if (!this.permissions.diary_work_view) return this.msgWarn('权限不足')
      this.list = row
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
    handleClose() {
      this.formOptions.visible = false
    },
    handleClear() {
      this.value = []
      this.queryParams.startTime = null
      this.queryParams.endTime = null
      this.resetForm('queryParams')
      this.getList()
    },
    handleDelete(row) {
      if (!this.permissions.diary_work_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delWork(row.taskLogId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    formatTaskStatus(row) {
      return this.selectDictLabel(this.dict.taskStatus, row.taskStatus)
    },
  },
}
</script>

<style lang='scss' scoped>
</style>