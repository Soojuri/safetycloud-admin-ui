<template>
  <el-dialog
    title="处理"
    :visible.sync="DealVisible"
    width="30%"
    :before-close="handleClose"
  >
    <div class="dealVisible-body">
      <el-select v-model="selectEventStatus">
        <el-option
          v-for="item in dealOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="DealVisible = false">取 消</el-button>
      <el-button type="primary" @click="updateEventStatus">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateEventStatus } from "@/api/app/event/manual";
export default {
  data() {
    return {
      DealVisible: false, //处理页面显示
      selectEventStatus: null, //处理下拉框值
      dealOptions: [
        {
          value: 0,
          label: "待处理",
        },
        {
          value: 1,
          label: "已处理",
        },
      ], //处理值数组
      dealRow: {},
    };
  },
  methods: {
    //事件状态处理
    showDealPop() {
      console.log(this.dealRow);
      this.selectEventStatus = this.dealRow.eventStatus;
      this.DealVisible = true;
    },
    // 更新状态
    updateEventStatus() {
      if (this.selectEventStatus === this.dealRow.eventStatus) {
        this.msgWarn("请对状态进行更新");
        return;
      }
      const eventStatus = this.selectEventStatus;
      const handleResult = this.dealRow.handleResult
      const data = {
        eventStatus,
        handleResult,
        ids: [this.dealRow.eventId],
      };
      updateEventStatus(data)
        .then((res) => {
          if (res.data.data) {
            this.msgSuccess("操作成功");
          }
        })
        .finally(this.closePop());
    },
    // 关闭弹窗
    closePop() {
      this.DealVisible = false;
      this.$emit("closePop");
    },
  },
};
</script>

<style>
.dealVisible-body {
  display: flex;
  justify-content: center;
}
</style>
