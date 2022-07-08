<!-- 区域管理 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <el-button type="primary" class="mb-m" @click="handleAdd">新增</el-button>
      <!-- 表格数据 -->
      <el-table :data="tableData" border row-key="id" v-loading="loading"
                :tree-props="{children: 'children', hasChildren: 'hasChildrens'}">
        <el-table-column align='center' prop='areaMark' label='区域标识' />
        <el-table-column align='center' prop='name' label='区域名称' />
        <el-table-column align='center' label='操作'>
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <data-form v-if="dataForm.visible" :visible.sync="dataForm.visible" :data="dataForm.data" :type="dataForm.type"
               @ok="getList"></data-form>
  </div>
</template>

<script>
import { getAreaTree, delArea } from '@/api/device/area'
import DataForm from './data-form.vue'
import { mapGetters } from 'vuex'
export default {
  name: '',
  components: { DataForm },
  data() {
    return {
      queryParams: {
        size: 10, //分页数
        current: 1, //当前页
      },
      tableData: [], //表格数据
      total: 0, //总条数
      loading: false,
      dataForm: {
        visible: false,
        type: '',
        data: {},
      },
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  mounted() {
    this.getList()
  },
  methods: {
    //获取页面列表数据
    getList() {
      this.loading = true
      getAreaTree({ lazy: false })
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data
        })
        .catch((err) => {
          this.loading = false
        })
    },
    //搜索
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    //初始化查询列表
    handleClear() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    //新增
    handleAdd() {
      if (!this.permissions.device_location_area_add) return this.msgWarn('权限不足')
      this.dataForm = {
        visible: true,
        type: 'add',
        data: {},
      }
    },
    handleEdit(row) {
      if (!this.permissions.device_location_area_edit) return this.msgWarn('权限不足')
      this.dataForm = {
        visible: true,
        type: 'edit',
        data: {
          id: row.id,
        },
      }
    },
    handleDel(row) {
      if (!this.permissions.device_location_area_del) return this.msgWarn('权限不足')
      let name = row.name
      let id = row.id
      this.$confirm(`是否删除“${name}”区域?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        delArea(id).then((res) => {
          if (res.data.data) {
            this.msgSuccess('删除成功')
            this.getList()
          }
        })
      })
    },
  },
}
</script>
<style lang='scss' scoped>
</style>