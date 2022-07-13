<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
        <el-form-item label="消息标题" prop="messageTitle" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.messageTitle" placeholder="请输入消息标题" @keyup.native="trimInput"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="readStatus">
          <el-select v-model="queryParams.readStatus" placeholder="状态">
            <el-option label="未读" :value="0" />
            <el-option label="已读" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button type="primary" @click="handleQuery">搜 索</el-button>
          <el-button @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-opera">
          <el-button @click="handleEvent()">批量已读</el-button>
        </div>
        <div class="g-table">
          <el-table v-loading="loading" border ref="table" :data="tableData" @select="handleSelect"
                    @selection-change="handleSelectRow">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="messageType" align="center" label="消息类型" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.messageType == 0">其他消息</span>
                <span v-if="scope.row.messageType == 1">账号消息</span>
                <span v-if="scope.row.messageType == 2">订单消息</span>
              </template>
            </el-table-column>
            <el-table-column prop="messageTitle" align="center" label="消息标题" />
            <el-table-column prop="messageContent" align="center" label="消息内容" />
            <el-table-column prop="readStatus" align="center" label="状态" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.readStatus == 1" style="color: #909399">
                  已读
                </span>
                <span v-if="scope.row.readStatus == 0" style="color: #f56c6c">
                  未读
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" width="160">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleDetails(scope.row)">查看
                </el-button>
                <!-- <el-button size="mini"  type="text" @click="handleEdit(scope.row)">编辑</el-button> -->
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
      <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="getList()">
      </pop-form>
      <el-dialog title="详情" :visible.sync="dialogVisible" width="width">
        <el-descriptions>
          <el-descriptions-item label="消息标题"> {{ arr.messageTitle }}
          </el-descriptions-item>
          <el-descriptions-item label="消息内容"> {{ arr.messageContent }}
          </el-descriptions-item>
        </el-descriptions>

      </el-dialog>
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import { getNoticeList, delNotice, putNotice, setReadStatus, getNoticeInfo } from '@/api/app/news/news.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        messageTitle: null,
        readStatus: null,
      },
      total: 0,
      tableData: [],
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
      dialogVisible: false,
      arr: [],
      selection: [],
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
      getNoticeList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDetails(row) {
      this.dialogVisible = true
      getNoticeInfo(row.messageId).then((res) => {
        // console.log(res.data.data)
        this.arr = res.data.data.data
        this.getList()
      })
    },
    handleSelectRow(list) {
      this.selection = list
    },
    handleSelect(selection, row) {
      if (row.readStatus === 1) {
        this.$refs.table.toggleRowSelection(row, false)
        return this.msgWarn('已读消息无法批量处理')
      }
    },
    handleEvent() {
      if (this.selection.length === 0) return this.msgWarn('请至少选择一条消息')
      const ids = this.selection.map((item) => {
        return item.messageId
      })
      setReadStatus({ ids }).then((res) => {
        if (res.data.data) {
          this.msgSuccess('批量操作成功')
          this.getList()
        }
      })
    },
    handleAdd() {
      // if (!this.permissions.notice_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      // if (!this.permissions.notice_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.messageId
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
      // if (!this.permissions.notice_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delNotice(row.messageId)
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
  },
}
</script>

<style lang='scss' scoped>
.status-info {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #909399;
  border-radius: 50%;
}

.status-primary {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #409eff;
  border-radius: 50%;
  // border: 1px solid #409eff;
}

.status-success {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #67c23a;
  border-radius: 50%;
}

.status-waring {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #e6a23c;
  border-radius: 50%;
  // border: 1px solid #e6a23c;
}

.status-danger {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #f56c6c;
  border-radius: 50%;
  // border: 1px solid #f56c6c;
}
</style>
