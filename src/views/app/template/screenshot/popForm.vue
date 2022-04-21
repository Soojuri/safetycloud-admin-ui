<!-- 截图模板-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='140px' ref='form'>
            <el-form-item label='截图模板名称' prop='templateName'>
              <el-input size='small' v-model.trim='form.templateName' placeholder='请输入截图模板名称'></el-input>
            </el-form-item>
            <el-form-item label='截图频率' prop='captureFrequency'>
              <el-input-number size='small' v-model='form.captureFrequency' :min="5" :max="180" placeholder='请输入'>
              </el-input-number>
              <div class="record1">支持5-180秒，如果使用按需截图，此参数被忽略。</div>
            </el-form-item>
            <el-form-item label='存储位置' prop='saveDirectory'>
              <el-input id="path" size='small' v-model.trim='form.saveDirectory' placeholder='请输入存储位置'></el-input>
              <div class="record1">录制周期请输入或选择OSS存储路径</div>
            </el-form-item>
            <!-- 
            <el-form-item label='存储方式' :rules="[$formRules.checkNecessary('请选择存储方式')]">
              <el-checkbox class="mt-s" label="覆盖式截图" :true-label="1" :false-label="0"
                           v-model="form.enableOverlapCapture">
              </el-checkbox>
              <el-checkbox class="mt-s" label="实时截图" :true-label="1" :false-label="0"
                           v-model="form.enableRealtimeCapture">
              </el-checkbox>
              <el-checkbox class="mt-s" label="按需截图" :true-label="1" :false-label="0"
                           v-model="form.enableOndemandCapture">
              </el-checkbox>
            </el-form-item> -->

            <el-form-item label='存储方式' prop="saveType">
              <el-checkbox-group class="mt-s" v-model="form.saveType" @change="handleSaveTypeChange">
                <el-checkbox label="覆盖式截图">
                </el-checkbox>
                <el-checkbox label="实时截图">
                </el-checkbox>
                <el-checkbox label="按需截图">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label='覆盖式截图' prop="overlapCaptureUrl" v-if="form.enableOverlapCapture == 1">
              <el-input size='small' v-if="form.enableOverlapCapture == 1" v-model='form.overlapCaptureUrl'
                        placeholder='请输入'>
              </el-input>
            </el-form-item>
            <el-form-item label='实时截图' prop="realtimeCaptureUrl" v-if="form.enableRealtimeCapture == 1">
              <el-input size='small' v-if="form.enableRealtimeCapture == 1" v-model='form.realtimeCaptureUrl'
                        placeholder='请输入'>
              </el-input>
            </el-form-item>
            <el-form-item label='按需截图' prop="ondemandCaptureUrl" v-if="form.enableOndemandCapture == 1">
              <el-input size='small' v-if="form.enableOndemandCapture == 1" v-model='form.ondemandCaptureUrl'
                        placeholder='请输入'></el-input>
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
import { addTemplate, putTemplate, getTemplateInfo } from '@/api/app/template/template.js'
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
  },
  data() {
    return {
      form: {
        templateName: null,
        captureFrequency: null,
        saveDirectory: null,
        enableOverlapCapture: null,
        enableRealtimeCapture: null,
        enableOndemandCapture: null,
        overlapCaptureUrl: null,
        realtimeCaptureUrl: null,
        ondemandCaptureUrl: null,
        saveType: [],
      },
      id: null,
      rules: {
        templateName: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入录制模板名称')],
        captureFrequency: [this.$formRules.checkNecessary('请输入截图频率')],
        saveDirectory: [this.$formRules.checkLen(50), this.$formRules.checkNecessary('请输入或选择存储位置')],
        saveType: [this.$formRules.checkNecessary('请选择存储方式')],
        overlapCaptureUrl: [this.$formRules.checkLen(250)],
        realtimeCaptureUrl: [this.$formRules.checkLen(250)],
        ondemandCaptureUrl: [this.$formRules.checkLen(250)],
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
        getTemplateInfo(this.id).then((res) => {
          this.form = res.data.data
          this.form.saveType = []
          if ((res.data.data.enableOverlapCapture = 1)) {
            this.form.saveType.push('覆盖式截图')
          } else if ((res.data.data.enableRealtimeCapture = 1)) {
            this.form.saveType.push('实时截图')
          } else if ((res.data.data.enableOndemandCapture = 1)) {
            this.form.saveType.push('按需截图')
          }
        })
      }
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleSaveTypeChange(val) {
      if (val.indexOf('覆盖式截图') != -1) {
        this.form.enableOverlapCapture = 1
      } else {
        this.form.enableOverlapCapture = 0
      }
      if (val.indexOf('实时截图') != -1) {
        this.form.enableRealtimeCapture = 1
      } else {
        this.form.enableRealtimeCapture = 0
      }
      if (val.indexOf('按需截图') != -1) {
        this.form.enableOndemandCapture = 1
      } else {
        this.form.enableOndemandCapture = 0
      }
    },
    handleSave() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (that.id) {
            putTemplate(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addTemplate(this.form).then((res) => {
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
.record1 {
  color: #c2c2c2;
  display: inline-block;
}
.area {
  margin: 10px 10px 0 0;
}
</style>