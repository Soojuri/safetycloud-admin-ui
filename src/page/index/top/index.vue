<template>
  <div class="avue-top">
    <div class="logo">
      <img height="35" :src="require('@/assets/images/logo-top.png')" alt="">
      <span>统一运营管理平台</span>
    </div>
    <div class="top-bar__left">
      <div v-if="showCollapse" :class="[{ 'avue-breadcrumb--active': isCollapse }]" class="avue-breadcrumb">
        <i class="icon-navicon" @click="setCollapse" />
      </div>
    </div>
    <div class="top-bar__title">
      <div v-if="showMenu" class="top-bar__item top-bar__item--show">
        <top-menu />
      </div>
    </div>
    <div class="top-bar__right">
      <!-- <el-tooltip v-if="showColor" effect="dark" content="主题色" placement="bottom">
        <div class="top-bar__item">
          <top-color />
        </div>
      </el-tooltip>
      <el-tooltip v-if="showDebug" :content="logsFlag?'没有错误日志':`${logsLen}条错误日志`" effect="dark" placement="bottom">
        <div class="top-bar__item">
          <top-logs />
        </div>
      </el-tooltip>
      <el-tooltip v-if="showLock" effect="dark" content="锁屏" placement="bottom">
        <div class="top-bar__item">
          <top-lock />
        </div>
      </el-tooltip>
      <el-tooltip v-if="showTheme" effect="dark" content="特色主题" placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme />
        </div>
      </el-tooltip> -->
      <el-tooltip v-if="showFullScreen" :content="isFullScreen?'退出全屏':'全屏'" effect="dark" placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScreen?'icon-zuixiaohua':'icon-quanpingzuidahua'" @click="handleScreen" />
        </div>
      </el-tooltip>
      <el-tooltip v-if="userInfo.avatar" effect="dark" content="用户头像" placement="bottom">
        <el-image :src="IMAGE_PATH + userInfo.avatar" class="top-bar__img">
          <div slot="error">
            <img :src="require('@/assets/images/user.png')" class="image-slot">
          </div>
        </el-image>
      </el-tooltip>
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.username }}
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item divided>
            <router-link to="/">工作台</router-link>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <router-link to="/info/index">个人信息</router-link>
          </el-dropdown-item>
          <!-- <el-dropdown-item divided @click.native="$refs.seting.open()">界面设置
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">退出系统
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <top-setting ref="seting" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { fullscreenToggel, listenfullscreen } from '@/util/util'
import topLock from './top-lock'
import topMenu from './top-menu'
import topTheme from './top-theme'
import topLogs from './top-logs'
import topColor from './top-color'
import topSetting from './top-setting'

export default {
  name: 'Top',
  components: {
    topLock,
    topMenu,
    topTheme,
    topLogs,
    topColor,
    topSetting,
  },
  filters: {},
  data() {
    return {}
  },
  computed: {
    ...mapState({
      showDebug: (state) => state.common.showDebug,
      showTheme: (state) => state.common.showTheme,
      showLock: (state) => state.common.showLock,
      showFullScreen: (state) => state.common.showFullScreen,
      showCollapse: (state) => state.common.showCollapse,
      showMenu: (state) => state.common.showMenu,
      showColor: (state) => state.common.showColor,
      loginType: (state) => state.user.login_type,
    }),
    ...mapGetters(['userInfo', 'isFullScreen', 'tagWel', 'tagList', 'isCollapse', 'tag', 'logsLen', 'logsFlag']),
  },
  created() {},
  mounted() {
    listenfullscreen(this.setScreen)
  },
  methods: {
    handleScreen() {
      fullscreenToggel()
    },
    setCollapse() {
      this.$store.commit('SET_COLLAPSE')
    },
    setScreen() {
      this.$store.commit('SET_FULLSCREEN')
    },
    logout() {
      this.$confirm('是否退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          const redirect_uri = window.location.origin
          console.log(redirect_uri)
          if (this.loginType === 'openId') {
            // 跳转华为退出登陆地址
            const client_id = 'dcvideo'
            const url = `https://oneaccess.smartcity.com:8443/idp/profile/OAUTH2/Redirect/GLO?redirctToUrl=${redirect_uri}&redirectToLogin=true&entityId=${client_id}`
            window.location.href = url
          } else {
            this.$router.push({ path: '/login' })
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.image-slot {
  width: 30px;
  height: 30px;
  border-radius: 100%;
  box-sizing: border-box;
  border: 1px solid #eee;
  vertical-align: middle;
  margin: -22px 0px 0 -3px;
}
</style>
