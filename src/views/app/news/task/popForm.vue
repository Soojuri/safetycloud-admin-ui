<template>
  <div>
    <el-dialog :visible="visible" width="888px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='任务类型' prop='taskType'>
              <el-select v-model="form.taskType" placeholder="请选择">
                <el-option label="工单任务" :value="1" />
                <el-option label="事件任务" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label='任务状态' prop='status'>
              <el-select v-model="form.status" placeholder="请选择">
                <el-option label="任务创建" :value="0" />
                <el-option label="任务执行" :value="1" />
                <el-option label="任务驳回" :value="2" />
                <el-option label="任务完成" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="taskContent">
              <el-input v-model="form.taskContent" placeholder="请输入内容" maxlength="200" show-word-limit type="textarea"
                        :rows="15">
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
import { addTask, putTask, getTask } from '@/api/app/news/news.js'
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
        taskType: null,
        taskContent: null,
        status: null,
      },
      id: null,
      show: null,
      rules: {
        taskType: [this.$formRules.checkNecessary('请选择任务类型')],
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
        getTask(this.id).then((res) => {
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
            putTask(this.form).then((res) => {
              if (res.data.data) {
                that.handleClose()
                that.msgSuccess('修改成功')
              }
            })
          } else {
            addTask(this.form).then((res) => {
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