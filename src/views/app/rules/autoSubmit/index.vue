<template>
  <div class="sub-page">
    <div class="g-card">
      <!-- <div class="rule-list">
      <div class="add" @click="handleAdd">
        新增事件自动提交规则
      </div>
      <div class="cell" v-for="item in tableData">
        <div class="tit">
          <img class="icon" :src="require('@/assets/images/rule-setting/icon-sjzdtj.png')" />
          <label>{{item.ruleName}}</label>
        </div>
        <p>{{item.remark}}</p>
        <div class="opera">
          <div class="edit" @click="handleEdit(item)"></div>
          <div class="del" @click="handleDelete(item)"></div>
          <el-switch v-model="item.status" @change="handleChangeStatus" :active-value="0" :inactive-value="1">
          </el-switch>
        </div>
      </div>
    </div> -->
      <el-form :model='queryParams' ref='queryParams' :inline='true' label-width="80px">
        <el-form-item label='规则名称' prop='ruleName'>
          <el-input size='small' v-model.trim='queryParams.ruleName' placeholder='请输入规则名称'>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择">
            <el-option label="开启" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='handleQuery'>查询</el-button>
          <el-button @click='handleClear'>清 空</el-button>
        </el-form-item>
      </el-form>
      <el-button class="mb-m" type="primary" @click="handleAdd">新 增</el-button>
      <el-button class="mb-m" @click="handleImport">批量导入</el-button>
      <el-button class="mb-m" @click="handleExport" :disabled="selectList.length==0">批量导出</el-button>
      <el-table :data="tableData" v-loading="loading" border @selection-change="handleSelect">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="ruleName" label="规则名称" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="handleChangeStatus(scope.row)" :active-value="1"
                       :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="200">
          <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" :disabled="scope.row.status" size="mini" icon="el-icon-delete"
                       @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="g-page-x mt-m">
        <pagination :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size"
                    @pagination="getList" />
      </div>
      <!-- 弹窗 -->
      <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="handleClear()">
      </pop-form>
      <excel-upload ref="excelUpload" tempName="自动提交规则导入模板.xlsx" :tempUrl="tempUrl" title="自动提交规则导入模板" :url="importUrl"
                    @refreshDataList="handleClear"></excel-upload>
    </div>
  </div>
</template>


