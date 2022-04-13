<template>
  <div class="component-upload-image">
    <el-upload action="/api/admin/sys-file/upload" list-type="picture-card" :on-success="handleUploadSuccess"
               :before-upload="handleBeforeUpload" :on-error="handleUploadError" :show-file-list="false"
               :headers="headers" style="display: inline-block; vertical-align: top">
      <el-image v-if="!value" :src="value">
        <div slot="error" class="image-slot">
          <i class="el-icon-plus" />
        </div>
      </el-image>
      <div v-else class="image">
        <el-image :src="value" :style="`width:150px;height:150px;`" fit="fill" />
        <div class="mask">
          <div class="actions">
            <span title="预览" @click.stop="dialogVisible = true">
              <i class="el-icon-zoom-in" />
            </span>
            <span title="移除" @click.stop="removeImage">
              <i class="el-icon-delete" />
            </span>
          </div>
        </div>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
      <img :src="value" style="display: block; max-width: 100%; margin: 0 auto;">
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
export default {
  data() {
    return {
      dialogVisible: false,
    }
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  watch: {},
  computed: {
    headers: function () {
      return {
        Authorization: 'Bearer ' + store.getters.access_token,
      }
    },
  },
  mounted() {},
  methods: {
    removeImage() {
      this.$emit('input', '')
    },
    handleUploadSuccess(res, file) {
      this.loading.close()
      if (res.code == 1) {
        return this.msgError(res.msg)
      } else {
        let url = this.IMAGE_PATH + res.data.url
        this.$emit('input', url)
      }
    },
    handleBeforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.msgError('上传图片只能是 JPG/PNG/GIF 格式!')
      } else if (!isLt2M) {
        this.msgError('上传图片大小不能超过 10MB!')
      } else {
        this.loading = this.$loading({
          lock: true,
          text: '上传中',
          background: 'rgba(0, 0, 0, 0.7)',
        })
      }
      return isJPG && isLt2M
    },
    handleUploadError() {
      this.$notify({
        type: 'error',
        message: '上传失败',
      })
      this.loading.close()
    },
  },
  watch: {},
}
</script>

<style scoped lang="scss">
.image {
  position: relative;
  .mask {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    height: 150px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  &:hover .mask {
    opacity: 1;
  }
}
</style>