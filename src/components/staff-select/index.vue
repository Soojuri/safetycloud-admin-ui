<template>
  <div class="mod-config">
    <div class="avue-crud">
      <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="name" header-align="center" align="center" label="接收人姓名">
        </el-table-column>
        <el-table-column prop="phone" header-align="center" align="center" label="电话号码">
        </el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" label="创建时间">
          <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column prop="status" header-align="center" align="center" label="接收状态">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? '接收' : '不接收' }}
          </template>
        </el-table-column>
        <el-table-column prop="notifyType" header-align="center" align="center" label="通知类型">
          <template slot-scope="scope">
            {{selectDictLabel(notifyTypeOptions, scope.row.notifyType)}}
          </template>
        </el-table-column>
        <el-table-column prop="email" header-align="center" align="center" label="电子邮件地址">
        </el-table-column>
      </el-table>
    </div>

    <div class="avue-crud__pagination">
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]"
                     :page-size="pageSize" :total="totalPage" background layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchList, delObj } from '@/api/notify/people'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      dataForm: {
        key: ''
      },
      selected: [],
      notifyTypeOptions: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  created () {
    this.getDicts('notify_type').then(res => {
      this.notifyTypeOptions = res.data.data
    })
    this.getDataList()
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      fetchList(Object.assign({
        current: this.pageIndex,
        size: this.pageSize
      })).then(response => {
        this.dataList = response.data.data.records
        this.totalPage = response.data.data.total
      })
      this.dataListLoading = false
    },
    //确认选择
    handleSubmit () {
      if (this.selected != null && this.selected.length == 1) {
        this.$emit('handleSubmit', this.selected[0])
      } else {
        this.msgWarn("请选择一条用户数据!")
      }
    },
    //选择用户
    handleSelectionChange (row) {
      this.selected = row
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
  }
}
</script>
