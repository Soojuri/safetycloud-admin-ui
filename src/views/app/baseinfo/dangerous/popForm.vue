<!-- 空间目录-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='140px' ref='form'>
            <el-form-item label='危险品名称' prop='goodsName'>
              <el-input size='small' v-model.trim='form.goodsName' placeholder='请输入危险品名称'></el-input>
            </el-form-item>

            <el-form-item label='危险品编号' prop='goodsNo'>
              <el-input size='small' v-model='form.goodsNo' placeholder='请输入危险品编号'></el-input>
            </el-form-item>
            <el-form-item label='企业ID' prop='enterpriseId'>
              <el-input size='small' v-model='form.enterpriseId' placeholder='请输入企业ID'></el-input>
            </el-form-item>
            <el-form-item label='存放地址' prop='depositAddress'>
              <el-input size='small' v-model='form.depositAddress' placeholder='请输入存放地址'></el-input>
            </el-form-item>
            <el-form-item label='单位' prop='unit'>
              <el-input size='small' v-model='form.unit' placeholder='请输入单位'></el-input>
            </el-form-item>
            <el-form-item label="是否为危险化学品" prop="isDangerousChemicals">
              <el-switch class="mt-s" size="small" v-model="form.isDangerousChemicals" :active-value="1"
                         :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="说明" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入说明" show-word-limit maxlength="200" type="textarea"
                        :rows="5">
              </el-input>
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
import { addDangerous, putDangerous, getDangerous } from '@/api/app/baseinfo/dangerous.js'
export default {
  components: {},
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
        goodsName: null,
        goodsNo: null,
        depositAddress: null,
        deptId: null,
        unit: null,
        remark: null,
      },
      options: null,
      id: null,
      areaList: [],
      subdistrictList: [],
      rules: {
        goodsName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入危险品名称')],
        goodsNo: [this.$formRules.checkNecessary('请输入危险品编号')],
        depositAddress: [this.$formRules.checkNecessary('请输入存放地址'), this.$formRules.checkLen(50)],
        status: [this.$formRules.checkNecessary('请选择是否危险化学品')],
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
        getDangerous(this.id).then((res) => {
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
            putDangerous(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addDangerous(this.form).then((res) => {
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