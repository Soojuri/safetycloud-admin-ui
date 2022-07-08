<!-- 摄像头管理-视频设备管理 -->
<template>
  <div class='sub-page'>
    <div class="cell">
      <div class="nav-btn cus-icon-navicon-active" v-if="isClose">
        <i class="cus-icon-navicon " @click="isClose = false"></i>
      </div>
      <div class="g-card" v-if="!isClose">
        <div class="g-tit">
          <span>行政区域</span>
          <i class="fr cus-icon-navicon" @click="isClose = true"></i>
        </div>

        <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable>
        </el-input>
        <el-tree class="nav-tree mt-m" ref="tree" :filter-node-method="filterNode" node-key="id" show-checkbox
                 @check="handleAreaSelect" default-expand-all :data="treeData">
        </el-tree>
      </div>

      <div class="g-card ml-m main-box">
        <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
          <el-form-item label="设备编号" prop="deviceNo" :rules="[$formRules.checkLen(100)]">
            <el-input v-model="queryParams.deviceNo" style="width:206px" placeholder="请输入设备编号"></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择状态">
              <el-option v-for="item in dict.deviceStatus" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备厂商" prop="producer">
            <el-select v-model="queryParams.producer" placeholder="请选择设备厂商">
              <el-option v-for="item in dict.producer" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="videoDeviceType">
            <el-select v-model="queryParams.videoDeviceType" placeholder="请选择设备类型">
              <el-option v-for="item in dict.cameraType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="空间目录" prop="spaceId">
            <el-select v-model="queryParams.spaceId" placeholder="请选择空间目录">
              <el-option v-for="item in dict.spaceList" :key="item.spaceId" :label="item.spaceName"
                         :value="item.spaceId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label='设备IP' prop='deviceIp'>
            <el-input size='small' v-model='queryParams.deviceIp' style="width:206px" placeholder='请输入设备IP'
                      :rules="[$formRules.checkLen(50)]">
            </el-input>
          </el-form-item>
          <el-form-item label="接入类型" prop="protocolType">
            <el-select v-model="queryParams.protocolType" placeholder="请选择接入类型">
              <el-option v-for="item in dict.protocolType" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作业状态" prop="taskStatus">
            <el-select v-model="queryParams.taskStatus" placeholder="请选择作业状态">
              <el-option label="运行作业中" :value="1" />
              <el-option label="未运行作业" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item class="ml-xl">
            <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
            <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
          </el-form-item>
        </el-form>
        <div class="mt-m">
          <div class="g-opera">
            <el-button type="primary" @click="handleAdd">新 增</el-button>
            <el-button type="primary" size="small" icon="el-icon-download" @click="handleImport()">
              批量导入
            </el-button>
          </div>
          <right-toolbar :columns="columns" @queryTable="handleClear"></right-toolbar>
          <div class="g-table">
            <el-table v-loading="loading" border :data="tableData" style="width:100%">
              <el-table-column prop="deviceNo" label="设备编号" v-if="columns[0].visible" />
              <el-table-column prop="deviceName" label="设备名称" v-if="columns[1].visible" />
              <el-table-column prop="producer" label="设备厂商" :formatter="formatProducer" v-if="columns[2].visible" />
              <el-table-column prop="videoDeviceType" label="设备类型" :formatter="formatDeviceType"
                               v-if="columns[3].visible" />
              <el-table-column prop="channelCount" label="通道数" v-if="columns[4].visible" />
              <el-table-column prop="deviceIp" label="设备IP" v-if="columns[5].visible" />
              <el-table-column prop="status" label="状态" :formatter="formatStatus" v-if="columns[6].visible" />
              <el-table-column prop="spaceName" label="空间目录" v-if="columns[7].visible" />
              <el-table-column prop="protocolType" label="接入类型" v-if="columns[10].visible"
                               :formatter="protocolTypeFormat" />
              <el-table-column prop="createTime" label="创建时间" v-if="columns[8].visible">
                <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
              </el-table-column>
              <el-table-column label="操作" width="200" v-if="columns[9].visible">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-info" @click="handleInfo(scope.row)">查看</el-button>
                  <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="g-page-x mt-m">
            <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                        :limit.sync="queryParams.size" @pagination="getList" />
          </div>
        </div>

      </div>
    </div>

    <!-- 弹窗 -->
    <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
              @ok="getList()">
    </pop-form>
    <!-- 空间选择弹窗 -->
    <el-dialog title="选择空间目录" :visible="visible1" append-to-body :close-on-click-modal='false' @close="visible1=false">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='queryParams1' label-width='120px' ref='queryParams1'>
            <el-form-item label="空间目录" prop="spaceId">
              <el-select v-model="queryParams1.spaceId" placeholder="请选择空间目录">
                <el-option v-for="item in dict.spaceList" :key="item.spaceId" :label="item.spaceName"
                           :value="item.spaceId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' style="text-align: center;">
        <el-button @click="visible1=false">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
    <excel-upload ref="excelUpload" tempName="视频设备导入模板.xlsx" :data="data" :tempUrl="tempUrl" title="视频设备批量导入"
                  :url="importUrl" @refreshDataList="handleClear"></excel-upload>
  </div>
</template>

