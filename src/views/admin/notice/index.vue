<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
        <el-form-item label="公告标题" prop="noticeTitle" :rules="[$formRules.checkLen()]">
          <el-input v-model.trim="queryParams.noticeTitle" placeholder="请输入公告标题"></el-input>
        </el-form-item>
        <el-form-item label="操作人员" prop="createBy" :rules="[$formRules.checkLen()]">
          <el-input v-model.trim="queryParams.createBy" placeholder="请输入操作人员"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="noticeType">
          <el-select v-model="queryParams.noticeType" placeholder="公告类型">
            <el-option label="通知" :value="0" />
            <el-option label="公告" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button type="primary" @click="handleQuery">搜 索</el-button>
          <el-button @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-m">
        <div class="g-opera">
          <el-button type="primary" @click="handleAdd">新 增</el-button>
        </div>
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column type="index" width="60" align="center" label="序号" />
            <el-table-column prop="noticeTitle" align="center" label="公告标题" />
            <el-table-column prop="noticeType" align="center" label="公告类型" width="80">
              <template slot-scope="scope">
                <el-tag type="success" plain v-if="scope.row.noticeType == 1">通知</el-tag>
                <el-tag type="warning" plain v-if="scope.row.noticeType == 2">公告</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" align="center" label="状态" width="80">
              <template slot-scope="scope">
                <el-tag type="primary" plain v-if="scope.row.status == 1">正常</el-tag>
                <el-tag type="info" plain v-if="scope.row.status == 0">关闭</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createBy" align="center" label="创建者" width="100" />
            <el-table-column prop="createTime" align="center" label="创建时间" width="160">
              <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" icon="el-icon-delete" type="text" @click="handleDelete(scope.row)">删除
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
    </div>
  </div>
</template>

<script>
import PopForm from '@/views/admin/notice/popForm.vue'
import { getNoticeList, delNotice, putNotice } from '@/api/admin/notice'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        noticeTitle: null,
        createBy: null,
        noticeType: null,
        status: null,
      },
      total: 0,
      protocolTypeDict: [], //协议类型字典
      tableData: [],
      dict: {},
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
    this.getDicts('space_protocol_type').then((res) => {
      this.dict.protocolType = res.data.data
      this.getList()
    })
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
    handleAdd() {
      if (!this.permissions.notice_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      if (!this.permissions.notice_edit) return this.msgWarn('权限不足')
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
      if (!this.permissions.notice_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该公告', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delNotice(row.noticeId)
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