<!-- 事件操作日志 -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
        <el-form-item label="操作类型" prop="operationType">
          <el-select v-model="queryParams.operationType" placeholder="操作类型">
            <el-option label="系统处理" :value="1" />
            <el-option label="人工处理" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="operationType" align="center" label="操作类型">
              <template slot-scope="scope">
                {{ scope.row.operationType == 1?'系统处理':'人工处理' }}
              </template>
            </el-table-column>
            <el-table-column prop="content" align="center" label="操作内容" />
            <!-- <el-table-column prop="creator" align="center" label="操作人员" /> -->
            <el-table-column prop="creatorId" align="center" label="操作账号" />
            <el-table-column prop="userIp" align="center" label="操作人IP" />
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
      <el-dialog :visible="visible" width="888px" title="事件日志详情" append-to-body :close-on-click-modal='false'
                 @close="handleClose">
        <el-descriptions :column="2" size="medium" border class="mt-xl">
          <el-descriptions-item label="事件ID" :value="1"> {{ list.eventId }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="事件名称" :value="2"> {{ list.eventName }}
          </el-descriptions-item> -->
          <el-descriptions-item label="操作人" :value="3"> {{ list.creator }}
          </el-descriptions-item>
          <el-descriptions-item label="操作账号" :value="4"> {{ list.creatorId }}
          </el-descriptions-item>
          <el-descriptions-item label="操作类型" :value="5">
            {{ list.operationType == 1? '系统处理' :list.operationType == 2? '人工处理'  : '' }}
          </el-descriptions-item>
          <el-descriptions-item label="操作内容" :value="6"> {{ list.content }}
          </el-descriptions-item>
          <el-descriptions-item label="操作结果" :value="7"> {{ list.status == 1?'成功':'失败' }}
          </el-descriptions-item>
          <el-descriptions-item label="操作时间" :value="8"> {{ parseTime(list.createTime) }}
          </el-descriptions-item>
          <!-- <el-descriptions-item label="事件地址" :value="9"> {{ list.address }}
          </el-descriptions-item>
          <el-descriptions-item label="摄像机名称" :value="10"> {{ list.deviceName }}
          </el-descriptions-item> -->
        </el-descriptions>
        <div slot='footer' class="dialog-footer">
          <el-button @click="handleClose">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEventLog } from '@/api/admin/diary'
export default {
  components: {},
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        eventId: null,
      },
      total: 0,
      tableData: [],
      list: [],
      visible: false,
      loading: false,
    }
  },
  computed: {},
  watch: {
    $route(val) {
      this.id = this.$route.query.id
      this.getList()
    },
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.queryParams.eventId = this.$route.query.id
      this.loading = true
      getEventLog(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
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
    handleClose() {
      this.visible = false
    },
    handleDetails(row) {
      this.list = row
      this.visible = true
    },
  },
}
</script>
<style lang='scss' scoped>
</style>