<template>
  <div>
    <div class="product_name">城运中心事件处置进度信息</div>
    <div class="step">
      <!-- <el-steps :active="length" finish-status="success">
        <el-step v-for="(item, index) in tableData" :key="index" :title="item.taskLabel"></el-step>
      </el-steps> -->
      <div class="vertical">
        <el-timeline>
          <el-timeline-item placement="top" v-for="(item, index) in tableData" :key="index"
                            :timestamp="item.createdDate">
            <el-card>
              <h3 class="tit">已{{item.taskLabel}}</h3>
              <p style="color: #999999;margin-top:10px">{{item.handlingOUName}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>

  </div>
</template>
<script>
import { getEventSchedule } from '@/api/app/event/manual'
export default {
  props: {
    info: {
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
      tableData: [],
      length: null,
      activities: [
        {
          actionName: '立案',
          content: '活动按期开始',
          timestamp: '2018-04-15',
          handlingOUName: '深圳市分拨中心',
        },
        {
          actionName: '立案',
          content: '通过审核',
          timestamp: '2018-04-13',
          handlingOUName: '深圳市测试分拨中心',
        },
        {
          actionName: '上报',
          content: '创建成功',
          timestamp: '2018-04-11',
          handlingOUName: '深圳市分拨中心',
        },
      ],
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getEventSchedule(this.info.eventId).then((res) => {
        this.tableData = res.data.data.result.result.processInstanceRouting
        // this.length = res.data.data.result.result.processInstanceRouting.length
      })
    },
  },
}
</script>
<style lang='scss' scoped>
.product_name {
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  font-size: 20px;
  line-height: 32px;
}
.step {
  width: 80%;
  display: inline-block;
  // margin: 50px 0px;
  margin-left: -40%;
  left: 50%;
  position: relative;
  .vertical {
    margin-top: 20px;
  }
}
.tit {
  font-weight: bold;
  color: #333;
  font-size: 18px;
  line-height: 38px;
}
</style>