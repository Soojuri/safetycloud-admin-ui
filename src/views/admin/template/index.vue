<template>
  <div class="mod-config">
    <basic-container>
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="模板名称" prop="templateName" :rules="[$formRules.checkLen()]">
          <el-input v-model.trim="queryParams.templateName" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <el-form-item label="模板类型" prop="type" :rules="[$formRules.checkLen()]">
          <el-input v-model.trim="queryParams.type" placeholder="请输入模板类型"></el-input>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button type="primary" @click="handleQuery">搜 索</el-button>
          <el-button @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-button icon="el-icon-plus" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </el-form-item>
      </el-form>

      <div class="avue-crud">
        <el-table :data="dataList" border v-loading="dataListLoading">
          <el-table-column prop="id" align="center" header- label="编号">
          </el-table-column>
          <el-table-column prop="templateName" align="center" header- label="模板名称">
          </el-table-column>
          <el-table-column prop="type" align="center" header- label="模板类型">
          </el-table-column>
          <el-table-column prop="fileSize" align="center" header- label="文件大小">
          </el-table-column>
          <el-table-column prop="createUser" align="center" header- label="创建用户">
          </el-table-column>
          <el-table-column prop="createTime" align="center" header- label="上传时间">
          </el-table-column>
          <el-table-column header- label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除
              </el-button>
              <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="avue-crud__pagination">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                       :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <table-form v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></table-form>
      <!-- 编辑弹窗 -->
      <el-dialog :visible="diaVisible" width="500px" title="编辑" append-to-body :close-on-click-modal='false'
                 @close="diaVisible = false">
        <el-form :model="form" :rules="dataRule" ref="form" @keyup.enter.native="dataFormSubmit()" label-width="80px">
          <el-form-item label="模板名称" prop="templateName">
            <el-input v-model="form.templateName" placeholder="模板名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot='footer'>
          <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { getTemplateList, delTemplate, putTemplate } from '@/api/admin/template'
import TableForm from './dataForm'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dataForm: {
        key: '',
      },
      form: {
        templateName: '',
        id: null,
      },
      dataRule: {
        templateName: [{ required: true, message: '模板名称不能为空', trigger: 'blur' },this.$formRules.checkLen(32)],
      },
      queryParams: {
        size: 10,
        current: 1,
        templateName: null,
        type: null,
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      diaVisible: false,
    }
  },
  components: {
    TableForm,
  },
  created() {
    this.getDataList()
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      getTemplateList(
        Object.assign({
          current: this.pageIndex,
          size: this.pageSize,
          templateName: this.queryParams.templateName,
          type: this.queryParams.type,
        })
      ).then((response) => {
        this.dataList = response.data.data.records
        this.totalPage = response.data.data.total
        this.dataListLoading = false
      }).catch((error)=>{
        this.dataListLoading = false
      })
    },
    handleQuery() {
      const that = this
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          that.getDataList()
        }
      })
    },
    handleClear() {
      this.resetForm('queryParams')
      this.getDataList()
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      // if (!this.permissions.template_add) return this.msgWarn('权限不足')
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    handleEdit(row) {
      this.diaVisible = true
      this.form.templateName = row.templateName
      this.form.id = row.id
    },
    dataFormSubmit() {
      this.$refs.form.validate((valid)=>{
        if(valid){
          putTemplate(this.form).then((res) => {
            if (res.data) {
              this.msgSuccess('修改成功')
              this.getDataList()
              this.diaVisible = false
            } else {
              this.msgError(res.data.data.msg)
            }
          })
        }
      })
    },
    // 删除
    deleteHandle(row) {
      // if (!this.permissions.template_delete) return this.msgWarn('权限不足')
      this.$confirm(`是否确认删除:${row.templateName}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delTemplate(row.id)
        })
        .then((data) => {
          this.$message.success('删除成功')
          this.currentChangeHandle(1)
        })
    },
  },
}
</script>
