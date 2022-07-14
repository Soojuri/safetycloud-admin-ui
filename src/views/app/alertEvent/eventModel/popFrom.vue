<!-- 算法模型管理-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='算法模型名称' prop='algorithmName'>
              <el-input size='small' v-model.trim='form.algorithmName' placeholder='请输入算法模型名称'></el-input>
            </el-form-item>
            <el-form-item label="启用状态" prop="enable">
              <el-switch class="mt-s" size="small" v-model="form.enable" :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label='模型描述' prop='shortDescription'>
              <el-input size='small' v-model.trim='form.shortDescription' placeholder='请输入一句话模型描述'></el-input>
            </el-form-item>
            <el-form-item label="模型分类" prop="algorithmType">
              <el-select v-model="form.algorithmType" placeholder="请选择模型分类">
                <el-option label="视频算法模型" :value="1" />
                <el-option label="传感器算法模型" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label='设备产品' prop='deviceProductId'>
              <el-select v-model="form.deviceProductId" placeholder="请选择设备产品">
                <el-option v-for="item in deviceProductList" :key="item.deviceProductId" :label="item.productName"
                           :value="item.deviceProductId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='模型详细介绍' prop='algorithmDetail'>
              <editor :value="form.algorithmDetail" :height="200" v-model="form.algorithmDetail"></editor>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入至少五个字符" show-word-limit minlength="5" maxlength="200"
                        type="textarea" :rows="5">
              </el-input>
            </el-form-item>
            <el-form-item label="上传模型图标" prop="logoUrl">
              <ImageUpload v-model="form.logoUrl" />
            </el-form-item>
            <el-form-item label="上传模型封面" prop="backgroundUrl">
              <ImageUpload v-model="form.backgroundUrl" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProductList } from '@/api/app/baseinfo/product.js'
import Editor from '@/components/Editor'
import ImageUpload from '@/components/ImageUpload'
import { getAlgorithmInfo, addAlgorithm, putAlgorithm } from '@/api/app/alertEvent/alertEvent.js'
export default {
  components: {
    ImageUpload,
    Editor,
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
        algorithmName: null,
        algorithmType: null,
        enable: null,
        shortDescription: null,
        algorithmDetail: null,
        logoUrl: null,
        backgroundUrl: null,
        deviceProductId: null,
        remark: null,
      },
      id: null,
      deviceProductList: [],
      rules: {
        algorithmName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入算法模型名称')],
        enable: [this.$formRules.checkNecessary('请选择状态')],
        deviceProductId: [this.$formRules.checkNecessary('请选择设备产品')],
        shortDescription: [this.$formRules.checkNecessary('请请输入一句话产品描述'),this.$formRules.checkLen(100)],
        algorithmDetail: [this.$formRules.checkNecessary('请输入产品详细介绍')],
        algorithmType: [this.$formRules.checkNecessary('请选择模型分类')],
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
      if (this.id) {
        getAlgorithmInfo(this.id).then((res) => {
          this.form = res.data.data
        })
      }
      getProductList({ size: 1000, current: 1 }).then((res) => {
        this.deviceProductList = res.data.data.records
      })
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleSave() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (that.id) {
            putAlgorithm(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addAlgorithm(this.form).then((res) => {
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
</style>
