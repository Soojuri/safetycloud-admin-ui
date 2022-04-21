<template>
  <div class="sub-page">
    <div class="g-card">
      <div class="mt-m">
        <div class="g-opera">
          <el-button type="primary" @click="handleAdd">新 建</el-button>
        </div>
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="ossType" align="center" label="配置类型">
              <template slot-scope="scope">
                <span v-if="scope.row.ossType == 0">系统MINIO文件存储</span>
                <span v-if="scope.row.ossType == 1">华为OBS文件存储</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="状态" width="80">
              <template slot-scope="scope">
                <template v-if="scope.row.status == 0">
                  <span class="yellow_status"></span>
                  <span class="status_text">禁用</span>
                </template>
                <template v-if="scope.row.status == 1 ">
                  <span class="green_status"></span>
                  <span class="status_text">启用</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="备注" />
            <el-table-column prop="createTime" align="center" label="创建时间" width="160">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column prop="updateTime" align="center" label="更新时间" width="160">
              <template slot-scope="scope">{{parseTime(scope.row.updateTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" v-if="scope.row.status == 0" type="text" @click="handleStart(scope.row)">启用
                </el-button>
                <el-button size="mini" v-if="scope.row.status == 1" type="text" @click="handleStop(scope.row)">禁用
                </el-button>
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除
                </el-button>
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
      <pop-form v-if="formOptions.visible" :visible.sync="formOptions.visible" :data="formOptions.data" @ok="getList()">
      </pop-form>
    </div>
  </div>

  </div>
</template>

<script>
import PopForm from '@/views/admin/storage/popFrom.vue'
import { getStorageList, delStorage, putStorage } from '@/api/admin/storage.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
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
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getList()
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      getStorageList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAdd() {
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      this.formOptions.data.id = row.configId
      this.formOptions.visible = true
    },
    handleStart(row) {
      putStorage({ configId: row.configId, status: 1 }).then((res) => {
        if (res.data.data) {
          this.msgSuccess('启用成功')
          this.getList()
        }
      })
    },
    handleStop(row) {
      putStorage({ configId: row.configId, status: 0 }).then((res) => {
        if (res.data.data) {
          this.msgSuccess('禁用成功')
          this.getList()
        }
      })
    },
    // handleQuery() {
    //   const that = this
    //   this.$refs.queryParams.validate((valid) => {
    //     if (valid) {
    //       that.getList()
    //     }
    //   })
    // },
    handleClear() {
      this.resetForm('queryParams')
      this.getList()
    },
    handleDelete(row) {
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delStorage(row.configId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
  },
}
</script>

<style lang='scss' scoped>
</style>