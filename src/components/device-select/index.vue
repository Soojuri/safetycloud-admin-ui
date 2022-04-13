<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="设备类型" prop="deviceType">
        <el-select v-model="queryParams.deviceType" placeholder="设备类型" clearable size="small">
          <el-option v-for="dict in deviceTypeOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="设备编号" prop="deviceId">
        <el-input v-model="queryParams.deviceId" placeholder="请输入设备编号" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="具体地址" prop="address">
        <el-input v-model="queryParams.address" placeholder="请输入具体地址" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属空间" prop="idPath">
        <el-cascader :props="props" :options="options" size="small" @change="queryPosition" style="width: 250px" ref="queryDevicePosition">
        </el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" />
      <el-table-column label="设备编号" align="center" prop="deviceId" :show-overflow-tooltip="true" />
      <el-table-column label="设备类型" align="center" prop="deviceType" :formatter="devicTypeFormat" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column label="所属空间" align="center" prop="installPositionNamePath" />
      <el-table-column label="具体地址" align="center" prop="address" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag :type="formatColor(scope.row)" close-transition>{{
            formatStatusDict(scope.row)
          }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="g-page-x mt-m">
      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.current" :limit.sync="queryParams.size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import {
  fetchList,
  getChildrenNodes
} from "@/api/device/tdeviceinfo"
export default {
  name: "deviceManagement",
  data () {
    return {
      // 搜索
      search: "",
      hasMore: true,
      relatHeight: "50px",
      tool: 1,
      relatingList: [],
      areaList: [], // 区域列表
      currentToolIndex: -1,
      // 选中行
      selection: [],
      // 总条数
      total: 0,
      // 设备数据列表
      deviceList: [],
      // 设备类型数据字典
      deviceTypeOptions: [],
      //设备状态数据字典
      deviceStateDict: [],
      //设备是否数据字典
      deviceYesNoOptions: [],
      // 查询参数
      queryParams: {
        current: 1,
        size: 10,
        deviceId: undefined,
        deviceType: undefined,
        address: undefined,
        keyword: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deviceName: [{
          required: true,
          message: "设备名称不能为空",
          trigger: "blur"
        },],
        deviceId: [{
          required: true,
          message: "设备编号不能为空",
          trigger: "blur"
        },],
        address: [{
          required: true,
          message: "设备地址不能为空",
          trigger: "blur"
        },],
        deviceType: [{
          required: true,
          message: "请选择设备类型",
          trigger: "blur"
        },],
      },
      // 所属空间
      options: [],
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad (node, resolve) {
          const {
            level
          } = node
          getChildrenNodes(node.value).then((response) => {
            const nodes = response.data.map((item, i) => ({
              value: item.id,
              label: item.name,
              leaf: node.level >= 3,
            }))
            resolve(nodes)
          })
        },
      },
    }
  },
  created () {
    this.getList()
    this.getDicts("device_yes_no").then((response) => {
      this.deviceYesNoOptions = response.data
    })
    this.getDicts("device_state").then((response) => {
      this.deviceStateDict = response.data
    })
    this.getDicts("device_type").then((response) => {
      this.deviceTypeOptions = response.data
    })
    this.getAreaList()
  },

  methods: {
    // 查询区域列表
    getAreaList () {
      getChildrenNodes().then((res) => {
        if (res.code === 200) {
          this.areaList = res.data.map((item) => ({
            value: item.id,
            name: item.name,
            type: "areaId",
          }))
        }
      })
    },

    getList () {
      this.loading = true
      fetchList(this.queryParams).then((response) => {
        this.deviceList = response.data.data.records
        this.total = response.data.data.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    /** ---------所属空间相关--------- */
    queryPosition (value) {
      this.queryParams.idPath = value.join(">")
    },

    /** 搜索按钮操作 */
    handleQuery () {
      this.queryParams.current = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery () {
      this.dateRange = []
      this.resetForm("queryForm")
      this.handleQuery()
      this.$refs.queryDevicePosition.handleClear()
      this.queryParams.idPath = undefined
    },
    // 表单重置
    reset () {
      this.form = {
        undefined,
      }
    },
    //选中事件
    handleSelectionChange (selection) {
      this.selection = selection
    },
    // 参数系统内置字典翻译
    devicTypeFormat (row) {
      return this.selectDictLabel(this.deviceTypeOptions, row.deviceType)
    },
    formatStatusDict (row, column) {
      // 设备状态
      return this.selectDictLabel(this.deviceStateDict, row.status)
    },
    formatColor (row) {
      if (row.status === 1) {
        return "success"
      } else if (row.status === 0) {
        return "danger"
      } else if (row.status === 2) {
        return "warning"
      }
    },
    //提交设备选择
    handleSubmit () {
      if (this.selection != null && this.selection.length == 1) {
        this.$emit('handleSubmit', this.selection[0])
      } else {
        this.msgWarn("请选择一条设备信息")
      }
    }
  },
};

</script>
<style lang="scss" scoped>
.search-box {
  margin: 0 -20px 30px -20px;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 10px solid #f0f2f5;

  .search-content {
    width: 50%;
    text-align: center;
    margin: 30px auto;

    .gray-block {
      cursor: pointer;
      background: #858585;
      color: #fff;
      border-radius: 10px;
      width: auto;
      font-size: 12px;
      height: 14px;
      line-height: 14px;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 0 20px;
      box-sizing: border-box;
      display: inline-block;
    }

    .active {
      background: #1890ff;
    }

    .search-input {
      margin-bottom: 10px;

      .search-btn {
        color: #fff;
        border-color: #1890ff;
        background: #1890ff;
        border-radius: 0 2px 2px 0;
      }
    }

    .tool-tip {
      position: relative;
      padding: 5px;
      cursor: pointer;
      text-align: right;
      font-size: 12px;
      z-index: 1;

      i {
        font-size: 14px;
        margin-right: 5px;
      }
    }

    .search-tool {
      position: relative;
      z-index: 0;
      margin-top: -5px;
      padding: 10px 0;
      box-sizing: border-box;
      position: relative;

      .tool-list {
        /deep/.el-radio-button {
          margin-right: 20px;
          border-radius: 4px;
          border: 1px solid #dcdfe6;

          /deep/ .el-radio-button__inner {
            border-radius: 4px;
            border: none;
            padding: 7px 20px;
            font-size: 12px;
          }
        }
      }

      .relating-list {
        max-height: 50px;
        overflow: hidden;
        margin-top: 10px;
      }

      .more-btn {
        cursor: pointer;
        text-align: right;
        font-size: 14px;
        color: #999;
      }
    }

    .hot-search {
      position: relative;
      text-align: center;

      .hot-tip {
        position: relative;
        font-size: 12px;
        text-align: center;

        div {
          position: absolute;
          margin: 2px auto;
          left: 0;
          right: 0;
        }

        .tip-line {
          margin-top: 18px;
          width: 20px;
          height: 1px;
          border-bottom: 1px solid #409eff;
        }
      }

      .hot-list {
        padding-top: 30px;
        margin-bottom: 10px;
        text-align: center;
      }
    }
  }
}
</style>
