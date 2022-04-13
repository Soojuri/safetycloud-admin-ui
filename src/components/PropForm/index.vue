<template>
  <el-drawer :before-close="handleClose" :wrapperClosable="false" :append-to-body="true"
             :title="type==='add' ? '新增参数' : '修改参数'" :size="400" :visible="visible" direction="rtl">
    <el-form :model="form" :rules="rules" label-position="top" ref="form" label-width="80px" style="padding:0 10px">
      <el-form-item label='属性标识' prop='id'>
        <el-input size='small' v-model='form.id' placeholder='请输入属性标识'></el-input>
      </el-form-item>
      <el-form-item label='属性名称' prop='name'>
        <el-input size='small' v-model='form.name' placeholder='请输入属性名称'></el-input>
      </el-form-item>
      <el-form-item label='数据类型' prop='valueType.type'>
        <el-select v-model="form.valueType.type" placeholder="请选择数据类型" @change="handleChangeType">
          <el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='元素类型' prop='elementType' v-if="hideOptions.elementType">
        <el-select v-model="form.valueType.elementType.type" placeholder="请选择元素类型" @change="handleChangeType">
          <el-option v-for="item in dataTypeOptions.filter(item=>item.value != 'array')" :key="item.value"
                     :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='单位' prop='unit' v-if="hideOptions.unit">
        <el-select v-model="form.valueType.unit" placeholder="请选择单位">
          <el-option-group v-for="group in units" :key="group.label" :label="group.label">
            <el-option v-for="item in group.groups" :key="item.value" :label="item.text" :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label='枚举项' prop='elements' v-if="hideOptions.elements">
        <div v-if="form.valueType.elements.length>0">
          <div v-for="(item,index) in form.valueType.elements">
            <el-row>
              <el-col :span="9">
                <el-input v-model="form.valueType.elements[index].value" placeholder="标识"></el-input>
              </el-col>
              <el-col :span="9" :offset="1">
                <el-input v-model="form.valueType.elements[index].text" placeholder="描述"></el-input>
              </el-col>
              <el-col :span="4" :offset="1">
                <el-button size="mini" type="danger" circle icon="el-icon-delete" @click="handleEmunDelete(index)">
                </el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <el-button @click="handleEmunAdd" type="text" icon="el-icon-plus">添加枚举</el-button>
      </el-form-item>
      <el-form-item label='精度' prop='scale' v-if="hideOptions.scale">
        <el-input-number size='small' v-model='form.valueType.scale'></el-input-number>
      </el-form-item>
      <el-form-item label='时间格式' prop='format' v-if="hideOptions.format">
        <el-select v-model="form.valueType.format" placeholder="请选择时间格式">
          <el-option v-for="item in dateTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='最大长度' prop='maxLength' v-if="hideOptions.maxLength">
        <el-input-number size='small' v-model='form.valueType.maxLength'></el-input-number>
      </el-form-item>
      <el-form-item label='布尔值' prop='bool' v-if="hideOptions.bool">
        <div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input v-model="form.valueType.trueText" placeholder="trueText"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="form.valueType.trueValue" placeholder="trueValue"></el-input>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input v-model="form.valueType.falseText" placeholder="falseText"></el-input>
            </el-col>
            <el-col :span="12">
              <el-input v-model="form.valueType.falseValue" placeholder="falseValue"></el-input>
            </el-col>
          </el-row>
        </div>
      </el-form-item>

      <el-form-item label='JSON对象' prop='properties' v-if="hideOptions.properties">
        <div class="properBox" v-if="form.valueType.properties.length>0">
          <div v-for="(item,index) in form.valueType.properties" class="proper">
            <span class="mr-m ml-m">参数名称：{{item.name}}</span>
            <div class="fr mr-m">
              <el-button size="mini" type="info" circle icon="el-icon-edit" @click="handlePropEdit(item,index)">
              </el-button>
              <el-button size="mini" type="danger" circle icon="el-icon-delete" @click="handlePropDelete(index)">
              </el-button>
            </div>
          </div>
        </div>
        <el-button @click="handlePropAdd" type="text" icon="el-icon-plus">添加参数</el-button>
      </el-form-item>
      <el-form-item label='说明' prop='describe'>
        <el-input size='small' v-model='form.describe' type="textarea" :rows="5" placeholder='请输入说明'></el-input>
      </el-form-item>
      <el-form-item>
        <div class="fr">
          <el-button type="primary" size="medium" @click="submitForm()">提交</el-button>
          <el-button size="medium" @click="handleClose()">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
    <prop-form v-if="propFormOptions.visible" :visible.sync="propFormOptions.visible" :type="propFormOptions.type"
               :info="propFormOptions.info" @getFormInfo="getFormInfo"></prop-form>
  </el-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import updateDevice from '@/mixins/updateModel'
