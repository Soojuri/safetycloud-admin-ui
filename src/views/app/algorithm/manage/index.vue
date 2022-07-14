<!-- 算法模型管理 -->
<template>
  <div class="sub-page">
    <div class="count-x">
      <div class="cell c1">
        <img class="icon" :src="require('@/assets/images/arithmetic-manage/icon-sfzs.png')" />
        <dl>
          <dd>{{list.algorithmTotal}}</dd>
          <dt>算法总数</dt>
        </dl>
      </div>
      <div class="cell c2">
        <img class="icon" :src="require('@/assets/images/arithmetic-manage/icon-yqysf.png')" />
        <dl>
          <dd>{{list.algorithmEnabled}}</dd>
          <dt>已启用算法</dt>
        </dl>
      </div>
      <div class="cell c3">
        <img class="icon" :src="require('@/assets/images/arithmetic-manage/icon-wqysf.png')" />
        <dl>
          <dd>{{list.algorithmDisabled}}</dd>
          <dt>未启用算法</dt>
        </dl>
      </div>
      <div class="cell c4">
        <img class="icon" :src="require('@/assets/images/arithmetic-manage/icon-sfyglsbs.png')" />
        <dl>
          <dd>{{list.algorithmDevice}}</dd>
          <dt>算法已关联设备数</dt>
        </dl>
      </div>
    </div>

    <!-- <div class="filter-btn-box mt-l">
      <label class="text">所属类目</label>
      <el-radio-group v-model="radio1" @change="changeRadio">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="通用算法类"></el-radio-button>
        <el-radio-button label="城市治理类"></el-radio-button>
        <el-radio-button label="应急管理类"></el-radio-button>
        <el-radio-button label="水域治理类"></el-radio-button>
      </el-radio-group>
    </div> -->
    <!-- 【规范】表格头部筛选 用 g-filter容器
    mt-l 对上 l间距
    label-width-6em  表示字段名文本宽度为6个汉字
    -->
    <!-- 头部筛选 -->
    <div>
      <!-- 如果内容不局限于一行三列，可以使用flex-nowrap限制 -->
      <el-form ref="queryParams" class="mt-m" inline :model="queryParams">
        <el-form-item prop="algorithmName" label="算法名称">
          <el-input v-model.trim="queryParams.algorithmName" placeholder="请输入算法名称"></el-input>
        </el-form-item>
        <el-form-item prop="algorithmCapabilitySet" label="能力标签">
          <el-input v-model.trim="queryParams.algorithmCapabilitySet" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label='算法分类' prop='algorithmPackageId'>
          <el-select v-model="queryParams.algorithmPackageId" placeholder="请选择算法分类">
            <el-option v-for="item in dict.algorithmPackageId" :key="item.packageId" :label="item.packageName"
                       :value="item.packageId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">查 询</el-button>
        <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>

      </el-form>
    </div>
    <div class="new-add">
      <el-button type="primary" @click="handleAdd">新 增</el-button>
      <el-button size="small" icon="el-icon-download" @click="handleImport()">批量导入</el-button>
    </div>
    <!-- 切换列表/卡片模式 -->
    <right-toolbar :columns="columns" @queryTable="getList">
      <template slot="btn">
        <el-tooltip class="item" effect="dark" :content="cardMode? '列表模式':'卡片模式'" placement="top">
          <el-button size="mini" circle icon="el-icon-s-operation" @click="toggleTableMode()" />
        </el-tooltip>
      </template>
    </right-toolbar>
    <!-- 卡片模式 -->
    <div v-loading="loading" v-show="cardMode">
      <div class="arit-list" v-if="tableData && tableData.length > 0">
        <div class="cell" v-for="(item, index) in tableData" :key="index">
          <div class="light">
            <img src="@/assets/images/bright.png" v-if="item.enable == 1 && item.expirationTime > Date.now()" />
            <img src="@/assets/images/dark.png" v-else />
          </div>
          <div class="state green" v-if="item.enable == 1">
            启用</div>
          <div class="state orange" v-if="item.enable == 0">未启用</div>
          <div class="cover">
            <img class="icon" :src="item.backgroundUrl" />
          </div>
          <div class="tit">
            <label>{{ item.algorithmName }}</label>
            <span v-if="item.expirationTime <= Date.now() && item.expirationTime">过期</span>
            <span v-if="item.expirationTime > Date.now()">{{ parseTime(item.expirationTime,'{y}-{m}-{d}') }}</span>
            <span style="color:red" v-if="!item.expirationTime">无订单</span>
          </div>
          <p>{{ item.remark }}</p>
          <div class="opera">
            <div class="edit" @click="handleEdit(item)">编辑</div>
            <el-button class="delete" :disabled="item.enable == 0?false:true" size="medium" icon="el-icon-delete"
                       type="text" @click="handleDelete(item)">删除
            </el-button>
            <div class="link" @click="handleDetails(item)">查看详情</div>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无数据"></el-empty>
    </div>
    <!-- 列表模式 -->
    <div class="g-table mt-xl" v-show="!cardMode">
      <el-table v-loading="loading" :data="tableData" border>
        <el-table-column prop="algorithmId" show-overflow-tooltip label="算法ID" />
        <el-table-column prop="algorithmName" label="算法名称" />
        <el-table-column prop="enable" label="是否启用" width="100">
          <template slot-scope="scope">
            <el-tag type="success" plain v-if="scope.row.enable == 1">启用</el-tag>
            <el-tag type="warning" plain v-if="scope.row.enable == 0">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <el-tag type="success" plain v-if="scope.row.orderStatus == 1">正常</el-tag>
            <el-tag type="info" plain v-else-if="scope.row.orderStatus == 2">过期</el-tag>
            <span v-else>订单未绑定</span>
          </template>
        </el-table-column>
        <el-table-column prop="expirationTime" label="过期时间">
          <template slot-scope="scope">{{parseTime(scope.row.expirationTime)}}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" :disabled="scope.row.enable == 0?false:true"
                       @click="handleDelete(scope.row)">删除
            </el-button>
            <el-button type="text" icon="el-icon-info" @click="handleDetails(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="g-page-x mt-m">
      <pagination :pageSizes="[8,16,32,64]" :total="total" :page.sync="queryParams.current"
                  :limit.sync="queryParams.size" @pagination="getList" />
    </div>
    <!-- 弹窗 -->
    <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
              @ok="getList()">
    </pop-form>
    <excel-upload ref="excelUpload" tempName="算法导入模板.xlsx" :tempUrl="tempUrl" title="算法批量导入" :url="importUrl"
                  @refreshDataList="handleClear"></excel-upload>
  </div>
