<!-- 设备管理 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <el-form :inline="true" ref="form" :model="queryParams">
        <el-form-item label='设备名称' prop='deviceName'>
          <el-input size='small' v-model='queryParams.deviceName' placeholder='请输入设备名称'></el-input>
        </el-form-item>
        <el-form-item label='设备编号' prop='deviceNo'>
          <el-input size='small' v-model='queryParams.deviceNo' placeholder='请输入设备编号'></el-input>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" @click="getList">查 询</el-button>
          <el-button @click="handleClear">重 置</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格数据 -->
      <el-table v-if="selectType != 'multiple'" class="mt-xl" border v-loading='loading' :data='tableData'
                highlight-current-row @current-change="handleSelect">
        <el-table-column align='center' prop='deviceNo' label='设备编号' />
        <el-table-column align='center' prop='deviceName' label='设备名称' />
        <el-table-column align='center' prop='productName' label='产品名称' />
        <el-table-column align='center' prop='registryTime' label='注册时间'>
          <template slot-scope="scope">{{parseTime(scope.row.registryTime)}}</template>
        </el-table-column>
        <el-table-column align='center' prop='status' label='状态' :formatter="formatStatus" />
      </el-table>
      <el-table v-if="selectType == 'multiple'" class="mt-xl" border v-loading='loading' :data='tableData'
                highlight-current-row @selection-change="handleSelect">
        <el-table-column type="selection"></el-table-column>
        <el-table-column align='center' prop='deviceNo' label='设备编号' />
        <el-table-column align='center' prop='deviceName' label='设备名称' />
        <el-table-column align='center' prop='productName' label='产品名称' />
        <el-table-column align='center' prop='registryTime' label='注册时间'>
          <template slot-scope="scope">{{parseTime(scope.row.registryTime)}}</template>
        </el-table-column>
        <el-table-column align='center' prop='status' label='状态' :formatter="formatStatus" />
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
//import {} from '@/api/badge/';
import { getBindDeviceList } from '@/api/device/instance'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'deviceBind',
  components: {},
  data() {
    return {
      queryParams: {
        size: 10, //分页数
        current: 1, //当前页
        deviceName: null,
        deviceNo: null,
        productId: null,
      },
      selectSampleData: '',
      selection: null,
      queryOptions: [
        {
          label: '设备编号',
          value: 'deviceNo',
        },
        {
          label: '设备名称',
          value: 'deviceName',
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
      stastics: {},
      statusOptions: [],
    }
  },
  computed: {
    ...mapGetters(['productAllList']),
  },
  props: {
    selectType: {
      type: String,
      default: 'single',
    },
    groupId: '',
  },
  watch: {},
  mounted() {
    this.queryParams.productId = this.$route.query.productId
    this.queryParams.groupId = this.groupId
    this.getList()
    this.getDicts('device_status').then((res) => {
      this.statusOptions = res.data.data
    })
  },
  methods: {
    //获取页面列表数据
    getList() {
      this.loading = true
      getBindDeviceList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch((err) => {
          this.loading = false
        })
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
    formatStatus(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    handleSelect(selection) {
      this.selection = selection
    },
    //提交设备选择
    handleSubmit() {
      if (this.selection) {
        this.$emit('handleSubmit', this.selection)
      } else {
        this.msgWarn('请选择一条设备信息')
      }
    },
  },
}
</script>
<style lang='scss' scoped>
@import '@/styles/variables.scss';
.statistic-cols {
  $tmp-gap: 8px;
  margin-top: 16px;
  ul {
    display: flex;
    align-items: stretch;
  }
  li {
    box-sizing: border-box;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    height: 100px;
    flex: 1 1 0;
    white-space: nowrap;
    padding: 16px 20px;
    margin-left: $tmp-gap;
    background: #f6f7f8;
    border-radius: 10px;
    &:first-child {
      margin-left: 0;
    }
  }
  span {
    display: block;
    font-size: 16px;
  }
  b {
    display: block;
    font-size: 36px;
  }
}
/deep/ .input-with-select .el-select .el-input {
  width: 120px;
}
/deep/ .input-with-select .el-input-group__prepend {
  background-color: #fff;
  color: #555;
}
.el-form {
  height: 36px;
  line-height: 36px;
}
</style>