import { cloneDeep } from 'lodash'
export default {
  name: 'prop-form',
  components: {},
  mixins: [updateDevice],
  data() {
    return {
      form: {
        id: undefined,
        name: undefined,
        describe: undefined,
        valueType: {
          type: undefined,
          maxLength: undefined,
          elementType: {
            type: undefined,
          },
          scale: undefined,
          unit: undefined,
          trueText: undefined,
          trueValue: undefined,
          falseText: undefined,
          falseValue: undefined,
          format: undefined,
          elements: [],
          properties: [],
        },
      }, //表单
      propFormOptions: {
        visible: false,
        type: '',
        info: {},
      },
      dataTypeOptions: [], //数据类型字典
      attrSourceOptions: [], //属性来源字典
      dateTypeOptions: [], //时间格式字典
      hideOptions: {
        unit: false,
        elements: false,
        scale: false,
        format: false,
        maxLength: false,
        bool: false,
        elementType: false,
        properties: false,
      },
      rules: {
        id: [this.$formRules.checkNecessary('属性标识不能为空'), this.$formRules.checkLen(50)],
        name: [this.$formRules.checkNecessary('属性名称不能为空'), this.$formRules.checkLen(50)],
        'valueType.type': [this.$formRules.checkNecessary('数据类型不能为空')],
      }, //表单规则
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'add',
    },
    info: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  //监听属性
  computed: {
    ...mapGetters(['units']),
  },
  mounted() {
    this.getDict()
    if (this.info.data) {
      this.getList()
    }
  },
  methods: {
    //获取字典
    getDict() {
      this.getDicts('data_type').then((res) => {
        this.dataTypeOptions = res.data.data
      })
      this.getDicts('attr_source').then((res) => {
        this.attrSourceOptions = res.data.data
      })
      this.getDicts('date_type').then((res) => {
        this.dateTypeOptions = res.data.data
      })
    },
    //获取页面列表数据
    getList() {
      this.form = this.info.data
      this.handleChangeType(this.form.valueType.type)
      if (this.form.valueType.type === 'array') {
        const properties = this.form.valueType.elementType.properties
        const elements = this.form.valueType.elementType.elements
        this.form.valueType.properties = properties || []
        this.form.valueType.elements = elements || []
        this.handleChangeType(this.form.valueType.elementType.type)
      }
    },
    // 表单提交
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const index = this.info.index
          let valueType = cloneDeep(this.form.valueType)
          if (this.hideOptions.elementType) {
            Object.keys(valueType).forEach((item) => {
              if (item !== 'elementType' && item !== 'type') {
                valueType.elementType[item] = valueType[item]
                valueType[item] = null
              }
            })
            valueType.properties = []
            valueType.elements = []
          }
          this.form.valueType = cloneDeep(valueType)
          this.$emit('getFormInfo', this.form, index)
          this.handleClose()
        }
      })
    },
    // 数据类型选择
    handleChangeType(val) {
      if (val === 'float' || val === 'double') {
        this.setDisplay(['scale', 'unit'])
      } else if (val === 'text') {
        this.setDisplay(['maxLength'])
      } else if (val === 'bool') {
        this.setDisplay(['bool'])
      } else if (val === 'date') {
        this.setDisplay(['format'])
      } else if (val === 'enum') {
        this.setDisplay(['elements'])
      } else if (val === 'object') {
        this.setDisplay(['properties'])
      } else if (val === 'array') {
        this.setDisplay(['elementType'])
      } else {
        this.setDisplay(['unit'])
      }
    },
    // 设置显示的key
    setDisplay(showlist = []) {
      if (!this.form.valueType.elementType) {
        this.form.valueType.elementType = {
          type: null,
        }
      }
      if (this.hideOptions.elementType && showlist.indexOf('elementType') === -1) {
        showlist.push('elementType')
      }
      Object.keys(this.hideOptions).forEach((item) => {
        if (showlist.indexOf(item) != -1) {
          this.hideOptions[item] = true
        } else {
          this.hideOptions[item] = false
        }
      })
    },
    handlePropAdd() {
      this.propFormOptions = {
        visible: true,
        type: 'add',
        info: {},
      }
    },
    handleEmunAdd() {
      this.form.valueType.elements.push({
        value: '',
        text: '',
      })
    },
    handleEmunDelete(index) {
      this.form.valueType.elements.splice(index, 1)
    },
    handlePropDelete(index) {
      this.form.valueType.properties.splice(index, 1)
    },
    handlePropEdit(item, index) {
      this.propFormOptions = {
        visible: true,
        type: 'edit',
        info: {
          data: item,
          index,
        },
      }
    },
    getFormInfo(info, index) {
      if (index !== undefined) {
        this.$set(this.form.valueType.properties, index, cloneDeep(info))
      } else {
        const length = this.form.valueType.properties.length
        this.$set(this.form.valueType.properties, length, cloneDeep(info))
      }
    },
    handleClose() {
      this.resetForm('form')
      this.$emit('update:visible', false)
    },
  },
}
</script>
<style lang='scss' scoped>
.properBox {
  border: 1px gainsboro solid;
  border-bottom: none;
}
.proper {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px gainsboro solid;
  span {
    width: 70%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    word-break: break-all;
  }
}
</style>