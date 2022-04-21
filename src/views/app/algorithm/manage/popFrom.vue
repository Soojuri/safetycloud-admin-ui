<!-- 算法管理-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='130px' ref='form'>
            <el-form-item label='算法名称' prop='algorithmName'>
              <el-input size='small' v-model.trim='form.algorithmName' placeholder='请输入算法名称'></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="enable">
              <el-switch class="mt-s" size="small" v-model="form.enable" :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label='算法版本号' prop='algorithmVersion'>
              <el-input size='small' v-model.trim='form.algorithmVersion' placeholder='请输入算法版本'></el-input>
            </el-form-item>
            <el-form-item label='算法服务的标识' prop='algorithmCode'>
              <el-input size='small' v-model.trim='form.algorithmCode' placeholder='请输入算法服务的标识'></el-input>
            </el-form-item>
            <!-- <el-form-item label='算法类别' prop='algorithmType'>
              <el-select v-model="form.algorithmType" placeholder="请选择">
                <el-option v-for="item in dict.algorithmType" :key="item.value" :label="item.label"
                           :value="parseInt(item.value)">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label='算法分类' prop='algorithmPackageId'>
              <el-select v-model="form.algorithmPackageId" placeholder="请选择">
                <el-option v-for="(item, index) in list" :key="item.packageId" :label="item.packageName"
                           :value="item.packageId">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label='算法订单' prop='orderId'>
              <el-select v-model="form.orderId" placeholder="请选择">
                <el-option v-for="(item, index) in orderList" :key="item.orderId" :label="item.orderId"
                           :value="item.orderId">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label='算法来源' prop='algorithmSource'>
              <el-select v-model="form.algorithmSource" placeholder="请选择">
                <el-option v-for="item in dict.algorithmSource" :key="item.value" :label="item.label"
                           :value="parseInt(item.value)">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='算法能力集' prop='algorithmCapabilitySet'>
              <el-input size='small' v-model.trim='form.algorithmCapabilitySet' placeholder='请输入算法能力集'></el-input>
            </el-form-item>
            <el-form-item label='算法能力值' prop='algorithmCapabilityValue'>
              <el-input-number size='small' v-model.trim='form.algorithmCapabilityValue' :min="0" :max="100">
              </el-input-number>
            </el-form-item>
            <el-form-item label='算法输出定义' prop='algorithmObjData'>
              <el-button type="primary" @click="isShowEdit=true">在线文本编辑</el-button>
            </el-form-item>
            <el-form-item label='算法库地址' prop='algorithmLibUrl'>
              <el-input size='small' v-model='form.algorithmLibUrl' placeholder='请输入算法库地址'></el-input>
            </el-form-item>
            <el-form-item label="算法图标" prop="logoUrl">
              <ImageUpload v-model="form.logoUrl" />
            </el-form-item>
            <el-form-item label="算法背景图" prop="backgroundUrl">
              <ImageUpload v-model="form.backgroundUrl" />
            </el-form-item>
            <el-form-item label="算法简介" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入算法简介" show-word-limit minlength="5" maxlength="200"
                        type="textarea" :rows="5">
              </el-input>
            </el-form-item>
            <el-form-item label='算法介绍详情' prop='description'>
              <editor :value="form.description" :height="200" v-model="form.description"></editor>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>

    </el-dialog>
    <el-dialog title="算法输出定义" width="500px" :visible="isShowEdit" append-to-body @close="isShowEdit=false">
      <vue-json-editor :mode="'code'" lang="zh" v-model="commonConfig" :show-btns="true" :expandedOnStart="true"
                       @json-save="handleSaveConfig">
      </vue-json-editor>
      </editor>
    </el-dialog>
  </div>
</template>

<script>
import { getAlgorithmList, getOrderList } from '@/api/app/algorithm/bag.js'
import ImageUpload from '@/components/ImageUpload'
import Editor from '@/components/Editor'
import { getManageInfo, addManage, putManage } from '@/api/app/algorithm/manage.js'
import vueJsonEditor from 'vue-json-editor'
export default {
  components: { ImageUpload, vueJsonEditor, Editor },
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
      isShowEdit: false,
      commonConfig: null,
      form: {
        algorithmCapabilitySet: null, //算法能力集
        algorithmName: null, //算法名称
        algorithmCapabilityValue: null, //算法能力值
        algorithmVersion: null, //算法版本
        // algorithmType: null, //算法类别
        algorithmSource: null, //算法来源
        algorithmLibUrl: null, //算法库地址
        algorithmObjData: null, //算法输出定义json数据
        algorithmPackageId: null, //算法分类id
        enable: null, //状态
        remark: null, //备注
        algorithmCode: null, //算法服务的标识
        description: null, // 算法介绍详情
        logoUrl: null,
        backgroundUrl: null,
        orderId: null,
      },
      queryParams: {
        size: 10000,
        current: 1,
      },
      list: [],
      // orderList: [],
      id: null,
      rules: {
        algorithmName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入算法名称')],
        algorithmCapabilityValue: [this.$formRules.checkNecessary('请输入算法能力值')],
        algorithmVersion: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入算法版本')],
        algorithmCode: [this.$formRules.checkLen(255), this.$formRules.checkNecessary('请输入算法服务的标识')],
        // algorithmType: [this.$formRules.checkNecessary('请选择算法类别')],
        enable: [this.$formRules.checkNecessary('请选择状态')],
        algorithmPackageId: [this.$formRules.checkNecessary('请选择算法分类')],
        algorithmCapabilitySet: [this.$formRules.checkNecessary('请选择算法能力集')],
        algorithmSource: [this.$formRules.checkNecessary('请选择算法来源')],
        logoUrl: [this.$formRules.checkNecessary('请上传算法图标')],
        backgroundUrl: [this.$formRules.checkNecessary('请上传算法背景图片')],
        remark: [this.$formRules.checkNecessary('请输入算法简介')],
        description: [this.$formRules.checkNecessary('请输入算法介绍详情')],
        algorithmLibUrl: [this.$formRules.checkNecessary('请输入算法库地址'), this.$formRules.checkLen(50)],
        orderId: [this.$formRules.checkNecessary('请选择算法订单')],
      },
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
    this.getList()
  },
  methods: {
    getList() {
      getAlgorithmList(this.queryParams).then((res) => {
        this.list = res.data.data.records
      })
      // getOrderList(this.queryParams).then((res) => {
      //   this.orderList = res.data.data.records
      // })
      if (this.id) {
        getManageInfo(this.id).then((res) => {
          this.form = res.data.data
          this.commonConfig = this.form.commonConfig ? JSON.parse(this.form.commonConfig) : []
        })
      }
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleSaveConfig() {
      this.form.commonConfig = JSON.stringify(this.commonConfig)
      this.isShowEdit = false
    },
    handleSave() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (that.id) {
            putManage(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addManage(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('新增成功')
              }
            })
          }
        }
      })
    },
  },
}
</script>
<style lang='scss' scoped>
::v-deep .dialog-footer {
  text-align: center;
}
::v-deep .jsoneditor-vue {
  height: 500px !important;
}
</style>