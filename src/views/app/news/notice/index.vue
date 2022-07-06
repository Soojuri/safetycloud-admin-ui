<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="公告标题" prop="noticeTitle" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.noticeTitle" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="状态">
            <el-option label="已发布" :value="1" />
            <el-option label="未发布" :value="0" />
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
            <el-table-column prop="noticeType" align="center" label="公告类型">
              <template slot-scope="scope">
                <span v-if="scope.row.noticeType == 1">通知</span>
                <span v-if="scope.row.noticeType == 2">公告</span>
              </template>
            </el-table-column>
            <el-table-column prop="noticeTitle" align="center" label="公告标题" />
            <el-table-column prop="noticeContent" show-overflow-tooltip align="center" label="公告内容">
              <template slot-scope="scope">
                <div v-html="scope.row.noticeContent"></div>
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 1" style="color: #909399">
                  已发布
                </span>
                <span v-if="scope.row.status == 0" style="color: #f56c6c">
                  未发布
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="releaseTime" align="center" label="发布时间">
              <template slot-scope="scope">{{parseTime(scope.row.releaseTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除
                </el-button>
                <el-button size="mini" type="text" v-if="scope.row.status == 0" @click="handleStatus(scope.row, 1)">发布
                </el-button>
                <el-button size="mini" type="text" v-if="scope.row.status == 1" @click="handleStatus(scope.row, 0)">撤回
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
      <el-dialog :visible="diaVisible" width="500px" title="通知详情" append-to-body :close-on-click-modal='false'
                 @close="diaVisible = false">
        <el-descriptions :column="1" border size="medium" class="mt-xl">
          <el-descriptions-item label="公告标题"> {{ arr.noticeTitle }}
          </el-descriptions-item>
          <el-descriptions-item label="公告内容">
            <div v-html="arr.noticeContent"></div>
          </el-descriptions-item>
          <el-descriptions-item label="发布时间"> {{ parseTime(arr.releaseTime) }}
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
import { getAnnouncementList, delAnnouncement, putAnnouncement } from '@/api/app/news/news.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        noticeTitle: null,
        status: null,
      },
      total: 0,
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
      getAnnouncementList(this.queryParams)
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
    handleStatus(row, status) {
      putAnnouncement({ noticeId: row.noticeId, status: status }).then((res) => {
        if (res.data) {
          if (status == 1) {
            this.msgSuccess('发布成功')
          }
          if (status == 0) {
            this.msgSuccess('撤回成功')
          }
          this.getList()
        } else {
          this.msgError(res.data.data.msg)
        }
      })
    },
    handleDetail(row) {
      this.diaVisible = true
      this.arr = row
    },
    handleEdit(row) {
      // if (!this.permissions.notice_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.noticeId
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
      this.$confirm('是否确认删除该公告', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delAnnouncement(row.noticeId)
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