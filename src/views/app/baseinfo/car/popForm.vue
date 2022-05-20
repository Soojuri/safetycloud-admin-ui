<!-- 车辆管理-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='车辆名称' prop='carName'>
              <el-input size='small' v-model.trim='form.carName' placeholder='请输入车辆名称'></el-input>
            </el-form-item>

            <el-form-item label='车牌号' prop='carNo'>
              <el-input size='small' v-model='form.carNo' placeholder='请输入车牌号'></el-input>
            </el-form-item>
            <el-form-item label='车辆ID' prop='carId'>
              <el-input size='small' v-model='form.carId' placeholder='请输入车辆ID'></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入描述" show-word-limit maxlength="200" type="textarea"
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
import { addCarInfo, putCarInfo, getCarInfo } from '@/api/app/baseinfo/car.js'
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
        carName: null,
        carId: null,
        carNo: null,
        remark: null,
      },
      options: null,
      id: null,
      areaList: [],
      subdistrictList: [],
      rules: {
        carName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入车辆名称')],
        carNo: [this.$formRules.checkNecessary('请输入车牌号'), this.$formRules.checkLen(50)],
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
        getCarInfo(this.id).then((res) => {
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
            putCarInfo(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addCarInfo(this.form).then((res) => {
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