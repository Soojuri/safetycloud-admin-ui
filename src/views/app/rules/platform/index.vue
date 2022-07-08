
<!-- 视频平台管理 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <el-form class="flex-nowrap" :model='queryParams' ref='queryParams' :inline='true' label-width="110px">
        <el-form-item label='平台名称' prop='platformName'>
          <el-input style="width:250px" size='small' v-model='queryParams.platformName' placeholder='请输入平台名称'>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='handleQuery' icon="el-icon-search">查询</el-button>
          <el-button @click='handleClear' icon="el-icon-delete">清 空</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="mb-m" size="small" @click="handleAdd">新 增</el-button>
      <!-- 表格数据 -->
      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column prop="platformType" label="平台类型" :formatter="formatPlatformType">
        </el-table-column>
        <el-table-column prop="platformName" label="平台名称"></el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" v-if="scope.row.status == 1">已启用</el-tag>
              <el-tag size="medium" type="info" v-else>未启用</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="平台地址" width="180" prop="host">
        </el-table-column>
        <el-table-column prop="appKey" label="平台Key"></el-table-column>
        <el-table-column label="创建时间" prop="createTime">
          <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" :disabled="scope.row.status" size="mini" icon="el-icon-delete"
                       @click="deletePlatform(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="g-page-x mt-m">
        <pagination v-show='total>0' :total='total' :page.sync='queryParams.current' :limit.sync='queryParams.size'
                    @pagination='getList' />
      </div>
    </div>
    <data-form :visible.sync="editForm.visible" :data="editForm.data" @ok="getList"></data-form>
  </div>
</template>

<script>
import DataForm from './data-form'
import { getVideoPlatformList, delVideoPlatform } from '@/api/app/rules/platform'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: { DataForm },
  data() {
    return {
      queryParams: {
        size: 10, //分页数
        current: 1, //当前页
        status: null,
        platformName: null,
      },
      platformType: [],
      producerOptions: [],
      tableData: [], //表格数据
      total: 0, //总条数
      loading: false,
      editForm: {
        visible: false,
        data: {},
      },
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  mounted() {
    this.getDicts('video_status').then((res) => {
      this.statusOptions = res.data.data
    })
    this.getDicts('video_device_producer').then((res) => {
      this.producerOptions = res.data.data
    })

    this.getDicts('video_platform_type').then((res) => {
      this.platformType = res.data.data
    })
    this.getList()
  },
  methods: {
    //获取页面列表数据
    getList() {
      this.loading = true
      getVideoPlatformList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch((err) => {
          this.loading = false
        })
    },
    // 状态字典映射
    formatStatus(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 设备厂家字典映射
    formatProducer(row) {
      return this.selectDictLabel(this.producerOptions, row.producer)
    },
    formatPlatformType(row) {
      return this.selectDictLabel(this.platformType, row.platformType)
    },
    //搜索
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    //初始化查询列表
    handleClear() {
      this.resetForm('queryParams')
      this.handleQuery()
    },
    handleEdit(row) {
      if (!this.permissions.rules_platform_edit) return this.msgWarn('权限不足')
      console.log(row)
      this.editForm = {
        visible: true,
        data: {
          id: row.platformId,
          title: '编辑',
        },
      }
    },
    handleAdd() {
      if (!this.permissions.rules_platform_add) return this.msgWarn('权限不足')
      this.editForm = {
        visible: true,
        data: {
          title: '新增',
        },
      }
    },
    handleChannelView(row) {
      this.$router.push({
        path: `/video/device/channels/${row.videoId}`,
      })
    },
    chooseChannel(platform) {
      this.$refs.chooseChannelDialog.openDialog(platform.serverGbId, this.initData)
    },
    deletePlatform: function (platform) {
      if (!this.permissions.rules_platform_delete) return this.msgWarn('权限不足')
      var that = this
      that
        .$confirm('确认删除该平台?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          return delVideoPlatform(platform.platformId)
        })
        .then((res) => {
          if (res.data.data) {
            that.handleCurrentPageCalculateByDelete()
            that.msgSuccess('删除成功')
            that.handleQuery()
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
  },
}
</script>
<style lang='scss' scoped>
</style>