<!-- 边缘节点  -->
<template>
  <div class="sub-page">
    <!-- <div class="row">
      <div class="col left">
        <div class="tit">边缘节点数据概况</div>
        <div class="row-sub">
          <div class="chartBYJDZS">

          </div>
          <div class="chartBYJDYXL">

          </div>
        </div>
        <dl>
          <dd>边缘节点总数<b>112239</b></dd>
          <dd>边缘节点运行率<b>87%</b></dd>
        </dl>
      </div>
      <div class="col right">
        <div class="tit">各边缘节点资源剩余占比</div>
        <div class="row-sub">
          <div class="chartCPU">

          </div>
          <div class="chartGPU">

          </div>
          <div class="chartRAM">

          </div>
        </div>
      </div>
    </div> -->
    <div class="g-card mt-m">
      <el-form ref="queryParams" :model="queryParams" inline label-width="100px">
        <!-- <el-form-item label='边缘节点ID' prop='id'>
          <el-input size='small' v-model='queryParams.id' placeholder='请输入边缘节点ID'></el-input>
        </el-form-item> -->
        <el-form-item label='节点名称' prop='name'>
          <el-input size='small' v-model='queryParams.name' placeholder='请输入节点名称'></el-input>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <!-- <div class="g-opera">
          <el-button type="primary" @click="handleAdd">新 增</el-button>
        </div> -->
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <!-- <el-table-column prop="id" label="节点ID" /> -->
            <el-table-column prop="name" label="节点名称" />
            <el-table-column prop="device_num" label="设备数量" />
            <el-table-column prop="state" label="状态" :formatter="formatState" />
            <el-table-column prop="updated_at" label="更新时间">
              <template slot-scope="scope">{{parseTime(new Date(scope.row.updated_at))}}</template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间">
              <template slot-scope="scope">{{parseTime(new Date(scope.row.created_at))}}</template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <!-- <el-button type="text" :disabled="scope.row.state !== 'STOPPED'" @click="handleEnable(scope.row)">启用
                </el-button>
                <el-button type="text" :disabled="scope.row.state !== 'RUNNING' " @click="handleDisable(scope.row)">停用
                </el-button>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button> -->
                <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
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
      <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="handleClear()">
      </pop-form>
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import { mapGetters } from 'vuex'
import { getNodeList, operateNode, delNode } from '@/api/app/edge/node'
export default {
  components: {
    PopForm,
  },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        name: null,
      },
      total: 0,
      tableData: [],
      formOptions: {
        visible: false,
        data: {},
      },
      dict: {},
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  mounted() {
    this.getDicts('edge_node_state').then((res) => {
      this.dict.state = res.data.data
    })
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getNodeList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.nodes
          this.total = res.data.data.count
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAdd() {
      if (!this.permissions.edge_node_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      this.formOptions.data.id = row.spaceId
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
    handleClear() {
      this.resetForm('queryParams')
      this.getList()
    },
    handleDelete(row) {
      if (!this.permissions.edge_node_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该边缘节点', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delNode(row.id)
        })
        .then((res) => {
          if (res.data.data) {
            that.handleCurrentPageCalculateByDelete()
            that.msgSuccess('删除成功')
            that.handleClear()
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
    handleEnable(row) {
      if (!this.permissions.edge_node_start) return this.msgWarn('权限不足')
      operateNode({ id: row.id, action: 'start' }).then((res) => {
        if (res.data.code == 0) {
          this.msgSuccess('启用成功')
        }
      })
    },
    handleDisable(row) {
      if (!this.permissions.edge_node_stop) return this.msgWarn('权限不足')
      operateNode({ id: row.id, action: 'stop' }).then((res) => {
        if (res.data.code == 0) {
          this.msgSuccess('停用成功')
        }
      })
    },
    formatState(row) {
      return this.selectDictLabel(this.dict.state, row.state)
    },
    handleDetail(row) {
      if (!this.permissions.edge_node_view) return this.msgWarn('权限不足')
      const id = row.id
      this.$router.push({
        path: '/app/edge/node/info/index/',
        query: { id },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
@import '@/styles/variables.scss';
$vw: 100vw/1920;
div[class*='chart'] {
  margin-top: 12px;
  height: 226px;
}
div[class*='chart']:empty {
  background: #eee;
}
.row-sub {
  display: flex;
  div[class*='chart'] {
    flex: 1;
    flex-shrink: 0;
  }
  .chartBYJDZS,
  .chartBYJDYXL {
    height: 200px;
  }
}
.row {
  display: flex;
  dl,
  dd,
  dt {
    margin: 0;
  }
  .col {
    padding: 16px;
    background: white;
    border-radius: 3px;
    &.left {
      flex: 2;
    }
    &.right {
      flex: 3;
      margin-left: 12px;
    }
  }
  dl {
    display: flex;
    text-align: center;
    font-size: 16px;
    dd {
      flex: 1;
      flex-shrink: 0;
    }
    b {
      font-size: 24px;
      margin-left: 4px;
    }
  }
  .tit {
    font-size: 18px;
    display: flex;
    align-items: flex-start;
    &::before {
      content: '';
      height: 20px;
      width: 4px;
      border-radius: 2px;
      background: $--color-primary;
      display: inline-block;
      margin-right: 8px;
      vertical-align: top;
      margin-top: 3px;
    }
  }
}
</style>