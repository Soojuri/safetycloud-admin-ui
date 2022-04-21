<!-- 算法分类管理-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='算法分类名称' prop='packageName'>
              <el-input size='small' v-model.trim='form.packageName' placeholder='请输入算法分类名称'></el-input>
            </el-form-item>

            <el-form-item label='算法类别' prop='algorithmType'>
              <el-select v-model="form.algorithmType" placeholder="请选择">
                <el-option v-for="item in dict.algorithmType" :key="item.value" :label="item.label"
                           :value="parseInt(item.value)">
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label='过期日期' prop='expirationTime'>
              <el-date-picker v-model="form.expirationTime" type="date" placeholder="选择日期" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-switch class="mt-s" size="small" v-model="form.status" :active-value="1" :inactive-value="2">
              </el-switch>
            </el-form-item> -->
            <el-form-item label="算法分类描述" prop="remark">
              <el-input v-model="form.remark" placeholder="请输入至少五个字符" show-word-limit minlength="5" maxlength="200"
                        type="textarea" :rows="5">
              </el-input>
            </el-form-item>
            <el-form-item label="上传封面图片" prop="backgroundUrl">
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
import ImageUpload from '@/components/ImageUpload'
import { getAlgorithmInfo, addAlgorithm, putAlgorithm } from '@/api/app/algorithm/bag.js'
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
        packageName: null,
        algorithmType: null,
        // expirationTime: null,
        remark: null,
        backgroundUrl: null,
      },
      id: null,
      rules: {
        packageName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入算法名称')],
        // status: [this.$formRules.checkNecessary('请选择状态')],
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