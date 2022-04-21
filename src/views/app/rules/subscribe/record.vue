<!-- 订阅记录 -->
<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
        <el-form-item label='配置名称' prop='subscriptionName'>
          <el-input size='small' v-model='queryParams.subscriptionName' placeholder='请输入配置名称'></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="isSuccess">
          <el-select v-model="queryParams.isSuccess" placeholder="请选择">
            <el-option label="成功" :value="1"></el-option>
            <el-option label="失败" :value="0"></el-option>
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
            <el-table-column prop="subscriptionId" label="订阅配置ID" />
            <el-table-column prop="subscriptionName" label="配置名称" />
            <el-table-column prop="subscribeType" label="订阅类型" width="200">
              <template slot-scope="scope">{{scope.row.subscribeType == 1 ?'URL接口推送' : '消息服务订阅'}}</template>
            </el-table-column>
            <el-table-column prop="isSuccess" label="状态">
              <template slot-scope="scope">{{scope.row.isSuccess == 1 ? '成功' : '失败'}}</template>
            </el-table-column>
            <el-table-column prop="result" label="推送结果" />
            <el-table-column label="推送时间" prop="createTime" width="200">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
          </el-table>
        </div>
        <div class="g-page-x mt-m">
          <pagination :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size"
                      @pagination="getList" />
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
// import PopForm from './popForm.vue'
import { getSubscribeRecordList } from '@/api/app/rules/subscribe'
export default {
  components: {
    // PopForm
  },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        subscriptionName: null,
        isSuccess: null,
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
  computed: {},
  watch: {},
  mounted() {
    this.queryParams.subscriptionName = this.$route.query.name
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getSubscribeRecordList(this.queryParams)
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
    handleDelete(row) {
      const that = this
      this.$confirm('是否确认删除该空间', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // return delSpace(row.spaceId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleDetails(row) {
      // const id = row.spaceId
      // this.$router.push('/app/camera/space/info/index/' + id)
    },
  },
}
</script>
<style lang='scss' scoped>
</style>