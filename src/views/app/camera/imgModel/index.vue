<template>
  <div class="sub-page">
    <div class="mt-xl">
      <el-form ref="queryParams" :model="queryParams" inline label-width="80px">
        <el-form-item label="设备编号" prop="deviceNo" :rules="[$formRules.checkLen(50)]">
          <el-input v-model.trim="queryParams.deviceNo" placeholder="请输入设备编号"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select style="width:191px;" v-model="queryParams.status" placeholder="请选择状态">
            <el-option v-for="item in dict.deviceStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备厂商" prop="producer">
          <el-select style="width:191px;" v-model="queryParams.producer" placeholder="请选择设备厂商">
            <el-option v-for="item in dict.producer" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="videoDeviceType">
          <el-select style="width:191px;" v-model="queryParams.videoDeviceType" placeholder="请选择设备类型">
            <el-option v-for="item in dict.cameraType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label='设备IP' prop='deviceIp' :rules="[$formRules.checkLen(50)]">
          <el-input size='small' v-model.trim='queryParams.deviceIp' placeholder='请输入设备IP'>
          </el-input>
        </el-form-item>
        <el-form-item label="空间目录" prop="spaceId">
          <el-select style="width:191px;" v-model="queryParams.spaceId" placeholder="请选择空间目录">
            <el-option v-for="item in dict.spaceList" :key="item.spaceId" :label="item.spaceName" :value="item.spaceId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接入类型" prop="protocolType">
          <el-select style="width:191px;" v-model="queryParams.protocolType" placeholder="请选择接入类型">
            <el-option v-for="item in dict.protocolType" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜 索</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-empty class="mt-xl" size="100" v-if="tableData.length == 0"></el-empty>
    <div class="camera-manage">
      <div class="camera-list">
        <div class="cell" v-for="item in tableData">
          <div class="cover">
            <img v-if="item.pictureUrl" :src="IMAGE_PATH + item.pictureUrl" />
            <img v-else :src=" require('@/assets/images/camera-manage/cover-default.jpg')" />
          </div>
          <div class="info">
            <label>{{item.deviceName}}</label>
            <p>{{item.deviceNo}}</p>
          </div>
          <div class="footer">
            <div :class="item.status == -1 ?'state grey':'state green' ">{{formatStatus(item)}}</div>
            <div class="link" @click="handleInfo(item)">查看详情</div>
          </div>
        </div>
      </div>
      <div class="g-page-x mt-m" v-if="tableData.length > 0">
        <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                    :limit.sync="queryParams.size" @pagination="getList" />
      </div>
    </div>
  </div>
</template>

<script>
import { getSpaceAreaTree, getSpaceList } from '@/api/app/camera/space'
import { delVideoDevice, getVideoDeviceList } from '@/api/app/camera/videoDevice'
import { mapGetters } from 'vuex'

export default {
  components: {},
  data() {
    return {
      treeData: [],
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
      },
      areaParams: {
        areaCode: null,
        level: null,
      },
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
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  mounted() {
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
      getVideoDeviceList({ ...this.queryParams, ...this.areaParams }).then((res) => {
        this.tableData = res.data.data.records
        this.total = res.data.data.total
      })
    },
    formatStatus(row) {
      return this.selectDictLabel(this.dict.deviceStatus, row.status)
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
      this.formOptions.data.id = row.deviceId
      this.formOptions.visible = true
    },
    handleClear() {
      this.resetForm('queryParams')
      this.getList()
    },
    handleAdd() {
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleAreaSelect(data) {
      this.areaParams.areaCode = data.id
      this.areaParams.level = data.level
      this.getList()
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
    handleInfo(row) {
      if (!this.permissions.camera_imgModel_view) return this.msgWarn('权限不足')
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

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.sub-page {
  min-height: 100%;
  background-color: white;
  margin: 0 12px;
  width: auto;
}
.camera-list {
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  margin-top: 20px;
  margin-right: -6px;
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
    .cover {
      // height: 200px;
      &:after {
        content: '';
        padding-bottom: 60%;
      }
      img {
        display: block;
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
    }
    .info {
      padding: 10px 12px;
      label {
        font-size: 18px;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
      }
      p {
        font-size: 16px;
        color: #999999;
        word-break: break-all;
        margin-top: 4px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 1;
      }
    }
    .footer {
      display: flex;
      font-size: 16px;
      border-top: solid 1px #e8ecee;
      align-items: center;
      padding: 10px 12px;
      .state {
        flex: 1;
        &::before {
          display: inline-block;
          vertical-align: top;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          content: '';
          margin-top: 8px;
          margin-right: 4px;
        }
      }
      .link {
        cursor: pointer;
        color: $--color-primary;
        &:after {
          content: '\e932';
          font-family: c-icon-font, sans-serif;
          font-size: 14px;
          margin-left: 4px;
          vertical-align: -1px;
        }
      }
    }
  }
}
</style>
