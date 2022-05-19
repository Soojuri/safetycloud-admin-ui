<!-- 算法模型详情页 -->
<template>
  <div class='sub-page'>
    <div class="g-card">
      <div class="tit">事件模型信息</div>
      <div class="information">
        <el-descriptions :column="2" size="medium" class="mt-xl">
          <el-descriptions-item labelStyle="white-space: nowrap" contentStyle="overflow:hidden;text-overflow:ellipsis;"
                                label="模型ID">
            <el-tooltip effect="dark" :content="form.algorithmId" placement="top">
              <span>{{ form.algorithmId }}</span>
            </el-tooltip>
          </el-descriptions-item>
          <el-descriptions-item label="发现事件数量"> {{ form.algorithmName }}
          </el-descriptions-item>
          <el-descriptions-item label="算法模型描述"> {{ form.shortDescription }}
          </el-descriptions-item>
          <el-descriptions-item label="算法模型分类"> {{ form.algorithmType == 1?'视频算法模型':'传感器算法模型' }}
          </el-descriptions-item>
          <el-descriptions-item label="算法模型来源"> {{ form.algorithmName }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间"> {{ parseTime(form.createTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人"> {{ form.creatorName }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间"> {{ parseTime(form.updateTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="创建人"> {{ form.updatorName }}
          </el-descriptions-item>
          <el-descriptions-item labelStyle="white-space: nowrap" :span="2" label="备注"> {{ form.remark }}
          </el-descriptions-item>
        </el-descriptions>
        <img :src="form.backgroundUrl" alt="">
      </div>
      <div class="tit">算法模型发现事件列表</div>
      <div class="g-table mt-xl">
        <el-table v-loading="loading" :data="list" border>
          <el-table-column prop="eventId" align="center" label="事件ID">
          </el-table-column>
          <el-table-column prop="eventName" align="center" label="所属公司">
          </el-table-column>
          <el-table-column prop="eventName" align="center" label="事件名称">
          </el-table-column>
          <el-table-column prop="eventLevel" align="center" label="事件等级" :formatter='eventLevelFormat'>
          </el-table-column>
          <el-table-column prop="eventStatus" align="center" label="事件状态">
            <template slot-scope="scope">
              <template v-if="scope.row.eventStatus == 0">
                <span class="yellow_status"></span>
                <span class="status_text">待处理</span>
              </template>
              <template v-if="scope.row.eventStatus == 1 ">
                <span class="green_status"></span>
                <span class="status_text">已处理</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="handleResult" align="center" label="处理结果" width="80">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.handleResult == 0">待处理</el-tag>
              <el-tag v-if="scope.row.handleResult == 1">有效</el-tag>
              <el-tag closable v-if="scope.row.handleResult == 3" @close="handleSingleEvent(scope.row.eventId,1,1)"
                      type="warning">重复</el-tag>
              <el-tag closable v-if="scope.row.handleResult == 4" @close="handleSingleEvent(scope.row.eventId,1,1)"
                      type="danger">误报</el-tag>
              <el-tag v-if="scope.row.handleResult == 2" type="success">已提交</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="eventDetectTime" align="center" label="发现时间" width="140">
            <template slot-scope="scope">{{parseTime(scope.row.eventDetectTime)}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-info" type="text"
                         @click="$router.push('/app/algorithm/manage/details/index?id=' + scope.row.algorithmId)">查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="g-page-x mt-m">
          <pagination :pageSizes="[10,20,50,100]" :total="total" :page.sync="queryParams.current"
                      :limit.sync="queryParams.size" @pagination="getList" />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { getAlgorithmInfo } from '@/api/app/alertEvent/alertEvent.js'
import { getEventList } from '@/api/app/event/manual'
export default {
  data() {
    return {
      form: {
        packageName: null,
        algorithmType: null,
        expirationTime: null,
        remark: null,
        backgroundUrl: null,
      },
      queryParams: {
        size: 10,
        current: 1,
        algorithmId: null,
      },

      loading: false,
      list: [],
      eventLevel: null,
      id: null,
      total: 0,
    }
  },
  computed: {},
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getDicts('event_level').then((res) => {
      this.eventLevel = res.data.data
      this.getList()
    })
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      this.queryParams.algorithmId = this.$route.query.id
      getEventList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.list = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })

      if (this.$route.query.id) {
        getAlgorithmInfo(this.$route.query.id).then((res) => {
          this.form = res.data.data
        })
      }
    },
    eventLevelFormat(row) {
      return this.selectDictLabel(this.eventLevel, row.eventLevel)
    },
  },
}
</script>
<style lang='scss' scoped>
.g-card {
  font-size: 16px;
  .information {
    display: flex;
    margin: 13px 0;
    img {
      width: 403px;
      height: 151px;
    }
  }
}
.tit {
  font-size: 18px;
  display: flex;
  align-items: flex-start;
  margin: 13px 0;
  &::before {
    content: '';
    height: 20px;
    width: 4px;
    border-radius: 2px;
    background: #2975ff;
    display: inline-block;
    margin-right: 8px;
    vertical-align: top;
    margin-top: 3px;
  }
}
</style>