<template>
  <div id="chooseChannel" v-loading="isLoading">

    <el-dialog title="选择通道" v-if="showDialog" top="2rem" width="70%" :close-on-click-modal="false"
               :visible.sync="showDialog" :destroy-on-close="true" @close="close()">
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="国标通道" name="gbChannel">
          <el-container>
            <el-main style="background-color: #FFF;">
              <chooseChannelForGb :platformId='platformId'></chooseChannelForGb>
            </el-main>
          </el-container>

        </el-tab-pane>
        <!-- <el-tab-pane label="直播流通道" name="streamchannel">
          <el-container>
            <el-main style="background-color: #FFF;">
              <chooseChannelFoStream :platformId='platformId'></chooseChannelFoStream>
            </el-main>
          </el-container>
        </el-tab-pane> -->
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { updateChannelForGb } from '@/api/app/camera/gbCascade'
import chooseChannelForGb from './chooseChannelForGb.vue'
import chooseChannelFoStream from './chooseChannelForStream.vue'
export default {
  name: 'chooseChannel',
  props: {},
  components: {
    chooseChannelForGb,
    chooseChannelFoStream,
  },
  computed: {},
  data() {
    return {
      isLoading: false,
      tabActiveName: 'gbChannel',
      platformId: '',
      showDialog: false,
      chooseData: {},
    }
  },
  methods: {
    openDialog: function (platformId, closeCallback) {
      console.log(platformId)
      this.platformId = platformId
      this.showDialog = true
      this.closeCallback = closeCallback
    },
    close: function () {
      this.closeCallback()
    },
    search: function () {},
    save: function () {
      var that = this
      updateChannelForGb({
        platformId: that.platformId,
        channelReduces: that.chooseData,
      })
        .then((res) => {
          if (res.data.data == true) {
            that.msgSuccess('保存成功')
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
  },
}
</script>

<style>
</style>
