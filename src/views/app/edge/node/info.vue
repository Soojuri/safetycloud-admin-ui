<!-- 边缘节点详情 -->
<template>
  <div class='sub-page' v-loading="loading">
    <div class="g-card">
      <div class="g-tit-s">
        {{info.name}}
        <span class="green_status ml-m" v-if="info.state === 'RUNNING'"></span>
        <span class="red_status ml-m" v-else></span>
        <span>{{formatState(info.state)}}</span>
      </div>
      <div class="info-id mt-m">ID:{{info.id}}</div>
      <el-descriptions class="mt-m" size="medium">
        <el-descriptions-item label="状态描述">{{formatState(info.state)}}</el-descriptions-item>
        <el-descriptions-item label="升级记录">
          <span>{{info.upgrade_flag  ? '安装成功' : '安装失败'}}</span>
          <a class="ml-m cursor" @click="upgradeShow = true">查看</a>
        </el-descriptions-item>
        <el-descriptions-item label="节点描述">{{info.description}}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{parseTime(new Date(info.created_at))}}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{parseTime(new Date(info.updated_at))}}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div class="g-card">
      <el-tabs>
        <el-tab-pane label="节点概览">
          <el-descriptions class="mt-m" size="medium" :column="2">
            <el-descriptions-item label="主机名">{{info.host_name}}</el-descriptions-item>
            <el-descriptions-item label="网络(网卡:ID)">
              <span v-for="item in info.nics">{{item.interface}}:{{item.ip}}</span>
            </el-descriptions-item>
            <el-descriptions-item label="操作系统">{{info.os_name}}-{{info.os_type}}-{{info.os_version}}
            </el-descriptions-item>
            <el-descriptions-item label="规格">{{info.cpu}} Core | {{info.memory}} MiB</el-descriptions-item>
            <el-descriptions-item label="设备数量">{{info.device_num}}</el-descriptions-item>
            <el-descriptions-item label="实例数量">{{info.deployment_num}}</el-descriptions-item>
            <el-descriptions-item label="边缘侧软件版本">{{info.ief_node_version}}</el-descriptions-item>
            <el-descriptions-item label="是否启用docker">{{info.docker_enable ? '是' : '否'}}</el-descriptions-item>
            <el-descriptions-item label="容器运行时版本">{{info.container_runtime_version}}</el-descriptions-item>
            <el-descriptions-item label="MQTT服务配置">{{info.mqtt_internal}}</el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="设备">
          <div class="g-opera">
            <el-button type="primary" @click="deviceOpen=true">绑定终端设备</el-button>
          </div>
          <div class="g-table">
            <el-table v-loading="loading" border :data="deviceList">
              <el-table-column prop="edgeDeviceName" label="设备名称" />
              <el-table-column prop="relation" label="设备与节点的关系">
              </el-table-column>
              <el-table-column prop="updateTime" label="更新时间">
                <template slot-scope="scope">{{parseTime(scope.row.updateTime)}}</template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间">
                <template slot-scope="scope">{{parseTime(scope.row.createTime)}}</template>
              </el-table-column>
            </el-table>
          </div>
          <div class="g-page-x mt-m">
            <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                        :limit.sync="queryParams.size" @pagination="getList" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="绑定终端设备" :visible.sync="deviceOpen" v-if="deviceOpen" width="1200px">
      <bind-device :nodeId="id" :selectType="'multiple'" ref="device" @handleSubmit="handleSubmitDevice"></bind-device>
      <el-form :inline="true" ref="form" :model="form">
        <div class="cell">
          <el-form-item class="ml-m" label='设备与节点的关系' :rules="$formRules.checkNecessary('请输入设备与节点的关系')">
            <el-input size='small' v-model='form.relation' placeholder='请输入设备与节点的关系'></el-input>
          </el-form-item>
          <el-form-item label='描述'>
            <el-input style="width:500px" size='small' type="textarea" :rows="3" maxlength="255" show-word-limit
                      v-model='form.comment' placeholder='请输入描述'>
            </el-input>
          </el-form-item>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDevice">确 定</el-button>
        <el-button @click="deviceOpen=false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="upgradeShow" :visible.sync="upgradeShow" @close="upgradeShow=false">
      <el-table :data="upgradeList">
        <el-table-column label="升级前版本" prop="from_version"></el-table-column>
        <el-table-column label="升级后版本" prop="to_version"></el-table-column>
        <el-table-column label="升级结果" prop="result">
          <template slot-scope="scope">{{scope.row.result === 'install_success' ? '安装成功' : '安装失败'}}</template>
        </el-table-column>
        <el-table-column label="升级时间" prop="upgrade_time">
          <template slot-scope="scope">{{parseTime(scope.row.upgrade_time) }}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getNodeInfo, updateNode, updateDevices, getNodeDeviceList } from '@/api/app/edge/node'
import { getEdgeDeviceList } from '@/api/app/edge/device'
import { orderBy } from 'lodash'
export default {
  components: {
    BindDevice: () => import('@/components/EdgeCamera'),
  },
  data() {
    return {
      id: null,
      info: {
        name: null,
      },
      dict: {
        state: [],
      },
      queryParams: {
        size: 10,
        current: 1,
      },
      upgradeList: [],
      upgradeLastResult: null,
      deviceList: [],
      nodeDeviceList: [],
      total: 0,
      deviceOpen: false,
      upgradeShow: false,
      loading: false,
      form: {
        comment: null,
        relation: null,
      },
    }
  },
  computed: {},
  watch: {
    $route() {
      this.id = this.$route.query.id
      this.getList()
    },
  },
  mounted() {
    this.id = this.$route.query.id
    this.getDicts('edge_node_state').then((res) => {
      this.dict.state = res.data.data
    })
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      getNodeInfo(this.id)
        .then((res) => {
          this.loading = false
          this.info = res.data.data
          this.upgradeList = orderBy(res.data.data.upgrade_history, ['upgrade_time'], ['desc'])
          this.upgradeLastResult = [...this.upgradeList].pop()
        })
        .catch((err) => {
          this.loading = false
        })
      getNodeDeviceList({ node_id: this.id }).then((res) => {
        this.nodeDeviceList = res.data.data.devices
        this.getDeviceList()
      })
    },
    getDeviceList() {
      getEdgeDeviceList({ ...this.queryParams, edgeNodeId: this.id }).then((res) => {
        this.deviceList = res.data.data.records
        this.deviceList.forEach((value, index) => {
          value['relation'] = this.nodeDeviceList[index].node.relation
        })
        this.total = res.data.data.total
      })
    },
    formatState(state) {
      return this.selectDictLabel(this.dict.state, state)
    },
    //绑定设备
    handleSubmitDevice(info) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (info && info.length > 0) {
            const device_ids = info.map((item) => item.edgeDeviceId)
            const data = {
              id: this.id,
              added: {
                comment: this.form.comment,
                relation: this.form.relation,
                device_ids,
              },
            }
            updateDevices(data).then((res) => {
              this.deviceOpen = false
              if (res.data.data) {
                this.msgSuccess('绑定成功')
              }
            })
          } else {
            return this.msgError('绑定设备不能为空')
          }
        }
      })
    },
    submitDevice() {
      this.$refs['device'].handleSubmit()
    },
  },
}
</script>
<style lang='scss' scoped>
.info-id {
  width: 100%;
  font-size: 14px;
  color: #ccc;
}
.cell {
  display: flex;
  justify-content: space-between;
  .el-form-item {
    width: 50%;
  }
}
</style>