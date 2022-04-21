<!-- 设备位置弹窗 -->
<template>
  <div class='infoWinBox'>
    <div class="product_box mt-n" :body-style="{ padding: '0px' }" shadow="hover" v-loading="loading">
      <div class="box_header">
        <span class="state"><span
                :class="info.state == 1 ? 'green_status' :'red_status'"></span>{{formatStatus(info.state)}}</span>
        <img fit="cover" class="fl mr-m" :src="require('@/assets/images/gateway.png')" />
        <div class="product_info">
          <span class="box_header_title">{{info.name}}</span>
          <span class="box_header_desc">ID:{{info.id}}</span>
        </div>
      </div>
      <el-row :gutter="5">
        <el-col v-for="(item,index) in datalist" :key="index" :span="8">
          <div class="box-card">
            <span class="status_title" :title="item.name">{{item.name}}</span>
            <div class="content">
              <span class="status_text">{{item.value ? item.value : '/'}}</span>
              <span v-show="item.createTime" class=" mt-xl text_desc">上报时间：{{item.createTime}}</span>
            </div>
          </div>
        </el-col>
        <el-col v-for="(item,index) in events" :key="index" :span="8">
          <div class="box-card">
            <span class="status_title" :title="item.name"> <span :class="fontColor"></span>{{item.name}}</span>
            <div class="content">
              <span class="status_text">{{item.total}}次</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getObj, _multi, getEvents } from '@/api/device/instance'

export default {
  components: {},
  data() {
    return {
      info: {
        name: null,
        id: null,
      },
      properties: [],
      datalist: [],
      events: [],
      eventList: [],
      statusOptions: [],
      loading: false,
      request: {
        dashboard: 'device',
        object: null,
        measurement: 'properties',
        dimension: 'history',
        params: {
          deviceId: null,
          history: 1,
          properties: [],
        },
      },
    }
  },
  props: {
    deviceId: {
      type: Object,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  watch: {
    visible(val) {
      if (val) {
        this.getList()
      }
    },
  },

  mounted() {},

  methods: {
    getList() {
      this.loading = true
      this.getDicts('video_status').then((res) => {
        this.statusOptions = res.data.data
      })
      getObj(this.deviceId)
        .then((res) => {
          this.info = res.data.data
          this.getProperList()
          this.getEvent()
        })
        .catch(() => {
          this.loading = false
        })
    },
    formatStatus(state) {
      return this.selectDictLabel(this.statusOptions, state)
    },
    async getEvent() {
      const that = this
      let metadata = JSON.parse(this.info.metadata)
      that.events = []
      for (let item of metadata.events) {
        let query = {
          deviceId: that.deviceId,
          eventId: item.id,
          format: true,
          size: 1,
        }
        let result = await getEvents(query)
        let obj = {
          id: item.id,
          name: item.name,
          level: item.expands.level,
          total: result.data.data.total,
          properties: item.valueType.properties,
        }
        that.formatLevel(obj.level)
        that.events.push(obj)
      }
      this.loading = false
    },
    formatLevel(val) {
      if (val === 'normal') {
        this.fontColor = 'blue_status'
      }
      if (val === 'warn') {
        this.fontColor = 'yeallow_status'
      }
      if (val === 'urgent') {
        this.fontColor = 'red_status'
      }
    },
    // 获取属性列表
    getProperList() {
      const that = this
      let metadata = JSON.parse(this.info.metadata)
      that.properties = metadata.properties
      that.request.object = that.info.productId
      that.request.params.deviceId = that.id
      that.request.params.properties = that.properties.map((item) => item.id)
      let obj = []
      obj.push(that.request)
      let props = metadata.properties.map((item) => {
        return {
          id: item.id,
          name: item.name,
          readonly: item.expands.readOnly,
        }
      })
      _multi(obj).then((res) => {
        if (res.data.data.length > 0) {
          let datalist = res.data.data.map((item) => {
            return {
              id: item.data.value.property,
              name: item.data.value.propertyName,
              value: item.data.value.value,
              createTime: item.data.timeString,
            }
          })
          let arrs = []
          props.forEach((item) => {
            datalist.forEach((data) => {
              if (item.id == data.id) {
                let obj = {
                  id: item.id,
                  name: item.name,
                  value: data.value,
                  createTime: data.createTime,
                  readonly: item.readonly,
                }
                arrs.push(obj)
              }
            })
          })
          that.datalist = arrs
        } else {
          that.datalist = props
        }
      })
    },
  },
}
</script>
<style lang='scss' scoped>
@import '@/styles/variables.scss';
.infoWinBox {
  width: 400px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.box-card {
  border: 1px #e9e9e9 solid;
  padding: 8px;
  background: #f7f8fb;
}

.product_box {
  .box_header {
    position: relative;
    overflow: hidden;
    padding: 10px;
    img {
      height: 35px;
      position: absolute;
      top: 50%;
      margin-top: -17.5px;
    }
    .el-image {
      width: 40px;
      height: 40px;
      margin-right: 16px;
      line-height: 40px;
      font-size: 18px;
    }
    .state {
      position: absolute;
      right: 40px;
      top: 25px;
      font-size: 14px;
    }
    .product_info {
      width: 85%;
      margin-left: 40px;
    }
    .box_header_title {
      overflow: hidden;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 80%;
      display: inline-block;
      font-weight: 600;
    }
    .box_header_desc {
      width: 80%;
      height: 22px;
      color: rgba(0, 0, 0, 0.45);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;
    }
  }
  .box_container {
    padding: 5px 20px;
    p {
      padding: 0;
      margin: 0;
      line-height: 30px;
      text-align: center;
    }
    .box_container_name {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.35);
    }
    .box_container_num {
      color: #1890ff;
      font-weight: 600;
    }
    .box_container_type {
      color: rgba(0, 0, 0, 0.65);
      font-weight: 600;
      font-size: 14px;
    }
  }
  .operates {
    display: flex;
    justify-items: center;
    background: #f5f9ff;
    border-top: $--border-color-base;
    .opera-btn {
      position: relative;
      display: inline-block;
      flex: 1 1 0;
      padding: 8px 4px;
      font-size: 20px;
      text-align: center;
      color: $--color-text-secondary;
      cursor: pointer;
      &:hover {
        color: $--color-primary;
      }
      &:not(:first-child)::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -6px;
        height: 12px;
        width: 1px;
        background: #ccc;
      }
    }
  }
}
.status_title {
  height: 22px;
  color: #8b8c8f;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
  word-break: break-all;
  display: inline-block;
}
.content {
  width: 100px;
  height: 25px;
  line-height: 25px;
}
.status_text {
  height: 38px;
  margin-top: 4px;
  margin-bottom: 0;
  font-size: 12px;
  overflow: hidden;
  color: #323333;
  line-height: 38px;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
}
.text_desc {
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  margin-left: 8px;
  display: inline-block;
}
</style>