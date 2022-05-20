<!-- 人员管理-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='姓名' prop='name'>
              <el-input size='small' v-model.trim='form.name' placeholder='请输入姓名'></el-input>
            </el-form-item>
            <el-form-item label='身份证号' prop='idcardNo'>
              <el-input size='small' v-model='form.idcardNo' placeholder='请输入身份证号'></el-input>
            </el-form-item>
            <el-form-item label='员工编号' prop='staffId'>
              <el-input size='small' v-model='form.staffId' placeholder='请输入员工编号'></el-input>
            </el-form-item>
            <!-- <el-form-item label="空间状态" prop="status">
              <el-switch class="mt-s" size="small" v-model="form.status" :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="空间目录描述" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入空间目录描述" show-word-limit maxlength="200" type="textarea"
                        :rows="5">
              </el-input>
            </el-form-item> -->
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
import { addStaffInfo, putStaffInfo, getStaffInfo } from '@/api/app/baseinfo/staff.js'
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
        province: null,
        city: null,
        county: null,
        subdistrict: null,
        name: null,
        protocolType: null,
        officeName: null,
        idcardNo: null,
        remark: null,
      },
      options: null,
      id: null,
      areaList: [],
      subdistrictList: [],
      rules: {
        name: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入姓名')],
        idcardNo: [this.$formRules.checkNecessary('请输入身份证号'), this.$formRules.checkLen(50)],
        staffId: [this.$formRules.checkLen(50)],
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
        getStaffInfo(this.id).then((res) => {
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
            putStaffInfo(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addStaffInfo(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('新增成功')
              }
            })
          }
        }
      })
    },
    handleSelProvince() {
      this.form.city = null
      this.form.county = null
      this.form.subdistrict = null
    },
    handleSelCity() {
      this.form.county = null
      this.form.subdistrict = null
    },
    handleSelCounty(pid) {
      this.form.subdistrict = null
      getAreaListByPid({ pid }).then((res) => {
        this.subdistrictList = res.data.data
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