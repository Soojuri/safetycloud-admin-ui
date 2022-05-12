<template>
  <div class="sub-page">
    <div class="g-card">
      <el-form ref="queryParams" :model="queryParams" inline>
        <el-form-item label="产品名称" prop="productName" :rules="[$formRules.checkLen()]">
          <el-input v-model="queryParams.productName" placeholder="请输入产品名称"></el-input>
        </el-form-item>

        <el-form-item label="产品类型" prop="algorithmCategory">
          <el-select v-model="queryParams.algorithmCategory" placeholder="请选择产品类型">
            <el-option v-for="item in dict.algorithmCategory" :label="item.label" :value="item.value" :key="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="ml-xl">
          <el-button icon="el-icon-search" type="primary" @click="handleQuery">查 询</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="new-add">
        <el-button type="primary" @click="handleAdd">新 增</el-button>
      </div>
      <div v-loading="loading">
        <div class="arit-list" v-if="tableData && tableData.length > 0">
          <div class="cell" v-for="(item, index) in tableData" :key="index">
            <div class="cover">
              <img class="icon" :src="item.productCoverUrl" />
            </div>
            <div class="tit">
              <label>{{ item.productName }}</label>
              <span>
                {{ formatType(item.algorithmCategory) }}
              </span>
            </div>
            <p>{{ item.productDescription }}</p>
            <div class="opera">
              <div class="edit" @click="handleEdit(item)">编辑</div>
              <el-button class="delete" :disabled="item.algorithmCount || item.status === 1" size="medium"
                         icon="el-icon-delete" type="text" @click="handleDelete(item)">删除
              </el-button>
              <div class="link" @click="handleDetails(item)">查看详情</div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无数据"></el-empty>
      </div>
      <div class="g-page-x mt-m">
        <pagination :pageSizes="[8,16,32,64]" :total="total" :page.sync="queryParams.current"
                    :limit.sync="queryParams.size" @pagination="getList" />
      </div>
      <!-- 弹窗 -->
      <pop-form v-if="formOptions.visible" :dict="dict" :visible.sync="formOptions.visible" :data="formOptions.data"
                @ok="getList()">
      </pop-form>
    </div>
  </div>
</template>

