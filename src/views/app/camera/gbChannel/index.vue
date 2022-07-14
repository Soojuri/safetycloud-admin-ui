
<!-- 视频设备 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <el-form class="flex-nowrap" :model='queryParams' ref='queryForm' :inline='true'>
        <el-form-item label='搜索内容' prop='keyword'>
          <el-input size='small' v-model.trim='queryParams.keyword' placeholder='请输入设备名称/国标编号'>
          </el-input>
        </el-form-item>
        <el-form-item label="设备厂家" prop="producer">
          <el-select v-model="queryParams.producer" style="width:180px" placeholder="请选择设备厂家">
            <el-option v-for="item in producerOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" prop="online">
          <el-select v-model="queryParams.online" placeholder="请选择设备状态">
            <el-option label="在线" :value="1"></el-option>
            <el-option label="离线" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="g-card">
      <!-- 表格数据 -->
      <el-table border v-loading='loading' :data='tableData'>
        <el-table-column prop='gbCode' label='国标设备编号' show-overflow-tooltip width="200" />
        <el-table-column prop='name' label='设备名称' />
        <el-table-column prop='channelCount' label='通道数' width="80" />
        <el-table-column prop='online' label='设备状态' width="100">
          <template slot-scope="scope">{{scope.row.online == 1 ? "在线":"离线" }}</template>
        </el-table-column>
        <el-table-column prop='deviceIp' label='设备IP' width="150" />
        <el-table-column prop='devicePort' label='设备端口' width="80" />
        <el-table-column prop='producer' label='设备厂家' width="150" :formatter="formatProducer" />
        <el-table-column prop='createTime' label='创建时间' width="150">
          <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column fixed="right" width="200" label='操作'>
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button icon="el-icon-view" :disabled="scope.row.online == 0 || scope.row.channelCount == 0 " type="text"
                       @click="handleChannelView(scope.row)">查看通道
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
    <data-form :visible.sync="editForm.visible" :data="editForm.data"></data-form>
  </div>
</template>

<script>
import { getDeviceList, delVideo } from '@/api/app/camera/gbChannel'
import DataForm from './data-form'
import { mapGetters } from 'vuex'
export default {
  name: 'gbChannel',
  components: { DataForm },
  data() {
    return {
      queryParams: {
        size: 10, //分页数
        current: 1, //当前页
        producer: null,
        online: null,
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
      getDeviceList(this.queryParams)
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
      if (!this.permissions.camera_gbChannel_edit) return this.msgWarn('权限不足')
      this.editForm = {
        visible: true,
        data: {
          id: row.deviceId,
        },
      }
    },
    handleChannelView(row) {
      if (!this.permissions.camera_gbChannel_view) return this.msgWarn('权限不足')
      this.$router.push({
        path: '/app/camera/gbChannel/channels/index/',
        query: {
          id: row.deviceId,
        },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>