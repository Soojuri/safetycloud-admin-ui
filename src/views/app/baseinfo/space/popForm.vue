<!-- 空间目录-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='空间名称' prop='spaceName'>
              <el-input size='small' v-model.trim='form.spaceName' placeholder='请输入空间名称'></el-input>
            </el-form-item>
            <el-form-item label="行政地区" prop="province">
              <el-row type="flex" justify="space-around" gutter="5">
                <el-col>
                  <el-select v-model="form.province" placeholder="请选择省份" @change="handleSelProvince">
                    <el-option v-for="item in areaList.filter(item => item.pid == -1)" :key="item.id" :label="item.name"
                               :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col>
                  <el-select v-model="form.city" placeholder="请选择城市" @change="handleSelCity">
                    <el-option v-for="item in areaList.filter(item => item.pid == form.province)" :key="item.id"
                               :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col>
                  <el-select v-model="form.county" placeholder="请选择区县" @change="handleSelCounty">
                    <el-option v-for="item in areaList.filter(item => item.pid == form.city)" :key="item.id"
                               :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label='所属街道' prop='subdistrict'>
              <el-select v-model="form.subdistrict" placeholder="请选择街道">
                <el-option v-for="item in subdistrictList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='详细地址' prop='address'>
              <el-input size='small' v-model='form.address' placeholder='请输入详细地址'></el-input>
            </el-form-item>
            <el-form-item label="空间状态" prop="status">
              <el-switch class="mt-s" size="small" v-model="form.status" :active-value="1" :inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="空间目录描述" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入空间目录描述" show-word-limit maxlength="200" type="textarea"
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
import { getAreaListByPid, addSpace, putSpace, getSpaceInfo } from '@/api/app/camera/space'
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
        spaceName: null,
        officeName: null,
        address: null,
        remark: null,
      },
      options: null,
      id: null,
      areaList: [],
      subdistrictList: [],
      rules: {
        spaceName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入空间名称')],
        province: [this.$formRules.checkNecessary('请选择行政地区')],
        subdistrict: [this.$formRules.checkNecessary('请选择所属街道')],
        address: [this.$formRules.checkNecessary('请输入详细地址'), this.$formRules.checkLen(50)],
        status: [this.$formRules.checkNecessary('请选择空间状态')],
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
    getAreaListByPid({ pid: '' }).then((res) => {
      this.areaList = res.data.data
    })
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.id) {
        getSpaceInfo(this.id).then((res) => {
          this.form = res.data.data
          if (this.form.county) {
            getAreaListByPid({ pid: this.form.county }).then((res) => {
              this.subdistrictList = res.data.data
            })
          }
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
            putSpace(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addSpace(this.form).then((res) => {
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