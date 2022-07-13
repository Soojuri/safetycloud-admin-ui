<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="消息标题" prop="messageName" :rules="[$formRules.checkLen()]">
          <el-input v-model.trim="queryParams.messageName" placeholder="请输入消息标题"></el-input>
        </el-form-item>
        <el-form-item label="消息类型" prop="messageType">
          <el-select v-model="queryParams.messageType" placeholder="消息类型">
            <el-option label="系统服务消息" :value="0" />
            <el-option label="账户订单消息" :value="1" />
            <el-option label="设备故障消息" :value="2" />
            <el-option label="事件预警消息" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="消息状态" prop="messageStatus">
          <el-select v-model="queryParams.messageStatus" placeholder="消息状态">
            <el-option label="正常" :value="1" />
            <el-option label="关闭" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button type="primary" @click="handleQuery">搜 索</el-button>
          <el-button @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-opera">
          <el-button type="primary" icon='el-icon-plus' @click="handleAdd">新 增</el-button>
        </div>
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="messageType" align="center" label="消息类型">
              <template slot-scope="scope">
                <span v-if="scope.row.messageType == 0">系统服务消息</span>
                <span v-if="scope.row.messageType == 1">账户订单消息</span>
                <span v-if="scope.row.messageType == 2">设备故障消息</span>
                <span v-if="scope.row.messageType == 3">事件预警消息</span>
              </template>
            </el-table-column>
            <el-table-column prop="messageName" align="center" label="消息标题" />
            <el-table-column prop="flagName" align="center" label="消息标识" />
            <el-table-column align="center" label="接收方式">
              <template slot-scope="scope">
                <span v-if="scope.row.emailEnable == 1">电子邮件</span>
                <span v-if="scope.row.smsEnable == 1">短信</span>
                <span v-if="scope.row.systemEnable == 1">站内信息</span>
              </template>
            </el-table-column>
            <el-table-column prop="userName" align="center" label="接收人" />
            <el-table-column prop="messageStatus" align="center" label="消息状态" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.messageStatus == 1" style="color: #67c23a">
                  正常
                </span>
                <span v-if="scope.row.messageStatus == 2" style="color: #909399">
                  关闭
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" width="160">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除
                </el-button>
                <el-button size="mini" type="text" @click="handleDetail(scope.row)">详情</el-button>
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
      <!-- 详情弹窗 -->
      <el-dialog :visible="diaVisible" width="500px" title="配置详情" append-to-body :close-on-click-modal='false'
                 @close="diaVisible = false">
        <el-descriptions :column="1" border size="medium" class="mt-xl">
          <el-descriptions-item label="消息类型">
            {{ arr.messageType == 0?'系统服务消息':arr.messageType == 1?'账户订单消息':arr.messageType == 2?'设备故障消息':arr.messageType == 3?'事件预警消息':'' }}
          </el-descriptions-item>
          <el-descriptions-item label="消息标题"> {{ arr.messageName }}
          </el-descriptions-item>
          <el-descriptions-item label="消息标识"> {{ arr.flagName }}
          </el-descriptions-item>
          <el-descriptions-item label="接收方式">
            {{ arr.emailEnable == 1?'电子邮件':'' }}
            {{ arr.smsEnable == 1?'短信':'' }}
            {{ arr.systemEnable == 1?'站内信息':'' }}
          </el-descriptions-item>
          <el-descriptions-item label="消息状态">
            {{ arr.messageStatus == 1?'正常':'关闭' }}
          </el-descriptions-item>
        </el-descriptions>
        <div slot='footer'>
          <el-button type="primary" @click="diaVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PopForm from './popForm.vue'
import { getConfigList, delConfig, putConfig } from '@/api/app/news/news.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        messageName: null,
        messageStatus: null,
        messageType: null,
      },
      total: 0,
      protocolTypeDict: [], //协议类型字典
      arr: [],
      tableData: [],
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
      diaVisible: false,
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getDicts('space_protocol_type').then((res) => {
      this.dict.protocolType = res.data.data
      this.getList()
    })
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      getConfigList(this.queryParams)
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
      // if (!this.permissions.notice_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleDetail(row) {
      this.diaVisible = true
      this.arr = row
    },
    handleEdit(row) {
      // if (!this.permissions.notice_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.configId
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
      this.$confirm('是否确认删除该消息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delConfig(row.configId)
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
