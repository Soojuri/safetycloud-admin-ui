<!-- 区域弹窗 -->
<template>
  <div>
    <el-dialog top="40px" :visible="visible" width="888px" :title="type=='edit' ? '编辑' : '新增'" append-to-body
               :close-on-click-modal='false' @close="handleClose">
      <el-form :model='form' :rules="rules" label-width='120px' ref='form' :disabled="type == 'info'">
        <el-col :span="12">
          <el-form-item label='区域标识' prop='areaMark'>
            <el-input :disabled="type=='edit'" size='small' v-model='form.areaMark' placeholder='请输入区域标识'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label='区域名称' prop='areaName'>
            <el-input size='small' v-model='form.areaName' placeholder='请输入区域名称'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label='区域类型' prop='areaType'>
            <el-input size='small' v-model='form.areaType' placeholder='请输入区域类型'></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label='上级区域' prop='parentId'>
            <avue-input-tree :filter='false' default-expand-all :props="defaultProps" v-model="form.parentId"
                             placeholder="请选择内容" type="tree" :dic="dic">
            </avue-input-tree>
          </el-form-item>
        </el-col>

      </el-form>
      <component :is="currentComp" v-if="form.geoJson && type=='edit'" :path="form.geoJson" @setPath="getPath">
      </component>
      <component :is="currentComp" v-if="type=='add'" @setPath="getPath">
      </component>
      <div slot='footer' class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleComfire">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addArea, putArea, getAreaInfo, getAreaTree } from '@/api/device/area'
import { isVas } from '@/config/env'
export default {
  components: {
    AmapMap: () => import('@/components/AreaAmap/index.vue'),
    GisMap: () => import('@/components/AreaGis/index.vue'),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {
        parentId: -1,
      },
      id: null,
      dic: [],
      rules: {
        areaMark: [
          {
            required: true,
            message: '请输入区域标识',
          },
          this.$formRules.checkLen(32),
        ],
        areaName: [
          {
            required: true,
            message: '请输入区域名称',
          },
          this.$formRules.checkLen(),
        ],
        areaType: [
          {
            required: true,
            message: '请输入区域类型',
          },
          this.$formRules.checkLen(),
        ],
      },
      defaultProps: {
        label: 'name',
        value: 'id',
      },
      currentComp: isVas ? 'GisMap' : 'AmapMap',
    }
  },
  computed: {},
  watch: {},
  mounted() {
    if (this.data.id) {
      this.getList()
    }
    getAreaTree({ lazy: false }).then((res) => {
      this.dic = res.data.data
    })
    this.id = this.data.id
  },

  methods: {
    getList() {
      getAreaInfo(this.data.id).then((res) => {
        this.form = res.data.data
        this.form.geoJson = res.data.data.geoJson
      })
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
      this.$emit('ok')
    },
    getPath(path) {
      this.form.geoJson = path
    },
    handleComfire() {
      if (!this.form.geoJson) {
        return this.msgError('区域不能为空')
      }
      this.form.geoJson = JSON.stringify(this.form.geoJson)
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.type === 'add') {
            addArea(this.form).then((res) => {
              if (res.data.data) {
                this.handleClose()
                this.msgSuccess('新增成功')
              }
            })
          } else {
            putArea(this.form).then((res) => {
              if (res.data.data) {
                this.handleClose()
                this.msgSuccess('修改成功')
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