<!--  -->
<template>
  <div class="drop-detail">
    <div class="cover">
      <img class="icon" v-if="cameraInfo.pictureUrl" :src="IMAGE_PATH + cameraInfo.pictureUrl" />
      <img class="icon" v-else :src=" require('@/assets/images/camera-manage/cover-default.jpg')" />
    </div>
    <div class="info">
      <!-- 字段看低保真 -->
      <dl>
        <dt>设备名称</dt>
        <dd>{{cameraInfo.deviceName}}</dd>
      </dl>
      <dl>
        <dt>设备编号</dt>
        <dd>{{cameraInfo.deviceNo}}</dd>
      </dl>
      <dl>
        <dt>设备厂商</dt>
        <dd>{{formatProducer(cameraInfo)}}</dd>
      </dl>
      <dl>
        <dt>设备状态</dt>
        <dd>{{formatStatus(cameraInfo)}}</dd>
      </dl>
      <dl>
        <dt>空间目录</dt>
        <dd>{{cameraInfo.spaceName}}</dd>
      </dl>
      <dl>
        <dt>设备IP</dt>
        <dd>{{cameraInfo.deviceIp}}</dd>
      </dl>
      <dl>
        <dt>设备端口</dt>
        <dd>{{cameraInfo.devicePort}}</dd>
      </dl>
      <dl>
        <dt>设备类型</dt>
        <dd>{{formatDeviceType(cameraInfo)}}</dd>
      </dl>
    </div>
  </div>
  </div>
</template>

<script>
//import {} from '';

export default {
  components: {},
  props: {
    cameraInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    dict: {
      type: Object,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    formatStatus(row) {
      return this.selectDictLabel(this.dict.deviceStatus, row.status)
    },
    formatDeviceType(row) {
      return this.selectDictLabel(this.dict.cameraType, row.videoDeviceType)
    },
    formatProducer(row) {
      return this.selectDictLabel(this.dict.producer, row.producer)
    },
  },
}
</script>
<style lang='scss' scoped>
@import '@/styles/variables.scss';
.drop-detail {
  padding: 10px 16px;
  display: flex;
}
.info {
  flex: 1;
}
dl,
dt,
dd {
  margin: 0;
}
dl {
  font-size: 14 * $vw;
  display: flex;
  padding: 8 * $vw 10 * $vw;
  dt {
    width: 5em;
    padding-right: 6 * $vw;
    flex-shrink: 0;
  }
  dd {
    word-break: break-all;
    color: #666666;
  }
}
.cover {
  flex-shrink: 0;
  width: 500 * $vw;
  height: 300 * $vw;
  & > * {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>