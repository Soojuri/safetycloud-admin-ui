<!-- 录制模板-数据表单 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='180px' ref='form'>
            <el-form-item label='录制模板名称' prop='templateName'>
              <el-input size='small' v-model.trim='form.templateName' placeholder='请输入录制模板名称'></el-input>
            </el-form-item>
            <el-form-item label='录制周期时长' prop='recordPeriod'>
              <el-input-number size='small' v-model='form.recordPeriod' :min="15" :max="360" placeholder='请输入'>
              </el-input-number>
              <div class="record1">单位分钟，录制周期支持15-360分钟，视频时长超过设定的录制周期后，将生成新文件</div>
            </el-form-item>
            <el-form-item label='存储位置' prop='saveDirectory'>
              <el-input id="path" size='small' v-model.trim='form.saveDirectory' placeholder='请输入存储位置'></el-input>
              <div class="record1">录制周期请输入或选择OSS存储路径</div>
            </el-form-item>
            <el-form-item label='录制方式' prop='recordType'>
              <el-radio-group class="mt-s" v-model="form.recordType">
                <el-radio :label="1">实时录制</el-radio>
                <el-radio :label="2">按需录制</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label='存储格式' prop="saveType">
              <el-checkbox-group class="mt-s" v-model="form.saveType" @change="handleSaveTypeChange">
                <el-checkbox label="MP4">
                </el-checkbox>
                <el-checkbox label="FLV">
                </el-checkbox>
                <el-checkbox label="M3U8">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label='MP4存储规则' prop='saveMp4Rule' v-if="form.enableMp4Format == 1">
              <el-input size='small' v-model='form.saveMp4Rule' placeholder='请输入MP4存储规则'>
              </el-input>
            </el-form-item>
            <el-form-item label='FLV存储规则' prop='saveFlvRule' v-if="form.enableFlvFormat == 1 ">
              <el-input size='small' v-model='form.saveFlvRule' placeholder='请输入FLV存储规则'>
              </el-input>
            </el-form-item>
            <el-form-item label='M3U8存储规则' prop='saveM3u8Rule' v-if="form.enableM3u8Format == 1">
              <el-input size='small' v-model='form.saveM3u8Rule' placeholder='请输入M3U8存储规则'></el-input>
            </el-form-item>
            <el-form-item label='MP4录制文件命名规则' prop='fileMp4Rule' v-if="form.enableMp4Format == 1">
              <el-input size='small' v-model='form.fileMp4Rule' placeholder='请输入MP4录制文件命名规则'>
              </el-input>
            </el-form-item>
            <el-form-item label='FLV录制文件命名规则' prop='fileFlvRule' v-if="form.enableFlvFormat == 1">
              <el-input size='small' v-model='form.fileFlvRule' placeholder='请输入FLV录制文件命名规则'>
              </el-input>
            </el-form-item>
            <el-form-item label='M3U8录制文件命名规则' prop='fileM3u8Rule' v-if="form.enableM3u8Format == 1">
              <el-input size='small' v-model='form.fileM3u8Rule' placeholder='请输入M3U8录制文件命名规则'>
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
import { addRecord, putRecord, getRecordInfo } from '@/api/app/template/template.js'
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
        recordPeriod: null,
        saveDirectory: null,
        recordType: null,
        enableMp4Format: null,
        enableFlvFormat: null,
        enableM3u8Format: null,
        saveMp4Rule: null,
        saveFlvRule: null,
        saveM3u8Rule: null,
        fileMp4Rule: null,
        fileFlvRule: null,
        fileM3u8Rule: null,
        saveType: [],
      },
      id: null,
      arr: [],
      rules: {
        templateName: [this.$formRules.checkLen(30), this.$formRules.checkNecessary('请输入录制模板名称')],
        recordPeriod: [this.$formRules.checkNecessary('请输入录制周期时长')],
        saveDirectory: [this.$formRules.checkLen(255), this.$formRules.checkNecessary('请输入或选择存储位置')],
        recordType: [this.$formRules.checkNecessary('请选择录制方式')],
        saveType: [this.$formRules.checkNecessary('请选择存储格式')],
        saveMp4Rule: [this.$formRules.checkLen(255), this.$formRules.checkNecessary('请输入存储规则')],
        saveM3u8Rule: [this.$formRules.checkLen(255), this.$formRules.checkNecessary('请输入存储规则')],
        saveFlvRule: [this.$formRules.checkLen(255), this.$formRules.checkNecessary('请输入存储规则')],
        fileMp4Rule: [this.$formRules.checkLen(255)],
        fileFlvRule: [this.$formRules.checkLen(255)],
        fileM3u8Rule: [this.$formRules.checkLen(255)],
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
        getRecordInfo(this.id).then((res) => {
          this.form = res.data.data
          this.form.saveType = []
          if ((res.data.data.enableMp4Format = 1)) {
            this.form.saveType.push('MP4')
          } else if ((res.data.data.enableFlvFormat = 1)) {
            this.form.saveType.push('FLV')
          } else if ((res.data.data.enableM3u8Format = 1)) {
            this.form.saveType.push('M3U8')
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
      if (val.indexOf('MP4') != -1) {
        this.form.enableMp4Format = 1
      } else {
        this.form.enableMp4Format = 0
      }
      if (val.indexOf('FLV') != -1) {
        this.form.enableFlvFormat = 1
      } else {
        this.form.enableFlvFormat = 0
      }
      if (val.indexOf('M3U8') != -1) {
        this.form.enableM3u8Format = 1
      } else {
        this.form.enableM3u8Format = 0
      }
    },
    handleSave() {
      const that = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (that.id) {
            putRecord(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addRecord(this.form).then((res) => {
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
.rule {
  margin: 5px 0;
}
</style>