</template>

<script>
import PopForm from '@/views/app/algorithm/manage/popFrom.vue'
import { getManageList, delManage, getCount } from '@/api/app/algorithm/manage.js'
import { getAlgorithmList } from '@/api/app/algorithm/bag.js'
import { mapGetters } from 'vuex'
import ExcelUpload from '@/components/upload/excel'
import RightToolbar from '@/components/RightToolbar/index.vue'
export default {
  components: { PopForm, ExcelUpload, RightToolbar },
  data() {
    return {
      radio1: '全部',
      formOptions: {
        visible: false,
        data: {},
      },
      queryParams: {
        size: 8,
        current: 1,
        algorithmName: null,
        algorithmCapabilitySet: null,
        algorithmType: null,
      },
      tableData: [],
      list: [],
      protocolTypeDict: [], //协议类型字典
      dict: {},
      total: 0,
      loading: false,
      importUrl: process.env.VUE_APP_BASE_API + '/iefVasService/tVideoAnalyseAlgorithm/import',
      tempUrl: '/admin/systemplate/getByName/算法导入模板',
      cardMode: true,
    }
  },
  mounted() {
    getAlgorithmList({ size: 10000, current: 1 }).then((res) => {
      this.dict.algorithmPackageId = res.data.data.records
    })
    // 导入字典
    this.getDicts('algorithm_source').then((res) => {
      this.dict.algorithmSource = res.data.data
      this.getList()
    })
    this.getDicts('algorithm_type').then((res) => {
      this.dict.algorithmType = res.data.data
      this.getList()
    })
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  methods: {
    changeRadio(value) {
      if (value == '通用算法类') {
        this.queryParams.algorithmType = 1
        this.handleQuery()
      } else if (value == '城市治理类') {
        this.queryParams.algorithmType = 2
        this.handleQuery()
      } else if (value == '应急管理类') {
        this.queryParams.algorithmType = 3
        this.handleQuery()
      } else if (value == '水域治理类') {
        this.queryParams.algorithmType = 4
        this.handleQuery()
      } else {
        this.queryParams.algorithmType = ''
        this.handleQuery()
      }
    },
    getList() {
      console.log(Date.now())
      this.loading = true
      getManageList(this.queryParams).then((res) => {
        this.loading = false
        this.tableData = res.data.data.records
        this.total = res.data.data.total
      })
      getCount().then((res) => {
        this.loading = false
        this.list = res.data.data
      })
    },
    formatType(row) {
      return (
        this.selectDictLabel(this.dict.algorithmSource, row.algorithmSource),
        this.selectDictLabel(this.dict.algorithmType, row.algorithmType)
      )
    },
    //新增
    handleAdd() {
      if (!this.permissions.algorithm_manage_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    // 搜索
    handleQuery() {
      const that = this
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          that.getList()
        }
      })
    },
    // 清空
    handleClear() {
      this.resetForm('queryParams')
      this.getList()
    },
    // 批量导入
    handleImport() {
      this.$refs.excelUpload.show()
    },
    // 编辑
    handleEdit(row) {
      if (!this.permissions.algorithm_manage_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.algorithmId
      this.formOptions.visible = true
    },
    // 删除
    handleDelete(row) {
      if (!this.permissions.algorithm_manage_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该算法', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delManage(row.algorithmId)
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
    // 详情
    handleDetails(row) {
      if (!this.permissions.algorithm_manage_view) return this.msgWarn('权限不足')
      const id = row.algorithmId
      this.$router.push('/app/algorithm/manage/details/index?id=' + id)
    },
    // 切换模式
    toggleTableMode() {
      this.cardMode = !this.cardMode
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
.light {
  position: absolute;
  height: 24 * $vw;
  font-size: 16 * $vw;
  left: -28px;
  top: 0px;
  text-align: center;
  width: 4em;
  box-sizing: content-box;
  padding: 0 20px;
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
.count-x {
  display: flex;
  margin-right: -12 * $vw;
  .c1 {
    background: linear-gradient(to bottom, #33bdf6, #118ced);
  }
  .c2 {
    background: linear-gradient(to bottom, #54d8e0, #1cb7ba);
  }
  .c3 {
    background: linear-gradient(to bottom, #f1cf47, #efa71d);
  }
  .c4 {
    background: linear-gradient(to bottom, #f4a05d, #ed772d);
  }
  dl,
  dt,
  dd {
    margin: 0;
  }
  .cell {
    border-radius: 10 * $vw;
    flex: 1;
    margin-right: 12 * $vw;
    margin-top: 12 * $vw;
    padding: 20 * $vw 28 * $vw;
    display: flex;
    align-items: center;
    color: white;
    .icon {
      margin-right: 18 * $vw;
      width: 82 * $vw;
      height: 82 * $vw;
    }
    dd {
      font-size: 48 * $vw;
      line-height: 1;
    }
    dt {
      font-size: 20 * $vw;
    }
  }
}

.filter-btn-box {
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.1);
  .text {
    margin-right: 40px;
    line-height: 1;
  }
  .el-radio-group {
    display: flex;
    width: 70%;
    justify-content: space-between;
    ::v-deep .el-radio-button__inner {
      border: none;
      font-size: 16px;
    }
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      border-radius: 4px !important;
    }
  }
}
.new-add {
  margin-top: 12px;
}
.arit-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6px;
  margin-top: 12px;
  .cell {
    position: relative;
    width: calc(25% - 12px);
    margin: 6px;
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.1);
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s;
    &:hover {
      cursor: pointer;
      transform: translateY(-3px);
      box-shadow: 0 0 15px rgba($color: #000000, $alpha: 0.1);
    }
  }
  .state {
    position: absolute;
    height: 24 * $vw;
    font-size: 16 * $vw;
    color: white;
    right: -24px;
    top: 10px;
    text-align: center;
    width: 4em;
    box-sizing: content-box;
    transform: rotate(45deg);
    background: #26d90e;
    padding: 0 20px;
    &.orange {
      background: #f68119;
    }
  }
  .cover {
    border-bottom: solid 1px #e0e0e0;
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      display: block;
    }
  }
  .tit {
    margin: 8px 12px;
    display: flex;
    font-size: 16px;
    label {
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      margin-right: 10px;
    }
    span {
      font-size: 14px;
      color: #999999;
    }
  }
  p {
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    margin: 8px 12px;
    color: #4c4c4c;
    font-size: 14px;
    height: 38px;
  }
  .opera {
    border-top: solid 1px #e0e0e0;
    display: flex;
    justify-content: space-between;
    .edit {
      cursor: pointer;
      padding: 12px;
      color: $--color-primary;
      &::before {
        content: '\e933';
        font-family: c-icon-font, sans-serif;
        font-size: 16px;
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
