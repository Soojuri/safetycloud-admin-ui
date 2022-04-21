
<!-- 视频设备 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <el-form class="flex-nowrap" :model='queryParams' ref='queryForm' :inline='true' label-width="110px">
        <el-form-item label='搜索内容' prop='keyword'>
          <el-input style="width:250px" size='small' v-model='queryParams.keyword' placeholder='请输入SIP服务国标编号/级联名称'>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择">
            <el-option label="在线" :value="1"></el-option>
            <el-option label="离线" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="mb-m" size="small" @click="handleAdd">新增</el-button>
      <!-- 表格数据 -->
      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column prop="serverGbId" label="SIP服务国标编号" width="240" align="center"></el-table-column>
        <el-table-column prop="name" label="级联名称" align="center"></el-table-column>
        <el-table-column label="是否启用" width="120" align="center">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" v-if="scope.row.enable">已启用</el-tag>
              <el-tag size="medium" type="info" v-if="!scope.row.enable">未启用</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" v-if="scope.row.status">在线</el-tag>
              <el-tag size="medium" type="info" v-if="!scope.row.status">离线</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="地址" width="180" align="center">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.serverIp}}:{{scope.row.serverPort }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deviceGbId" label="设备国标编号" width="240" align="center"></el-table-column>
        <el-table-column prop="transport" label="信令传输模式" width="120" align="center"></el-table-column>
        <el-table-column prop="channelCount" label="通道数" align="center"></el-table-column>
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" icon="el-icon-thumb" type="text" @click="chooseChannel(scope.row)">选择通道</el-button>
            <el-button size="mini" :disabled="scope.row.enable" icon="el-icon-delete" type="text"
                       @click="deletePlatform(scope.row)">删除</el-button>
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
    <chooseChannelDialog ref="chooseChannelDialog"></chooseChannelDialog>
  </div>
</template>

<script>
import { queryPlatform, deletePlatform } from '@/api/app/camera/gbCascade'
import DataForm from './data-form'
import chooseChannelDialog from './chooseChannel.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'gbCascade',
  components: { DataForm, chooseChannelDialog },
  data() {
    return {
      queryParams: {
        size: 10, //分页数
        current: 1, //当前页
        status: null,
        keyword: null,
      },
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
    this.getList()
  },
  methods: {
    //获取页面列表数据
    getList() {
      this.loading = true
      queryPlatform(this.queryParams)
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
    //搜索
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    //初始化查询列表
    handleClear() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleEdit(row) {
      if (!this.permissions.camera_gbCascade_edit) return this.msgWarn('权限不足')
      console.log(row)
      this.editForm = {
        visible: true,
        data: {
          id: row.id,
          title: '编辑',
        },
      }
    },
    handleAdd() {
      if (!this.permissions.camera_gbCascade_add) return this.msgWarn('权限不足')
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
      if (!this.permissions.camera_gbCascade_choose) return this.msgWarn('权限不足')
      this.$refs.chooseChannelDialog.openDialog(platform.serverGbId, this.initData)
    },
    deletePlatform: function (platform) {
      if (!this.permissions.camera_gbCascade_delete) return this.msgWarn('权限不足')
      var that = this
      that
        .$confirm('确认删除该级联?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          return deletePlatform(platform.serverGbId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleQuery()
          }
        })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>