<script>
import PopForm from './popFrom.vue'
import { getProductList, delProduct } from '@/api/app/product/product.js'
import { mapGetters } from 'vuex'
export default {
  components: { PopForm },
  data() {
    return {
      queryParams: {
        size: 8,
        current: 1,
        productName: null,
        algorithmCategory: null,
        productType: 1,
      },
      total: 0,
      tableData: [],
      dict: {},
      formOptions: {
        visible: false,
        data: {},
      },
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['permissions']),
  },
  watch: {},
  //挂载完成（可以访问DOM元素）
  mounted() {
    this.getDicts('software_product_type').then((res) => {
      this.dict.algorithmCategory = res.data.data
      this.getList()
    })
  },
  //方法集合
  methods: {
    getList() {
      this.loading = true
      getProductList(this.queryParams)
        .then((res) => {
          this.loading = false
          this.tableData = res.data.data.records
          this.total = res.data.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    formatType(algorithmCategory) {
      return this.selectDictLabel(this.dict.algorithmCategory, algorithmCategory)
    },
    handleAdd() {
      // if (!this.permissions.algorithm_bag_add) return this.msgWarn('权限不足')
      this.formOptions.visible = true
      this.formOptions.data = {}
    },
    handleEdit(row) {
      // if (!this.permissions.algorithm_bag_edit) return this.msgWarn('权限不足')
      this.formOptions.data.id = row.productId
      this.formOptions.visible = true
    },
    handleQuery() {
      const that = this
      this.$refs.queryParams.validate((valid) => {
        if (valid) {
          that.getList()
        }
      })
    },
    handleClear() {
      this.resetForm('queryParams')
      this.getList()
    },
    handleDelete(row) {
      // if (!this.permissions.algorithm_bag_delete) return this.msgWarn('权限不足')
      const that = this
      this.$confirm('是否确认删除该产品', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          return delProduct(row.productId)
        })
        .then((res) => {
          if (res.data.data) {
            that.msgSuccess('删除成功')
            that.handleClear()
          }
        })
    },
    handleDetails(row) {
      // if (!this.permissions.algorithm_bag_view) return this.msgWarn('权限不足')
      const id = row.productId
      this.$router.push('/app/product/software/details/index?id=' + id)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
$vw: 100vw/1920;
.chartKJSXTLXXXZB,
.chartZNSBQK,
.chartGSDZYSL {
  height: 260 * $vw;
}
div[class*='chart'] {
  margin: 12 * $vw;
}
div[class*='chart']:empty {
  background: #eee;
}
.sub-page {
  min-height: 100%;
  display: flex;
  font-size: 16 * $vw;
  flex-direction: column;
  align-items: stretch;
  background-color: white;
  margin: 0 12 * $vw;
  width: auto;
}
.count-x {
  display: flex;
  margin-right: -12 * $vw;
  .c1 {
    background: linear-gradient(to bottom, #33bdf6, #118ced);
  }
  .c2 {
    background: linear-gradient(to bottom, #54d8e0, #1cb7ba);
  }
  .c3 {
    background: linear-gradient(to bottom, #f1cf47, #efa71d);
  }
  .c4 {
    background: linear-gradient(to bottom, #f4a05d, #ed772d);
  }
  dl,
  dt,
  dd {
    margin: 0;
  }
  .cell {
    border-radius: 10 * $vw;
    flex: 1;
    margin-right: 12 * $vw;
    margin-top: 12 * $vw;
    padding: 20 * $vw 28 * $vw;
    display: flex;
    align-items: center;
    color: white;
    .icon {
      margin-right: 18 * $vw;
      width: 82 * $vw;
      height: 82 * $vw;
    }
    dd {
      font-size: 48 * $vw;
      line-height: 1;
    }
    dt {
      font-size: 20 * $vw;
    }
  }
}

.filter-btn-box {
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.1);
  .text {
    margin-right: 40px;
    line-height: 1;
  }
  .el-radio-group {
    display: flex;
    width: 70%;
    justify-content: space-between;
    ::v-deep .el-radio-button__inner {
      border: none;
      font-size: 16px;
    }
    ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      border-radius: 4px !important;
    }
  }
}
.new-add {
  margin-top: 12px;
}
.arit-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6px;
  margin-top: 12px;
  .cell {
    position: relative;
    width: calc(25% - 12px);
    margin: 6px;
    box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.1);
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.3s;
    &:hover {
      cursor: pointer;
      transform: translateY(-3px);
      box-shadow: 0 0 15px rgba($color: #000000, $alpha: 0.1);
    }
    .num {
      color: #fff;
      position: absolute;
      left: 5px;
      top: 5px;
      z-index: 999;
      background: red;
      border-radius: 50%;
      width: 20px;
      text-align: center;
      font-size: 12px;
      line-height: 20px;
      height: 20px;
    }
  }
  .state {
    position: absolute;
    height: 24 * $vw;
    font-size: 16 * $vw;
    color: white;
    right: -24px;
    top: 10px;
    text-align: center;
    width: 4em;
    box-sizing: content-box;
    transform: rotate(45deg);
    background: #26d90e;
    padding: 0 20px;
    &.orange {
      background: #f68119;
    }
  }
  .cover {
    border-bottom: solid 1px #e0e0e0;
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      display: block;
    }
  }
  .tit {
    margin: 8px 12px;
    display: flex;
    font-size: 16px;
    label {
      flex: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      -webkit-line-clamp: 1;
      margin-right: 10px;
    }
    span {
      font-size: 14px;
      color: #999999;
    }
  }
  p {
    word-break: break-all;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
    margin: 8px 12px;
    color: #4c4c4c;
    font-size: 14px;
    height: 38px;
  }
  .opera {
    border-top: solid 1px #e0e0e0;
    display: flex;
    justify-content: space-between;
    .edit {
      cursor: pointer;
      padding: 12px;
      color: $--color-primary;
      &::before {
        content: '\e919';
        font-family: c-icon-font, sans-serif;
        font-size: 16px;
        margin-right: 4px;
        vertical-align: -2px;
      }
    }
    .link {
      cursor: pointer;
      padding: 12px;
      color: $--color-primary;
      &::before {
        content: '\e918';
        font-family: c-icon-font, sans-serif;
        font-size: 16px;
        margin-left: 4px;
        vertical-align: -2px;
      }
    }
  }
}
</style>