<script>
import PopForm from './popForm.vue'
import { getAutoSubmitList, delAutoSubmit, changeStatus, exportEvent } from '@/api/app/rules/autoSubmit'
import { getManageList } from '@/api/app/algorithm/manage'
import { axiosDownload } from '@/api/manage'
import ExcelUpload from '@/components/upload/excel'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm, ExcelUpload },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        ruleName: null,
        status: null,
      },
      total: 0,
      tableData: [],
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
      selectList: [],
      tempUrl: '/admin/systemplate/getByName/自动提交规则导入模板',
      importUrl: process.env.VUE_APP_BASE_API + '/iefVasService/tvideoanalyseruleconfigautocommit/import',
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  mounted() {
    getManageList({ size: 10000, current: 1 }).then((res) => {
      this.dict.algorithmUse = res.data.data.records
    })
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getAutoSubmitList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => [(this.loading = false)])
    },

    handleAdd() {
      if (!this.permissions.rules_autoSubmit_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      if (!this.permissions.rules_autoSubmit_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.ruleId
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
      if (!this.permissions.rules_autoSubmit_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该自动提交规则', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delAutoSubmit(row.ruleId)
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
    handleDetails(row) {
      const id = row.spaceId
      this.$router.push({
        path: '/app/camera/space/info/index/',
        query: { id },
      })
    },
    handleChangeStatus(row) {
      if (!this.permissions.rules_autoSubmit_start) return this.msgWarn('权限不足')
      this.loading = true
      const ruleId = row.ruleId
      const status = row.status
      changeStatus({ ruleId, status })
        .then((res) => {
          this.loading = false
          if (res.data.data) {
            this.msgSuccess(`${status == 1 ? '启用成功' : '停用成功'}`)
            this.getList()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSelect(row) {
      this.selectList = row
    },
    handleImport() {
      if (!this.permissions.rules_autoSubmit_Pin) return this.msgWarn('权限不足')
      this.$refs.excelUpload.show()
    },
    handleExport() {
      if (!this.permissions.rules_autoSubmit_Pout) return this.msgWarn('权限不足')
      const ids = this.selectList.map((item) => item.ruleId)
      exportEvent({ ids: ids.join() }).then((res) => {
        axiosDownload(res)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
$vw: 100vw/1920;
.chartKJSXTLXXXZB,
.chartZNSBQK,
.chartGSDZYSL {
  height: 260 * $vw;
}
div[class*='chart'] {
  margin: 12 * $vw;
}
div[class*='chart']:empty {
  background: #eee;
}
.sub-page {
  min-height: 100%;
  display: flex;
  font-size: 16 * $vw;
  flex-direction: column;
  align-items: stretch;
  background-color: white;
  margin: 0 12 * $vw;
  width: auto;
}
.rule-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6px;
  margin-top: 12px;
  .cell {
    box-sizing: border-box;
    width: calc(25% - 12px);
    margin: 6px;
    border: solid 1px #e8ecee;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s;
    &:hover {
      cursor: pointer;
      transform: translateY(-3px);
      box-shadow: 0 0 15px rgba($color: #000000, $alpha: 0.1);
    }
  }
  .add {
    padding: 12px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: calc(25% - 12px);
    margin: 6px;
    border: dashed 1px #e8ecee;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s;
    min-height: 180px;
    &:hover {
      cursor: pointer;
      transform: translateY(-3px);
      box-shadow: 0 0 15px rgba($color: #000000, $alpha: 0.1);
    }
    &::before {
      content: '\E916';
      font-family: c-icon-font, sans-serif;
      margin-right: 12px;
    }
  }
  .tit {
    padding: 12px 16px;
    display: flex;
    font-size: 18px;
    border-bottom: solid 1px #e8ecee;
    align-items: center;
    .icon {
      flex-shrink: 0;
      margin-right: 16px;
      width: 50px;
      height: 50px;
    }
    label {
      color: #333;
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
      margin-right: 10px;
    }
    span {
      font-size: 16px;
      color: #999999;
    }
  }
  p {
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    margin: 12px 12px;
    color: #888;
    font-size: 14px;
    height: 38px;
  }
  .opera {
    position: relative;
    border-top: solid 1px #e8ecee;
    display: flex;
    justify-content: space-around;
    background: #f5f9ff;
    align-items: center;
    & > div {
      position: relative;
      flex: 1;
      text-align: center;
    }
    & > div::after {
      width: 1px;
      top: 50%;
      content: '';
      position: absolute;
      right: 0;
      background: #e8ecee;
      height: 18px;
      margin-top: -9px;
    }
    & > div:last-child:after {
      display: none;
    }
    .el-switch {
      justify-content: center;
    }
    .del {
      cursor: pointer;
      padding: 12px;
      color: #8b8c8f;
      font-size: 22px;
      &::before {
        content: '\e93e';
        font-family: c-icon-font, sans-serif;
        margin-right: 4px;
        vertical-align: -2px;
      }
    }
    .edit {
      cursor: pointer;
      padding: 12px;
      color: #8b8c8f;
      font-size: 22px;
      &::before {
        content: '\e919';
        font-family: c-icon-font, sans-serif;
        margin-right: 4px;
        vertical-align: -2px;
      }
    }
    .link {
      cursor: pointer;
      padding: 12px;
      color: $--color-primary;
      &:after {
        content: '\e932';
        font-family: c-icon-font, sans-serif;
        font-size: 14px;
        margin-left: 4px;
        vertical-align: -2px;
      }
    }
  }
}
</style>

