<!--  -->
<template>
  <div>
    <el-dialog :visible="visible" width="1000px" :title="title" append-to-body :close-on-click-modal='false'
               @close="handleClose">
      <el-row>
        <el-col :offset="2" :span="18">
          <el-form :rules="rules" :model='form' label-width='120px' ref='form'>
            <el-form-item label='设备名称' prop='name'>
              <el-input :disabled="id" size='small' v-model.trim='form.name' placeholder='请输入设备名称'></el-input>
            </el-form-item>
            <el-form-item label='关联设备' prop='refDeviceId'>
              <el-select :disabled="id" v-model="form.refDeviceId" placeholder="请选择关联设备">
                <el-option v-for="device in refDeviceList" :key="device.deviceId" :label="device.deviceName"
                           :value="device.deviceId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备属性">
              <table>
                <thead>
                  <tr>
                    <th>属性名</th>
                    <th>类型</th>
                    <th>属性值</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in form.attributes">
                    <td>
                      <el-input size="mini" v-model="item.key" maxlength="100" show-word-limit></el-input>
                    </td>
                    <td>
                      <el-select size="mini" v-model="item.type" placeholder="请选择">
                        <el-option label="string" value="string"></el-option>
                        <el-option label="int" value="int"></el-option>
                        <el-option label="float" value="float"></el-option>
                        <el-option label="boolean" value="boolean"></el-option>
                      </el-select>
                    </td>
                    <td>
                      <el-input size="mini" v-model="item.value" maxlength="100" show-word-limit></el-input>
                    </td>
                    <td>
                      <el-button @click="handleAttrDel(index)" icon="el-icon-delete" type="text">删除</el-button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <el-button type="text" icon="el-icon-circle-plus-outline" @click="handleAttrAdd">新增属性</el-button>
            </el-form-item>
            <el-form-item label="标签">
              <div v-for="(tag,index) in form.tags">
                <el-autocomplete style="width:200px" class="inline-input" v-model="tag.key" show-word-limit
                                 maxlength="100" :fetch-suggestions="querySearch" placeholder="标签名"
                                 @select="handleTagSelect">
                </el-autocomplete>
                <el-autocomplete style="width:200px" :disabled="tag.key === null || tag.key === ''" class="inline-input"
                                 show-word-limit maxlength="100" v-model="tag.value" :fetch-suggestions="queryTagValue"
                                 placeholder="标签值">
                </el-autocomplete>

                <el-button type="text" class="ml-m" @click="handleTagDel(index)">删除</el-button>
              </div>
              <el-button type="text" icon="el-icon-circle-plus-outline" @click="handleTagAdd">新增标签</el-button>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="form.description" placeholder="请输入描述" type="textarea" :rows="3" show-word-limit
                        maxlength="200"></el-input>
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
import { getVideoDeviceList } from '@/api/app/camera/videoDevice'
import {
  addEdgeDevice,
  addEdgeTag,
  getTagList,
  getEdgeDeviceInfo,
  getTagByDeviceId,
  putEdgeDevice,
} from '@/api/app/edge/device'
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
        refDeviceId: null,
        tags: [],
        attributes: [],
        description: null,
      },

      id: null,
      refDeviceList: [],
      rules: {
        name: [this.$formRules.checkLen(), this.$formRules.checkNecessary('请输入设备名称')],
        refDeviceId: [this.$formRules.checkNecessary('请选择关联设备')],
      },
      tagList: [],
      tagValue: [],
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
    getVideoDeviceList({ size: 10000, current: 1 }).then((res) => {
      this.refDeviceList = res.data.data.records
    })
  },
  mounted() {
    this.getList()
    getTagList().then((res) => {
      this.tagList = res.data.data.tags
    })
  },
  methods: {
    getList() {
      if (this.id) {
        getEdgeDeviceInfo(this.id).then((res) => {
          const { edgeDeviceName, description, refDeviceId, config, edgeDeviceId } = res.data.data
          this.form.name = edgeDeviceName
          this.form.refDeviceId = refDeviceId
          this.form.description = description
          getTagByDeviceId(edgeDeviceId).then((res) => {
            this.form.tags = res.data.data.tags
          })
          const configJson = JSON.parse(config)
          Object.keys(configJson.attributes).forEach((key) => {
            this.form.attributes.push({
              key,
              type: configJson.attributes[key].metadata.type,
              value: configJson.attributes[key].value,
            })
          })
        })
      }
    },
    queryTagValue(queryString, cb) {
      let values = this.tagValue || []
      var results = queryString ? values.filter(this.createFilter(queryString)) : values
      cb(results)
    },
    querySearch(queryString, cb) {
      let tagList = this.tagList.map((item) => {
        return {
          value: item.key,
          values: item.values,
        }
      })
      var results = queryString ? tagList.filter(this.createFilter(queryString)) : tagList
      cb(results)
    },
    createFilter(queryString) {
      return (tag) => {
        console.log(tag)
        return tag.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    handleTagSelect(val) {
      this.tagValue = val.values.map((item) => {
        return {
          value: item,
        }
      })
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
            const data = this.formatEditForm()
            data.id = that.id
            putEdgeDevice(data).then((res) => {
              const tagData = {
                action: 'create',
                tags: that.form.tags,
                edgeDeviceId: that.id,
              }
              addEdgeTag(tagData).then((res) => {
                that.handleClose()
                that.msgSuccess('新增成功')
              })
            })
          } else {
            const data = this.formatForm()
            addEdgeDevice(data).then((res) => {
              if (res.data.data) {
                const edgeDeviceId = res.data.data
                let data = {
                  action: 'create',
                  tags: that.form.tags,
                  edgeDeviceId,
                }
                addEdgeTag(data).then((res) => {
                  that.handleClose()
                  that.msgSuccess('新增成功')
                })
              }
            })
          }
        }
      })
    },
    formatEditForm() {
      let device = {
        description: this.form.description,
        attributes: {},
      }
      this.form.attributes.forEach((item) => {
        device.attributes[item.key] = {
          value: item.value,
          optional: true,
          metadata: {
            type: item.type,
          },
        }
      })
      const data = {
        device,
      }
      return data
    },
    formatForm() {
      let edgeDevice = {
        access_protocol: 'userdefine',
        name: this.form.name,
        connection_type: 'edge',
        description: this.form.description,
        attributes: {},
        access_config: {
          protocol_name: {
            value: 'userdefine',
            optional: true,
            metadata: {
              type: 'string',
            },
          },
        },
      }
      this.form.attributes.forEach((item) => {
        edgeDevice.attributes[item.key] = {
          value: item.value,
          optional: true,
          metadata: {
            type: item.type,
          },
        }
      })
      const data = {
        edgeDevice,
        refDeviceId: this.form.refDeviceId,
      }
      return data
    },
    handleAttrAdd() {
      this.form.attributes.push({
        key: null,
        type: 'string',
        value: null,
      })
    },
    handleTagAdd() {
      this.form.tags.push({
        key: null,
        value: null,
      })
    },
    handleAttrDel(index) {
      this.form.attributes.splice(index, 1)
    },
    handleTagDel(index) {
      this.form.tags.splice(index, 1)
    },
  },
}
</script>
<style lang='scss' scoped>
::v-deep .dialog-footer {
  text-align: center;
}
table > thead > tr > th:not(:last-child) {
  border-right: 1px solid #fff;
}
table {
  width: 100%;
  thead {
    tr {
      th {
        box-sizing: border-box;
        position: refative;
        cursor: default;
        background-color: #f2f5fc;
        outline: 0;
        height: 28px;
        line-height: 28px;
        color: #575d6c;
        font-weight: 600;
        border-left: none;
        border-bottom: 1px solid #dfe1e6;
        text-align: left;
        vertical-align: middle;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        padding: 5px;
      }
    }
  }
  tbody {
    td {
      padding: 5px;
    }
  }
}
</style>