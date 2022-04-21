<template>
  <el-col :span="span" :xs="spanMap.xs" :sm="spanMap.sm" :md="spanMap.md" :lg="spanMap.lg" :xl="spanMap.xl"
          class="descriptions-item">
    <div class="descriptions-item-content">
      <div class="descriptions-item-label">
        <span>{{ label }}</span>
        <el-tooltip class="item" effect="dark" :content="desc" placement="top">
          <i v-if="desc" class="el-icon-question"></i>
        </el-tooltip>
      </div>
      <div class="descriptions-item-value">
        <slot v-if="$slots.content" name="content" />
        <div v-else class="default-value">
          <el-tooltip :content="validatenull(value) ? '空' : value" placement="top">
            <span class="value">{{ validatenull(value) ? '/'  : value }}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script>
import { validatenull } from '@/util/validate'
export default {
  name: 'ElDescriptionItem',
  props: {
    spanMap: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
    desc: {
      type: String,
      default: '',
    },
    span: {
      type: Number,
      required: false,
      default: 12,
    },
    labelClass: {
      type: String,
      default: '',
    },
    label: {
      required: true,
    },
    value: {
      required: false,
      default() {
        return ''
      },
    },
  },
  methods: {
    validatenull(val) {
      return validatenull(val)
    },
  },
}
</script>

<style scoped lang="scss">
.el-col {
  margin-bottom: 0px;
}
.descriptions-item {
  span {
    display: inline-block;
  }
  .descriptions-item-content {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    line-height: 1.5;
    width: 100%;
    border-bottom: 1px solid #e8e8e8;
    .descriptions-item-label {
      text-align: left;
      flex-grow: 0;
      flex-shrink: 0;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
      font-size: 14px;
      line-height: 1.5;
      background-color: #fafafa;
      padding: 16px 24px;
      min-width: 150px;
      border-right: 1px solid #e8e8e8;
    }
    .descriptions-item-value {
      text-align: left;
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      // padding: 16px 24px;
      border-right: 1px solid #e8e8e8;
      .default-value {
        height: 100%;
        display: inline-block;
        width: 100%;

        .value {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
          height: 100%;
          line-height: 47px;
          text-indent: 1em;
        }
      }
    }
  }
}
</style>
