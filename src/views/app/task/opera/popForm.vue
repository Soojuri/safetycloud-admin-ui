<!--  -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='130px' ref='form'>
            <div class="g-card">
              <div class="g-tit">作业配置</div>
              <el-form-item label='作业名称' prop='taskName'>
                <el-input size='small' v-model='form.taskName' placeholder='请输入作业名称'></el-input>
              </el-form-item>
              <el-form-item label="事件等级" prop="eventLevel">
                <el-select v-model="form.eventLevel" placeholder="请选择事件等级">
                  <el-option v-for="item in dict.eventLevel" :key="item.value" :label="item.label"
                             :value="parseInt(item.value)">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label='作业描述' prop='description'>
                <el-input size='small' maxlength="500" show-word-limit :rows="3" type="textarea"
                          v-model='form.description' placeholder='请输入作业描述'></el-input>
              </el-form-item>
              <el-form-item label='任务类型' prop="taskType">
                <el-radio-group class="mt-s" v-model="form.taskType">
                  <el-radio :label="1">普通任务</el-radio>
                  <el-radio :label="2">计划任务</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="form.taskType == 2">
                <el-form-item label='时区' prop='planConfig.timezone'>
                  <el-input size='small' v-model='form.planConfig.timezone' placeholder='请输入时区'></el-input>
                </el-form-item>
                <el-form-item label='执行频率' prop='planConfig.type'>
                  <el-radio-group class="mt-s" v-model="form.planConfig.type">
                    <el-radio label="once">执行一次</el-radio>
                    <el-radio label="daily">每天</el-radio>
                    <el-radio label="weekly">每周</el-radio>
                    <el-radio label="monthly">每月</el-radio>
                  </el-radio-group>
                  <el-select class="mt-m" v-if="form.planConfig.type =='weekly'" multiple
                             v-model="form.planConfig.days_of_week" placeholder="请选择">
                    <el-option v-for="item in dict.week" :label="item.label" :value="item.value" :key="item.value">
                    </el-option>
                  </el-select>
                  <el-select class="mt-m" v-if="form.planConfig.type =='monthly'" multiple
                             v-model="form.planConfig.days_of_monthly" placeholder="请选择">
                    <el-option v-for="i in 31" :label="`${i}号`" :value="i" :key="i">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label='执行模式' prop="mode">
                  <el-radio-group class="mt-s" v-model="form.mode">
                    <el-radio :label="1">按时间段</el-radio>
                    <el-radio :label="2">按频率</el-radio>
                  </el-radio-group>
                  <!-- 按时间段 --->
                  <template v-if="form.mode==1">
                    <div class="mt-m cell" v-if="mode==1" v-for="(item,index) in form.planConfig.periods">
                      <!-- 执行一次 --->
                      <el-date-picker v-if="form.planConfig.type == 'once'" type="datetimerange"
                                      :picker-options="pickerOptions" v-model='item.dateRange'
                                      format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-ddTHH:mm:ss"
                                      :default-time="['00:00:00', '23:59:59']" range-separator='至'
                                      start-placeholder='开始时间' end-placeholder='结束时间' />
                      <!-- 其他 --->
                      <template v-else>
                        <el-time-picker is-range v-model="item.dateRange" value-format="HH:mm:ss" range-separator="至"
                                        start-placeholder="开始时间" end-placeholder="结束时间">
                        </el-time-picker>
                      </template>

                      <el-button class="ml-m" icon="el-icon-delete" type="text" @click="handleDelTimeRange(index)">
                      </el-button>

                    </div>
                    <el-button type="text" icon="el-icon-circle-plus" @click="handleAddTimeRange">新增时间段</el-button>
                    <span class="ft12">(最多支持10个时间段)</span>
                  </template>
                  <!-- 按频率 --->
                  <template v-if="form.mode==2">
                    <el-date-picker value-format="yyyy-MM-ddTHH:mm:ss" :picker-options="pickerOptions" size="small"
                                    class="mt-m" v-if="form.planConfig.type === 'once'" v-model="form.planConfig.date">
                    </el-date-picker>
                    <el-form-item class="mt-m" label='是否添加起止时间' label-width="130px">
                      <el-switch class="mt-s" v-model="isSelectTime" :active-value="true" :inactive-value="false">
                      </el-switch>
                    </el-form-item>
                    <el-time-picker value-format="HH:mm:ss" class="mb-m" v-if="isSelectTime" is-range
                                    v-model="frequencyDate" range-separator="至" start-placeholder="开始时间"
                                    end-placeholder="结束时间">
                    </el-time-picker>
                    <el-form-item class="mt-s" label='间隔时长' label-width="75px">
                      <el-input-number v-model="form.planConfig.frequency.interval"></el-input-number> 分钟
                    </el-form-item>
                    <el-form-item class="mt-s" label='执行时长' label-width="75px">
                      <el-input-number v-model="form.planConfig.frequency.duration"></el-input-number> 分钟
                    </el-form-item>
                  </template>
                </el-form-item>

              </template>
            </div>
            <div class="g-card">
              <div class="g-tit">算法配置</div>
              <el-form-item label="算法类别" prop="algorithmType">
                <el-select :disabled="!validatenull(id)" v-model="form.algorithmType" placeholder="请选择算法类别"
                           @change="selectAlgType">
                  <el-option v-for="item in dict.algorithmType" :key="item.value" :label="item.label"
                             :value="parseInt(item.value)">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="算法分类" prop="algorithmPackageId">
                <el-select :disabled="!validatenull(id)" v-model="form.algorithmPackageId" placeholder="请选择算法分类"
                           @change="selectBag">
                  <el-option v-for="item in algorithmBagList" :key="item.packageId" :label="item.packageName"
                             :value="item.packageId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label='算法模型' prop='algorithmId'>
                <el-select :disabled="!validatenull(id)" v-model="form.algorithmId" placeholder="请选择算法模型"
                           @change="handleSelectAlgo">
                  <el-option v-for="item in algorithmList" :key="item.algorithmId" :label="item.algorithmName"
                             :value="item.algorithmId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="算法订单" prop="resourceOrderId">
                <el-select :disabled="!validatenull(id)" v-model="form.resourceOrderId" placeholder="请选择算法订单">
                  <el-option v-for="item in orderList" :key="item.orderId" :label="item.orderId" :value="item.orderId">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label='边缘运行池' prop='edgPoolId'>
                <el-select :disabled="!validatenull(id)" v-model="form.edgPoolId" placeholder="请选择运行池">
                  <el-option v-for="item in poolList" :key="item.edgePoolId" :label="item.poolName"
                             :value="item.edgePoolId">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 算法模板 -->
              <el-form-item v-for="item in paramsConfig" :key="item.name" :label="item.titleCn"
                            :prop="`serviceConfig.common[${item.name}]`">
                <el-input-number :step="parseInt(item.step)" v-if="item.type === 'int'" :max="parseInt(item.max)"
                                 :min="parseInt(item.min)" v-model="form.serviceConfig.common[item.name]">
                </el-input-number>
                <div v-else-if="item.name === 'target_roi'">
                  <el-input type="textarea" :rows="3" :value="form.serviceConfig.common[item.name]" :disabled="true">
                  </el-input>
                  <el-button class="mt-s" size="mini" type="primary" @click="markEditOpen = true">标注区域
                  </el-button>
                </div>

                <el-input v-else v-model="form.serviceConfig.common[item.name]">
                </el-input>
              </el-form-item>
            </div>
            <div class="g-card">
              <div class="g-tit">输入配置</div>
              <el-form-item label="输入数据" prop="inputConfig.type">
                <el-radio-group v-model="form.inputConfig.type" @change="inputTypeChange">
                  <el-radio-button label="edgecamera">Edge Camera</el-radio-button>
                  <el-radio-button label="edgerestful">Edge Restful</el-radio-button>
                  <el-radio-button label="vcn">VCN</el-radio-button>
                </el-radio-group>
                <!-- edge camera -->
                <div class="mt-m" v-if="form.inputConfig.type === 'edgecamera'">
                  <el-button v-if=" form.inputConfig.data.length === 0" type="warning" @click="deviceOpen = true">数据源选择
                  </el-button>
                  <el-tag class="ml-s" v-if="form.inputConfig.data.length > 0" v-for="item in form.inputConfig.data"
                          :key="item.deviceId">{{item.name}}</el-tag>
                </div>

              </el-form-item>
              <!-- edge restful -->
              <div class="input-box ml-m mt-s"
                   v-if="form.inputConfig.type === 'edgerestful' && form.inputConfig.data.length > 0"
                   v-for="(item,index) in form.inputConfig.data">
                <el-button size="medium" class="del-input-config-btn" icon="el-icon-delete" type="text"
                           @click="handleDelInput(index)">
                </el-button>
                <el-form-item label='HTTPS证书校验'>
                  <el-switch class="mt-s" v-model="item.certificate_check" :active-value="true" :inactive-value="false">
                  </el-switch>
                </el-form-item>
                <el-form-item label-width="135px" label='URL' :prop="`inputConfig.data[${index}].url`"
                              :rules="[$formRules.checkNecessary('请输入URL'),{ validator: $formRules.checkUrl, trigger: 'blur' },]">
                  <el-input size='small' v-model='item.url' placeholder='请输入URL'></el-input>
                </el-form-item>
                <el-form-item label-width="135px" label='rtsp地址相对位置'
                              :rules="[$formRules.checkNecessary('请输入rtsp地址相对位置')]">
                  <el-input size='small' v-model='item.rtsp_path_in_response' placeholder='请输入rtsp地址相对位置'>
                  </el-input>
                </el-form-item>
                <el-form-item label-width="135px" class=" mt-s" label='请求头' prop='inputConfig.data.headers'>
                  <div class="cell  mt-s" v-for="(header,hIndex) in item.headers">
                    <el-input v-model="header.name" placeholder="属性名"></el-input>
                    <el-input class="ml-m" v-model="header.value" placeholder="属性值"></el-input>
                    <el-button class="ml-m" icon="el-icon-delete" type="text"
                               @click="handleDelInputHeader(index,hIndex)">
                    </el-button>
                  </div>
                  <el-button type="text" icon="el-icon-circle-plus" @click="handleAddInputHeader(index)">新增配置项
                  </el-button>
                </el-form-item>
              </div>
              <el-button class="ml-m" v-if="form.inputConfig.type === 'edgerestful'" type="text"
                         icon="el-icon-circle-plus" @click="handleAddInput()">新增配置项
              </el-button>
              <!-- vcn -->
              <template v-if="form.inputConfig.type === 'vcn' && form.inputConfig.vcn.ip !== undefined ">
                <el-form-item label='选择平台' prop='platformId'>
                  <el-select v-model="form.platformId" placeholder="请选择" @change="handleSelectPlatform">
                    <el-option v-for="platform in platformList" :key="platform.platformId"
                               :label="platform.platformName" :value="platform.platformId"></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label='IP地址' prop='inputConfig.vcn.ip'>
                  <el-input size='small' v-model='form.inputConfig.vcn.ip' placeholder='请输入IP地址 '></el-input>
                </el-form-item>
                <el-form-item label='端口号' prop='inputConfig.vcn.port'>
                  <el-input size='small' v-model='form.inputConfig.vcn.port' placeholder='请输入端口'></el-input>
                </el-form-item>
                <el-form-item label='用户名' prop='inputConfig.vcn.username'>
                  <el-input size='small' v-model='form.inputConfig.vcn.username' placeholder='请输入用户名'></el-input>
                </el-form-item>
                <el-form-item label='密码' prop='inputConfig.vcn.password'>
                  <el-input size='small' v-model='form.inputConfig.vcn.password' placeholder='请输入密码'></el-input>
                </el-form-item> -->
                <div class="input-box ml-m mt-s" v-if=" form.inputConfig.data.length > 0"
                     v-for="(item,index) in form.inputConfig.data">
                  <!-- <el-button size="medium" class="del-input-config-btn" icon="el-icon-delete" type="text"
                             @click="handleDelInput(index)"> -->
                  </el-button>
                  <el-form-item label-width="105px" label='摄像头ID' :rules="[$formRules.checkNecessary('请输入摄像头ID')]">
                    <el-input size='small' v-model='item.device_id' placeholder='请输入摄像头ID'></el-input>
                  </el-form-item>
                  <el-form-item label-width="105px" label='码流类型'>
                    <el-select v-model="item.stream_type" placeholder="请选择">
                      <el-option label="主码流" :value="1"></el-option>
                      <el-option label="辅码流1" :value="2"></el-option>
                      <el-option label="辅码流2" :value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <!-- <el-button class="ml-m" v-if="form.inputConfig.type === 'vcn'" type="text" icon="el-icon-circle-plus"
                           @click="handleAddInput()">新增配置项
                </el-button> -->
              </template>
            </div>
            <div class="g-card">
              <div class="g-tit">输出配置</div>
              <el-form-item label='输出URL' prop='outputConfig.webhook.url'>
                <el-input size='small' v-model='form.outputConfig.webhook.url' placeholder='请输入URL'></el-input>
              </el-form-item>
              <el-form-item class=" mt-s" label='输出Headers' prop='outputConfig.webhook.headers'>
                <div class="cell  mt-s" v-for="(item,index) in form.outputConfig.webhook.headers">
                  <el-input v-model="item.name" placeholder="属性名"></el-input>
                  <el-input class="ml-m" v-model="item.value" placeholder="属性值"></el-input>
                  <el-button class="ml-m" icon="el-icon-delete" type="text" @click="handleDelHeader(index)"></el-button>
                </div>
                <el-button type="text" icon="el-icon-circle-plus" @click="handleAddHeder">新增配置项</el-button>
              </el-form-item>
            </div>

          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择终端设备" :visible.sync="deviceOpen" v-if="deviceOpen" width="1200px">
      <bind-device ref="device" @handleSubmit="handleSubmitDevice"></bind-device>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDevice">确 定</el-button>
        <el-button @click="deviceOpen=false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="绘制区域" :visible.sync="markEditOpen" v-if="markEditOpen" width="800px">
      <mark-edit ref="mark" @handleSubmit="handleSubmitMarks" :pointData="pointData" :pictureUrl="pictureUrl">
      </mark-edit>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMark">确 定</el-button>
        <el-button @click="markEditOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getManageList, getOrderList } from '@/api/app/algorithm/manage.js'