<script>
import { getSpaceAreaTree, getSpaceList } from '@/api/app/camera/space'
import { delVideoDevice, getVideoDeviceList } from '@/api/app/camera/videoDevice'
import PopForm from './popForm.vue'
import RightToolbar from '@/components/RightToolbar/index.vue'
import ExcelUpload from '@/components/upload/excel'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm, RightToolbar, ExcelUpload },
  data() {
    return {
      treeData: [],
      isClose: false,
      columns: [
        { key: 0, label: `设备编号`, visible: true },
        { key: 1, label: `设备名称`, visible: true },
        { key: 2, label: `设备厂商`, visible: true },
        { key: 3, label: `设备类型`, visible: true },
        { key: 4, label: `通道数`, visible: false },
        { key: 5, label: `设备IP`, visible: false },
        { key: 6, label: `状态`, visible: true },
        { key: 7, label: `空间目录`, visible: true },
        { key: 8, label: `创建时间`, visible: true },
        { key: 9, label: `操作`, visible: true },
        { key: 10, label: `接入类型`, visible: true },
      ],
      tempUrl: '/admin/systemplate/getByName/视频设备导入模板',
      queryParams: {
        size: 10,
        current: 1,
        deviceNo: null,
        status: null,
        producer: null,
        videoDeviceType: null,
        spaceId: null,
        deviceIp: null,
        protocolType: null,
        taskStatus: null,
      },
      data: {},
      queryParams1: {
        spaceId: null,
      },
      rules: {
        spaceId: [this.$formRules.checkNecessary('请选择所属空间目录')],
      },
      areaParams: {
        areaCode: null,
        level: null,
      },
      showSearch: false,
      tableData: [],
      total: 0,
      dict: {
        deviceStatus: [],
        cameraType: [],
        producer: [],
        protocolType: [],
        spaceList: [],
      },
      formOptions: {
        visible: false,
        data: {},
      },
      visible1: false,
      filterText: null,
      importUrl: process.env.VUE_APP_BASE_API + '/video/tdevicevideo/import',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  mounted() {
    this.queryParams.status = this.$route.query.status
    this.getDictList()
    this.getList()
  },
  methods: {
    getDictList() {
      this.getDicts('video_status').then((res) => {
        this.dict.deviceStatus = res.data.data
      })
      this.getDicts('video_device_producer').then((res) => {
        this.dict.producer = res.data.data
      })
      this.getDicts('camera_device_type').then((res) => {
        this.dict.cameraType = res.data.data
      })
      this.getDicts('space_protocol_type').then((res) => {
        this.dict.protocolType = res.data.data
      })
      getSpaceList({ size: 10000, current: 1 }).then((res) => {
        this.dict.spaceList = res.data.data.records
      })
      getSpaceAreaTree().then((res) => {
        this.treeData = res.data.data
      })
    },
    getList() {
      this.loading = true
      getVideoDeviceList({ ...this.queryParams, ...this.areaParams })
        .then((res) => {
          this.tableData = res.data.data.records
          this.total = res.data.data.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleQuery() {
      const that = this
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          that.getList()
        }
      })
    },

    handleDelete(row) {
      if (!this.permissions.camera_videoDevice_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该设备', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delVideoDevice(row.deviceId)
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
    handleEdit(row) {
      if (!this.permissions.camera_videoDevice_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.deviceId
      this.formOptions.visible = true
    },
    handleClear() {
      this.resetForm('queryParams')
      this.getList()
    },
    handleAdd() {
      if (!this.permissions.camera_videoDevice_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleAreaSelect() {
      const ids = this.$refs.tree.getCheckedKeys()
      this.areaParams.areaCode = ids.join(',')
      this.getList()
    },
    handleImport() {
      // if (!this.permissions.camera_videoDevice_import) return this.msgWarn('权限不足')
      this.visible1 = true
    },
    handleSave() {
      this.data.spaceId = this.queryParams1.spaceId
      this.$refs.queryParams1.validate((valid) => {
        if (valid) {
          this.visible1 = false
          if (this.data.spaceId) {
            this.$refs.excelUpload.show()
          }
        }
      })
    },
    formatStatus(row) {
      return this.selectDictLabel(this.dict.deviceStatus, row.status)
    },
    formatDeviceType(row) {
      return this.selectDictLabel(this.dict.cameraType, row.videoDeviceType)
    },
    formatProducer(row) {
      return this.selectDictLabel(this.dict.producer, row.producer)
    },
    protocolTypeFormat(row) {
      return this.selectDictLabel(this.dict.protocolType, row.protocolType)
    },
    handleInfo(row) {
      if (!this.permissions.camera_videoDevice_view) return this.msgWarn('权限不足')
      this.$router.push({
        path: '/app/camera/videoDevice/info/index/',
        query: {
          id: row.deviceId,
        },
      })
    },
  },
}
</script>
<style lang='scss' scoped>
@import '@/styles/variables.scss';
.cell {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
}
.cus-icon-navicon-close,
.cus-icon-navicon {
  cursor: pointer;
  padding: 3px;
  &:hover {
    color: $--color-primary;
  }
}
.cus-icon-navicon::before {
  content: '\e904';
}
.cus-icon-navicon-active {
  transform: scaleX(-1);
}
.nav-btn {
  padding: 10px;
  background: #fff;
  display: flex;
  // align-items: center;
  justify-content: center;
}
.nav-tree {
  width: 300 * $vw;
}
.main-box {
  overflow: hidden;
}
.g-card {
  margin-bottom: 0px;
}
.cus-icon-navicon-close::before {
  content: '\e93c';
}
</style>