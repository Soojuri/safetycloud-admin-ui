<!-- 绑定节点 -->
<template>
  <div>
    <el-dialog :visible="visible" width="888px" title="绑定节点" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="3" :span="16">
          <el-form :rules="rules" :model='form' label-width='140px' ref='form'>
            <el-form-item label='设备'>
              <el-input size='small' v-model='name' disabled></el-input>
            </el-form-item>
            <el-form-item label='设备与节点关系' prop='relation'>
              <el-input size='small' v-model='form.relation' placeholder='请输入设备与节点关系'></el-input>
            </el-form-item>
            <el-form-item label="节点" prop="nodeId">
              <el-select v-model="form.nodeId" placeholder="请选择节点">
                <el-option v-for="item in nodeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='备注' prop='comment'>
              <el-input size='small' v-model='form.comment' placeholder='请输入备注'></el-input>
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
import { getNodeList, putNodeBind } from '@/api/app/edge/device'
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
        comment: null,
        relation: null,
        nodeId: null,
      },
      name: null,
      rules: {
        relation: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入设备与节点关系')],
        nodeId: [this.$formRules.checkNecessary('请选择节点')],
      },
      nodeList: [],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    getNodeList().then((res) => {
      this.nodeList = res.data.data.nodes
    })
    this.name = this.data.edgeDeviceName
  },
  methods: {
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    handleSave() {
      const that = this
      const edgeDeviceId = that.data.edgeDeviceId
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = {
            added: {
              comment: that.form.comment,
              node_ids: [that.form.nodeId],
              relation: that.form.relation,
            },
            removed: [],
            edgeDeviceId,
          }
          putNodeBind(data).then((res) => {
            if (res.data.code === 0) {
              that.handleClose()
              that.msgSuccess('绑定成功')
            }
          })
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