import { getAlgorithmList } from '@/api/app/algorithm/bag'
import { validatenull } from '@/util/validate'
import { getTaskInfo, addTask, putTask } from '@/api/app/task/opera'
import { getPoolList } from '@/api/app/edge/pool'
import { deepClone } from '@/util/util'
import { getEdgeDeviceList } from '@/api/app/edge/device'
import { getVideoPlatformList } from '@/api/app/rules/platform'
import { cloneDeep } from 'lodash'
import { getVideoDeviceInfo } from '@/api/app/camera/videoDevice'
export default {
  components: {
    BindDevice: () => import('@/components/EdgeCamera'),
    MarkEdit: () => import('@/components/MarkEdit'),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    dict: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      form: {
        mode: 1,
        algorithmId: null,
        algorithmPackageId: null,
        algorithmType: null,
        resourceOrderId: null,
        algorithmCode: null,
        edgPoolId: null,
        eventLevel: null,
        taskType: 1,
        platformId: null,
        // 计划配置
        planConfig: {
          timezone: null, // 时区
          type: 'once', //执行频率
          days_of_week: null,
          days_of_monthly: null,
          periods: [
            {
              begin_at: null,
              end_at: null,
              dateRange: ['09:00:00', '18:00:00'],
            },
          ], // 时间段
          frequency: {
            begin_at: null,
            end_at: null,
            duration: null,
            interval: null,
          },
        },
        inputConfig: {
          type: 'edgecamera',
          data: [],
          vcn: {
            ip: null,
            port: null,
            username: null,
            password: null,
          },
        },
        outputConfig: {
          webhook: {
            headers: [
              {
                name: null,
                value: null,
              },
            ],
            url: null,
          },
        },
        serviceConfig: {
          common: {},
        },
        configLabel: null,
      },
      frequencyDate: ['09:00:00', '18:00:00'],
      dataRangeList: [],
      id: null,
      mode: '1',
      isSelectTime: false,
      rules: {
        taskName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入作业名称')],
        eventLevel: [this.$formRules.checkNecessary('请选择事件等级')],
        taskType: [this.$formRules.checkNecessary('请选择任务类型')],
        algorithmType: [this.$formRules.checkNecessary('请选择算法类别')],
        algorithmPackageId: [this.$formRules.checkNecessary('请选择算法分类')],
        resourceOrderId: [this.$formRules.checkNecessary('请选择订单号')],
        algorithmId: [this.$formRules.checkNecessary('请选择算法模型')],
        'inputConfig.type': [this.$formRules.checkNecessary('请选择输入数据')],
        'outputConfig.webhook.url': [
          this.$formRules.checkNecessary('请输入URL'),
          { validator: this.$formRules.checkUrl, trigger: 'blur' },
        ],
        'outputConfig.webhook.headers': [this.$formRules.checkNecessary('请输入请求头')],
        'planConfig.timezone': [this.$formRules.checkNecessary('请输入时区')],
        'planConfig.type': [this.$formRules.checkNecessary('请选择执行频率')],
        platformId: [this.$formRules.checkNecessary('请选择平台')],
        // 'inputConfig.vcn.ip': [
        //   this.$formRules.checkNecessary('请输入IP地址'),
        //   { validator: this.$formRules.checkIP, trigger: 'blur' },
        // ],
        // 'inputConfig.vcn.port': [
        //   this.$formRules.checkNecessary('请输入端口号'),
        //   { validator: this.$formRules.checkPort, trigger: 'blur' },
        // ],
        // 'inputConfig.vcn.username': [this.$formRules.checkNecessary('请输入用户名'), this.$formRules.checkLen(50)],
        // 'inputConfig.vcn.password': [this.$formRules.checkNecessary('请输入密码'), this.$formRules.checkLen(255)],
        mode: [this.$formRules.checkNecessary('请选择执行模式')],
        edgPoolId: [this.$formRules.checkNecessary('请选择边缘运行池')],
      },
      algorithmBagList: [], //算法分类
      orderList: [], //订单列表
      algorithmList: [],
      deviceOpen: false,
      paramsConfig: [],
      poolList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime()
        },
      },
      deviceList: [],
      markEditOpen: false,
      pointData: [], // 点位集合
      platformList: [], // 平台列表
      pictureUrl: null, // 摄像头图片
    }
  },
  computed: {
    title() {
      return this.id ? '编辑' : '新增'
    },
  },
  watch: {},
  created() {
    this.id = this.data ? this.data.id : null
  },
  mounted() {
    getPoolList({ current: 1, size: 10000 }).then((res) => {
      this.poolList = res.data.data.records
    })
    getEdgeDeviceList({ current: 1, size: 10000 }).then((res) => {
      this.deviceList = res.data.data.records
      this.getList()
    })
    getVideoPlatformList({ current: 1, size: 10000, status: null, platformName: null }).then((res) => {
      this.platformList = res.data.data.records
    })
  },
  methods: {
    getList() {
      const that = this
      if (this.id) {
        getTaskInfo(this.id).then((res) => {
          this.form = cloneDeep(res.data.data)
          if (this.form.inputConfig.data[0].device_id) {
            getVideoDeviceInfo(this.form.inputConfig.data[0].device_id).then((res) => {
              that.pictureUrl = res.data.data.pictureUrl ? that.IMAGE_PATH + res.data.data.pictureUrl : null
            })
          }
          if (this.form.planConfig.frequency === null) {
            this.form.mode = 1
            this.form.planConfig.periods = this.form.planConfig.periods.map((item) => {
              return {
                begin_at: item.begin_at,
                end_at: item.end_at,
                dateRange: [item.begin_at, item.end_at],
              }
            })
          } else {
            this.form.mode = 2
          }
          if (this.form.inputConfig.type === 'edgecamera') {
            this.form.inputConfig.data = this.form.inputConfig.data.map((item) => {
              const info = that.deviceList.find((device) => item.id === device.edgeDeviceId)
              return {
                name: info.edgeDeviceName,
                id: item.id,
                index: item.index,
              }
            })
          }
          if (this.form.inputConfig.type === 'edgerestful') {
            this.form.inputConfig.data = this.form.inputConfig.data.map((item) => {
              const arr = []
              Object.keys(item.headers).forEach((key) => {
                arr.push({
                  name: key,
                  value: headers[key],
                })
              })
              return {
                certificate_check: item.certificate_check,
                url: item.url,
                rtsp_path_in_response: item.rtsp_path_in_response,
                headers: [...arr],
              }
            })
          }
          if (!res.data.data.inputConfig.vcn) {
            this.$set(this.form.inputConfig, vcn, {
              ip: null,
              port: null,
              username: null,
              password: null,
            })
          }
          const headers = this.form.outputConfig.webhook.headers
          let headersList = []
          Object.keys(headers).forEach((key) => {
            headersList.push({
              name: key,
              value: headers[key],
            })
          })
          this.form.outputConfig.webhook.headers = headersList
          if (validatenull(this.form.serviceConfig)) {
            this.form.serviceConfig = { common: {} }
          }
          this.selectAlgType(this.form.algorithmType, false)
          this.selectBag(this.form.algorithmPackageId, false)
          // this.handleSelectAlgo(this.form.algorithmId, false)
        })
      }
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    formatForm() {
      let form = deepClone(this.form)
      let headers = {}
      if (this.form.mode == 1) {
        form.planConfig.frequency = null
      } else {
        form.planConfig.periods = null
      }
      this.form.outputConfig.webhook.headers.forEach((item) => {
        headers[item.name] = item.value
      })
      form.outputConfig.webhook.headers = headers

      if (!validatenull(form.planConfig.periods)) {
        let periods = this.form.planConfig.periods.map((item) => {
          const begin_at = item.dateRange[0]
          const end_at = item.dateRange[1]
          return {
            begin_at,
            end_at,
          }
        })
        form.planConfig.periods = periods
      }
      if (!validatenull(form.planConfig.frequency)) {
        form.planConfig.frequency.begin_at = this.frequencyDate[0]
        form.planConfig.frequency.end_at = this.frequencyDate[1]
      }
      if (form.inputConfig.type === 'edgecamera') {
        form.inputConfig.data = this.form.inputConfig.data.map((item) => {
          return {
            index: item.index,
            id: item.id,
          }
        })
      }
      if (form.inputConfig.type === 'edgerestful') {
        form.inputConfig.data = this.form.inputConfig.data.map((item) => {
          let headers = {}
          item.headers.map((header) => {
            headers[header.name] = header.value
          })
          return {
            certificate_check: item.certificate_check,
            url: item.url,
            rtsp_path_in_response: item.rtsp_path_in_response,
            headers: headers,
          }
        })
      }
      delete form.mode
      // delete form.algorithmPackageId
      // delete form.algorithmType

      return form
    },
    handleSave() {
      const that = this
      const form = this.formatForm()
      if (form.inputConfig.type === 'edgecamera' && form.inputConfig.data.length === 0) {
        return this.msgError('数据源不能为空')
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          let configLabel = []
          Object.keys(this.form.serviceConfig.common).forEach((key) => {
            const info = this.paramsConfig.find((item) => item.name === key)
            const obj = {
              key,
              value: this.form.serviceConfig.common[key],
              label: info && info.titleCn,
            }
            configLabel.push(obj)
          })
          form.configLabel = JSON.stringify(configLabel)
          if (that.id) {
            putTask(form).then((res) => {
              if (res.data.code === 0) {
                that.handleClose()
                that.msgSuccess('修改成功')
              } else {
                const err = JSON.parse(res.data.data).error_msg
                that.msgError(err)
              }
            })
          } else {
            addTask(form).then((res) => {
              if (res.data.code === 0) {
                that.handleClose()
                that.msgSuccess('新增成功')
              } else {
                const err = JSON.parse(res.data.data).error_msg
                that.msgError(err)
              }
            })
          }
        }
      })
    },
    selectAlgType(val, isEmpty = true) {
      if (isEmpty) {
        this.form.algorithmPackageId = null
        this.form.resourceOrderId = null
        this.form.algorithmId = null
      }

      getAlgorithmList({ size: 10000, current: 1, algorithmType: val }).then((res) => {
        this.algorithmBagList = res.data.data.records
      })
    },
    selectBag(val, isEmpty = true) {
      if (isEmpty) {
        this.form.resourceOrderId = null
        this.form.algorithmId = null
      }
      // getOrderList({ size: 10000, current: 1, packageId: val }).then((res) => {
      //   this.orderList = res.data.data.records
      // })
      getManageList({ size: 10000, current: 1, algorithmPackageId: val }).then((res) => {
        this.algorithmList = res.data.data.records
        if (!isEmpty) {
          this.handleSelectAlgo(this.form.algorithmId, false)
        }
      })
    },
    handleDelTimeRange(index) {
      this.form.planConfig.periods.splice(index, 1)
    },
    handleDelHeader(index) {
      this.form.outputConfig.webhook.headers.splice(index, 1)
    },
    handleDelInputHeader(index, hIndex) {
      this.form.inputConfig.data[index].headers.splice(hIndex, 1)
    },
    handleDelInput(index) {
      this.form.inputConfig.data.splice(index, 1)
    },
    handleAddTimeRange() {
      const len = this.form.planConfig.periods.length
      if (len === 10) return this.msgWarn('最多只能添加10条数据')
      this.form.planConfig.periods.push({
        begin_at: null,
        end_at: null,
        dateRange: ['09:00:00', '18:00:00'],
      })
    },
    // 新增输出请求头
    handleAddHeder() {
      this.form.outputConfig.webhook.headers.push({
        name: null,
        value: null,
      })
    },
    // 新增输入请求头
    handleAddInputHeader(index) {
      this.form.inputConfig.data[index].headers.push({
        name: null,
        value: null,
      })
    },
    // 新增输入配置
    handleAddInput() {
      if (this.form.inputConfig.type === 'edgerestful') {
        this.form.inputConfig.data.push({
          certificate_check: null,
          url: null,
          rtsp_path_in_response: null,
          headers: [
            {
              name: null,
              value: null,
            },
          ],
        })
      }
      if (this.form.inputConfig.type === 'vcn') {
        this.form.inputConfig.data.push({
          device_id: null,
          stream_type: null,
        })
      }
    },
    //绑定设备
    handleSubmitDevice(info) {
      if (info) {
        this.deviceOpen = false
        this.form.inputConfig.data = [
          {
            index: 0,
            id: info.edgeDeviceId,
            name: info.edgeDeviceName,
          },
        ]
      }
    },
    handleSubmitMarks(arr, type) {
      let data = null
      if (type === 'line') {
        data = {
          line: {
            data: arr,
          },
        }
      } else {
        data = {
          polygons: {
            data: arr,
          },
        }
      }
      this.pointData = data
      this.form.serviceConfig.common['target_roi'] = JSON.stringify(data)
      this.markEditOpen = false
    },
    submitDevice() {
      this.$refs['device'].handleSubmit()
    },
    submitMark() {
      this.$refs['mark'].handleSubmit()
    },
    handleSelectAlgo(val, isEmpty = true) {
      this.orderList = []
      getOrderList({ size: 10000, current: 1, algorithmId: val }).then((res) => {
        this.orderList = res.data.data.records
      })
      const algoInfo = this.algorithmList.find((item) => item.algorithmId === val)
      if (isEmpty) {
        this.form.resourceOrderId = null
        this.form.serviceVersion = algoInfo.algorithmVersion
        this.form.algorithmCode = algoInfo.algorithmCode
        this.paramsConfig = JSON.parse(algoInfo.commonConfig)
        this.paramsConfig.forEach((item) => {
          if (!validatenull(item.default)) {
            this.form.serviceConfig.common[item.name] = item.type === 'int' ? parseInt(item.default) : item.default
          } else {
            this.form.serviceConfig.common[item.name] = null
          }
        })
      } else {
        const configLabel = JSON.parse(this.form.configLabel)
        this.paramsConfig = JSON.parse(algoInfo.commonConfig)
        this.paramsConfig.forEach((item) => {
          const info = configLabel.find((config) => config.key === item.name)
          if (info) {
            this.form.serviceConfig.common[item.name] = info.value
          } else {
            if (!validatenull(item.default)) {
              this.form.serviceConfig.common[item.name] = item.type === 'int' ? parseInt(item.default) : item.default
            } else {
              this.form.serviceConfig.common[item.name] = null
            }
          }
        })
      }
      const target_roi =
        this.form.serviceConfig && this.form.serviceConfig.common && this.form.serviceConfig.common.target_roi
      this.pointData = JSON.parse(target_roi)
    },
    handleSelectPlatform(platformId) {
      const info = this.platformList.find((item) => item.platformId === platformId)
      this.form.inputConfig.vcn.ip = info.host.split(':')[0]
      this.form.inputConfig.vcn.port = info.host.split(':')[1]
      this.form.inputConfig.vcn.username = info.appKey
      this.form.inputConfig.vcn.password = info.appSecret
    },
    inputTypeChange(val) {
      this.form.inputConfig.data = []
      if (val === 'edgerestful') {
        this.form.inputConfig.data.push({
          certificate_check: false,
          url: null,
          rtsp_path_in_response: null,
          headers: [
            {
              name: null,
              value: null,
            },
          ],
        })
      } else if (val === 'vcn') {
        this.form.inputConfig.data.push({
          device_id: null,
          stream_type: null,
        })
      }
    },
  },
}
</script>
<style lang='scss' scoped>
::v-deep .dialog-footer {
  text-align: center;
}
.ft12 {
  font-size: 12px;
}
.cell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.g-tit {
  font-size: 16px !important;
}
.input-box {
  border: 1px dashed #ccc;
  padding: 20px 20px 10px 10px;
  position: relative;
  ::v-deep .el-input {
    width: 95%;
  }
}
.del-input-config-btn {
  position: absolute;
  right: 10px;
  top: 5px;
}
</style>