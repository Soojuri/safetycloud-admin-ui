<!-- 边缘节点表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='边缘节点名称' prop='name'>
              <el-input size='small' v-model='form.name' placeholder='请输入边缘节点名称'></el-input>
            </el-form-item>
            <el-form-item label='AI加速卡'>
              <el-radio-group v-model="aiType" @change="aiTypeChange">
                <el-radio-button label="none">不启用</el-radio-button>
                <el-radio-button label="npu">昇腾AI加速卡</el-radio-button>
                <el-radio-button label="gpu">Nvidia GPU</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="aiType === 'npu'">
              <el-radio-group v-model="form.npu_type">
                <el-radio-button label="D310">昇腾310</el-radio-button>
                <el-radio-button label="D910">昇腾910</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input type="textarea" :rows="5" maxlength="255" show-word-limit v-model="form.description"
                        placeholder="请输入备注"></el-input>
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
import { registerNode } from '@/api/app/edge/node'
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
        name: null,
      },
      id: null,
      rules: {
        name: [
          this.$formRules.checkLen(64),
          { validator: this.$formRules.validatorNameCn, trigger: 'blur' },
          this.$formRules.checkNecessary('请输入空间名称'),
        ],
        description: [
          {
            validator: this.$formRules.validatorDesc,
            trigger: 'blur',
          },
        ],
      },
      aiType: 'none',
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
        // (this.id).then((res) => {
        //   this.form = res.data.data
        //   if (this.form.county) {
        //     getAreaListByPid({ pid: this.form.county }).then((res) => {
        //       this.subdistrictList = res.data.data
        //     })
        //   }
        // })
      }
    },
    aiTypeChange(val) {
      if (val === 'npu') {
        this.form.enable_npu = true
        this.form.enable_gpu = false
      } else if (val === 'gpu') {
        this.form.enable_gpu = true
        this.form.enable_npu = false
      } else {
        this.form.enable_npu = false
        this.form.enable_gpu = false
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
            // (this.form).then((res) => {
            //   if (res.data.data) {
            //     that.handleClose()
            //     that.msgSuccess('修改成功')
            //   }
            // })
          } else {
            registerNode(this.form).then((res) => {
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