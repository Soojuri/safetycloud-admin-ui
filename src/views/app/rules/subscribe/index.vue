<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form class="flex-nowrap" :model='queryParams' ref='queryForm' :inline='true'>
        <el-form-item label='配置名称' prop='subscriptionName'>
          <el-input size='small' v-model='queryParams.subscriptionName' placeholder='请输入'>
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择">
            <el-option label="订阅中" :value="1"></el-option>
            <el-option label="关闭中" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订阅类型" prop="subscribeType">
          <el-select v-model="queryParams.subscribeType" placeholder="请选择">
            <el-option label="URL接口推送" :value="1"></el-option>
            <el-option label="消息服务订阅" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='handleQuery'>查询</el-button>
          <el-button @click='handleClear'>清 空</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="mb-m" size="small" @click="handleAdd">新 增</el-button>
      <el-button type="warning" class="mb-m" size="small" @click="handleLook">
        查看订阅记录
      </el-button>
      <!-- <div class="rule-list">
        <div class="add" @click="handleAdd">
          新增事件订阅配置
        </div>
        <div class="cell" v-for="item in tableData">
          <div class="tit">
            <img class="icon" :src="require('@/assets/images/rule-setting/icon-sjgz.png')" />
            <label class="col">
              <span>{{item.subscriptionName}}</span>
              <el-tag class="mt-s" size="mini" v-if="item.subscribeType == 1">URL接口推送</el-tag>
              <el-tag class="mt-s" size="mini" v-if="item.subscribeType == 2" type="success">消息服务订阅</el-tag>
            </label>

          </div>
          <p>{{item.remark}}</p>
          <div class="opera">
            <div class="edit" @click="handleEdit(item)"></div>
            <div class="del" @click="handleDelete(item)"></div>
            <el-switch v-model="item.status" @change="handleChangeStatus" :active-value="1" :inactive-value="0">
            </el-switch>
          </div>
        </div>
      </div> -->
      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column prop="subscriptionName" label="配置名称" width="200"></el-table-column>
        <el-table-column prop="subscribeType" label="订阅类型" width="200">
          <template slot-scope="scope">{{scope.row.subscribeType == 1 ?'URL接口推送' : '消息服务订阅'}}</template>
        </el-table-column>
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
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" :disabled="scope.row.status" size="mini" icon="el-icon-delete"
                       @click="handleDelete(scope.row)">
              删除
            </el-button>
            <el-button type="text" size="mini" icon="el-icon-info" @click="handleRecord(scope.row)">订阅记录</el-button>

          </template>
        </el-table-column>
      </el-table>
      <div class="g-page-x mt-m">
        <pagination :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size"
                    @pagination="getList" />
      </div>
    </div>
    <!-- 弹窗 -->
    <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
              @ok="getList()">
    </pop-form>
  </div>
</template>


<script>
import PopForm from './popForm.vue'
import { getSubscribeList, delSubscribe, putSubscribe } from '@/api/app/rules/subscribe.js'
import { getManageList } from '@/api/app/algorithm/manage'
import { getAlgorithmList } from '@/api/app/algorithm/bag.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 10,
        current: 1,
        subscriptionName: null,
        status: null,
        subscribeType: null,
      },
      total: 0,
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
  mounted() {
    this.getDicts('repeat_rule').then((res) => {
      this.dict.repeatRule = res.data.data
    })
    this.getDicts('rules_detectTime').then((res) => {
      this.dict.detectTime = res.data.data
    })
    getManageList({ size: 10000, current: 1 }).then((res) => {
      this.dict.algorithmId = res.data.data.records
    })
    getAlgorithmList({ size: 10000, current: 1 }).then((res) => {
      this.dict.algorithmPackageId = res.data.data.records
    })
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getSubscribeList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => [(this.loading = false)])
    },

    handleAdd() {
      if (!this.permissions.rules_subscribe_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      if (!this.permissions.rules_subscribe_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.subscriptionId
      this.formOptions.visible = true
    },
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    handleClear() {
      this.queryParams.subscribeType = null
      this.queryParams.status = null
      this.queryParams.subscriptionName = null
      this.resetForm('queryParams')
      this.handleQuery()
    },
    handleDelete(row) {
      if (!this.permissions.rules_subscribe_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该订阅配置', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delSubscribe(row.subscriptionId)
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
      const id = row.subscriptionId
      this.$router.push({
        path: '/app/camera/space/info/index/',
        query: { id },
      })
    },
    handleChangeStatus(row) {
      if (!this.permissions.rules_subscribe_state) return this.msgWarn('权限不足')
      this.loading = true
      const subscriptionId = row.subscriptionId
      const status = row.status
      putSubscribe({ subscriptionId, status })
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
    handleRecord(row) {
      if (!this.permissions.rules_subscribe_view) return this.msgWarn('权限不足')
      this.$router.push({
        path: '/app/rules/subscribe/record/index',
        query: {
          name: row.subscriptionName,
        },
      })
    },
    handleLook() {
      if (!this.permissions.rules_subscribe_viewAll) return this.msgWarn('权限不足')
      this.$router.push('/app/rules/subscribe/record/index')
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
    justify-content: space-between;
    .icon {
      flex-shrink: 0;
      margin-right: 16px;
      width: 50px;
      height: 50px;
    }
    label {
      color: #333;
      display: flex;
      flex-direction: column;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 2;
      align-items: center;
      margin-right: 10px;
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
    .delete {
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

