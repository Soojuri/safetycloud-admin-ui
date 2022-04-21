<template>
  <div class="sub-page">
    <div class="g-card">
      <div class="mt-m">
        <div class="g-opera">
          <el-button type="primary" @click="handleAdd">添加模板</el-button>
        </div>
        <div class="g-table">
          <el-table v-loading="loading" border :data="tableData">
            <el-table-column prop="templateId" align="center" label="截图录制ID" />
            <el-table-column prop="templateName" align="center" label="截图模板名称" />
            <el-table-column align="center" label="截图类型">
              <template slot-scope="scope">
                <span v-if="scope.row.enableOndemandCapture == 1">&nbsp;按需截图&nbsp;</span>
                <span v-if="scope.row.enableOverlapCapture == 1">&nbsp;覆盖式截图&nbsp;</span>
                <span v-if="scope.row.enableRealtimeCapture == 1">&nbsp;实时截图&nbsp;</span>
              </template>
            </el-table-column>
            <el-table-column prop="captureFrequency" align="center" label="截图频率" />
            <el-table-column prop="saveDirectory" align="center" label="存储位置" width="100" />
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
      <pop-form v-if="formOptions.visible" :visible.sync="formOptions.visible" :data="formOptions.data" @ok="getList()">
      </pop-form>
    </div>
  </div>
</template>

<script>
import PopForm from '@/views/app/template/screenshot/popForm.vue'
import { getTemplateList, delTemplate } from '@/api/app/template/template.js'
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
      getTemplateList(this.queryParams)
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
      if (!this.permissions.template_screenshot_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      if (!this.permissions.template_screenshot_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.templateId
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
      this.queryParams.current = 1
      this.queryParams.size = 10
      this.resetForm('queryParams')
      this.getList()
    },
    handleDelete(row) {
      if (!this.permissions.template_screenshot_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delTemplate(row.templateId)
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