<!-- 终端设备选择 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <el-form :inline="true" ref="form" :model="queryParams">
        <el-form-item label='终端设备名称' prop='deviceName'>
          <el-input v-model='queryParams.edgeDeviceName' placeholder='请输入设备名称'></el-input>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" @click="getList">查 询</el-button>
          <el-button @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <el-table v-if="selectType != 'multiple'" class="mt-xl" border v-loading='loading' :data='tableData'
                highlight-current-row @current-change="handleSelect">
        <el-table-column prop='edgeDeviceId' label='终端设备ID' />
        <el-table-column prop='edgeDeviceName' label='终端设备名称' />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
        </el-table-column>
      </el-table>
      <el-table v-if="selectType == 'multiple'" class="mt-xl" border v-loading='loading' :data='tableData'
                highlight-current-row @selection-change="handleSelect">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop='edgeDeviceId' label='终端设备ID' />
        <el-table-column prop='edgeDeviceName' label='终端设备名称' />
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="g-page-x mt-m">
        <pagination v-show='total>0' :total='total' :page.sync='queryParams.current' :limit.sync='queryParams.size'
                    @pagination='getList' />
      </div>
    </div>
  </div>
</template>

<script>
import { getEdgeDeviceList, getEdgeUnbindDeviceList } from '@/api/app/edge/device'
export default {
  name: 'deviceBind',
  components: {},
  data() {
    return {
      queryParams: {
        size: 10, //分页数
        current: 1, //当前页
        edgeDeviceName: null,
      },
      selectSampleData: '',
      selection: null,
      queryOptions: [
        {
          label: '设备编号',
          value: 'edgeDeviceId',
        },
        {
          label: '设备名称',
          value: 'edgeDeviceName',
        },
      ],
      tableData: [], //表格数据
      total: 0, //总条数
      loading: false,
      form: {
        visible: false,
        title: '',
        data: {},
        type: '',
      },
    }
  },
  computed: {},
  props: {
    selectType: {
      type: String,
      default: 'single',
    },
    nodeId: {
      type: String,
      default: null,
    },
  },
  watch: {},
  mounted() {
    this.getList()
  },
  methods: {
    //获取页面列表数据
    getList() {
      this.loading = true
      if (this.nodeId) {
        getEdgeUnbindDeviceList({ ...this.queryParams })
          .then((res) => {
            this.loading = false
            this.tableData = res.data.data.records
            this.total = res.data.data.total
          })
          .catch((err) => {
            this.loading = false
          })
      } else {
        getEdgeDeviceList(this.queryParams)
          .then((res) => {
            this.loading = false
            this.tableData = res.data.data.records
            this.total = res.data.data.total
          })
          .catch((err) => {
            this.loading = false
          })
      }
    },
    //搜索
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    //初始化查询列表
    handleClear() {
      this.resetForm('form')
      this.handleQuery()
    },
    handleSelect(selection) {
      this.selection = selection
    },
    //提交设备选择
    handleSubmit() {
      if (this.selection) {
        if (this.selection.length > 50) {
          this.msgWarn('最多只能添加50条数据源')
        }
        this.$emit('handleSubmit', this.selection)
      } else {
        this.msgWarn('请选择一条设备信息')
      }
    },
  },
}
</script>
<style lang='scss' scoped>
</style>