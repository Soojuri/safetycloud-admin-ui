<!-- 相似重复事件 -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <div class="mt-m">
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="eventId" label="事件编号" align="center" />
            <el-table-column prop="eventName" label="事件类型名称" align="center" />
            <el-table-column prop="deviceName" label="设备名称" align="center" />
            <el-table-column prop="address" label="地址名称" align="center" />
            <el-table-column prop="eventStatus" label="事件状态" align="center">
              <template slot-scope="scope">
                <el-tag type="warning" plain v-if="scope.row.eventStatus == 0">待处理</el-tag>
                <el-tag type="success" plain v-if="scope.row.eventStatus == 1">已处理</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="发现时间" align="center">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDetails(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getSameEventList } from '@/api/app/event/manual'
export default {
  components: {},
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        id: null,
      },
      total: 0,
      tableData: [],
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
      this.loading = true
      this.queryParams.id = this.$route.query.id
      getSameEventList(this.queryParams)
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

    handleDetails(row) {
      const id = row.eventId
      this.$router.push({
        path: '/app/event/manual/info/index/',
        query: {
          id,
        },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>