<template>
  <basic-container>
    <div class="sub-page">
      <el-form :inline="true">
        <el-form-item>
          <el-button v-if="permissions.sys_menu_add" icon="el-icon-plus" type="primary"
                     @click="addOrUpdateHandle(false)">
            添加
          </el-button>
        </el-form-item>
      </el-form>

      <el-table border v-loading="loading" :data="menuList" row-key="id"
                :tree-props="{children: 'children', hasChildren: 'hasChildrens'}">
        <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" width="180">
        </el-table-column>
        <el-table-column prop="icon" align="center" label="图标" width="100">
          <template slot-scope="scope">
            <i :class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="sort" align="center" label="排序" width="60"></el-table-column>
        <el-table-column prop="path" align="center" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="type" align="center" label="类型" width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.type === '0'">左菜单</el-tag>
            <el-tag type="success" v-if="scope.row.type === '2'">顶菜单</el-tag>
            <el-tag type="info" v-if="scope.row.type === '1'">按钮</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="keepAlive" label="缓冲" width="80">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.keepAlive === '0'">关闭</el-tag>
            <el-tag type="success" v-if="scope.row.keepAlive === '1'">开启</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column prop="keepAlive" align="center" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.visible == '1'">隐藏</el-tag>
            <el-tag type="success" v-if="scope.row.visible == '0'">显示</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permission" align="center" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="addOrUpdateHandle(false,scope.row.id)"
                       v-if="permissions.sys_menu_add">新增
            </el-button>
            <el-button size="small" type="text" @click="addOrUpdateHandle(true,scope.row.id)"
                       v-if="permissions.sys_menu_edit">修改
            </el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row)" v-if="permissions.sys_menu_del">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <table-form v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getList"></table-form>
    </div>
  </basic-container>
</template>

<script>
import { delObj, fetchMenuTree } from '@/api/admin/menu'
import TableForm from './menu-form'
import { mapGetters } from 'vuex'

export default {
  name: 'Menu',
  components: { TableForm },
  data() {
    return {
      addOrUpdateVisible: false,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    addOrUpdateHandle(isEdit, id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(isEdit, id)
      })
    },
    getList() {
      this.loading = true
      fetchMenuTree(false)
        .then((response) => {
          this.menuList = response.data.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delObj(row.id)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
    },
  },
}
</script>
