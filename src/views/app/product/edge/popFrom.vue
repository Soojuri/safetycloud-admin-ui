<!-- 数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='产品名称' prop='productName'>
              <el-input size='small' v-model.trim='form.productName' placeholder='请输入产品名称'></el-input>
            </el-form-item>
            <el-form-item label="启用状态" prop="status">
              <el-switch class="mt-s" size="small" v-model="form.status" :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label='产品描述' prop='productDescription'>
              <el-input size='small' v-model.trim='form.productDescription' placeholder='请输入一句话产品描述'></el-input>
            </el-form-item>
            <el-form-item label="产品分类" prop="productType">
              <el-input size='small' placeholder='请输入产品描述' value='边缘计算盒子' disabled='true'></el-input>
              <!-- <el-select disabled='true' v-model="form.productType" value-key='' placeholder="请选择产品分类">
                <el-option label="边缘计算盒子" :value="3" :key="3">
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="产品子类" prop="edgeCategory">
              <el-select v-model="form.edgeCategory" placeholder="请选择产品子类">
                <el-option v-for="item in dict.edgeCategory" :label="item.label" :value="parseInt(item.value)"
                           :key="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='产品价格' prop='productPrice'>
              <el-input size='small' v-model='form.productPrice' placeholder='请输入产品价格，单位元'>
              </el-input>
            </el-form-item>
            <el-form-item label="产品详细介绍" prop="productDetail">
              <el-input v-model="form.productDetail" placeholder="请输入至少五个字符" show-word-limit minlength="5"
                        maxlength="200" type="textarea" :rows="5">
              </el-input>
            </el-form-item>
            <el-form-item label="产品备注" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入至少五个字符" show-word-limit minlength="5" maxlength="200"
                        type="textarea" :rows="5">
              </el-input>
            </el-form-item>
            <el-form-item label="上传产品图标" prop="productLogoUrl">
              <ImageUpload v-model="form.productLogoUrl" />
            </el-form-item>
            <el-form-item label="上传产品封面" prop="productCoverUrl">
              <ImageUpload v-model="form.productCoverUrl" />
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
import ImageUpload from '@/components/ImageUpload'
import { getProductInfo, addProduct, putProduct } from '@/api/app/product/product.js'
export default {
  components: {
    ImageUpload,
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
        productName: null,
        productDescription: null,
        edgeCategory: null,
        productPrice: null,
        productDetail: null,
        remark: null,
        status: null,
        productLogoUrl: null,
        productCoverUrl: null,
        productType: 3,
      },
      id: null,
      rules: {
        productName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入产品名称')],
        productDescription: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入产品描述')],
        productPrice: [this.$formRules.checkNecessary('请输入产品价格')],
        edgeCategory: [this.$formRules.checkNecessary('请选择产品子类')],
        // productType: [this.$formRules.checkNecessary('请选择产品分类')],
        status: [this.$formRules.checkNecessary('请选择状态')],
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
        getProductInfo(this.id).then((res) => {
          this.form = res.data.data
        })
      }
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
            putProduct(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addProduct(this.form).then((res) => {
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