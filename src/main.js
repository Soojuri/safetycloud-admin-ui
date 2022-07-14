import 'babel-polyfill'
import 'classlist-polyfill'
import Vue from 'vue'
import axios from './router/axios'
import VueAxios from 'vue-axios'
import App from './App'
import './permission' // 权限
import './error' // 日志
import './cache' //页面缓冲
import router from './router/router'
import store from './store'
import {
  loadStyle,
  resetForm,
  selectDictLabel,
  selectDictLabels,
  formatNumber,
  downBlobFile,
  trimInput
} from './util/util'
import {
  parseTime
} from './util/date'
import {
  remote
} from "@/api/admin/dict"
import * as urls from '@/config/env'
import Avue from "@smallwei/avue"
import VueAMap from "vue-amap"
import "@smallwei/avue/lib/index.css"
import './styles/icon-font.css'
import {
  rule
} from "./util/validateRules"
import {
  iconfontUrl,
  iconfontVersion,
  imagePath
} from '@/config/env'
import * as filters from './filters' // 全局filter
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import './styles/common.scss'
import Pagination from "@/components/Pagination"
import basicContainer from './components/basic-container/main'
// 插件 json 展示
Vue.use(router)
Vue.use(VueAMap)
// 初始化高德地图
VueAMap.initAMapApiLoader({
  key: "bdf413cfa0b6de1e621478589abd2c41",
  plugin: ["AMap.Autocomplete", "AMap.Geocoder", "AMap.Geolocation"],
  v: "1.4.15",
  uiVersion: "1.1"
})
Vue.config.silent = true
window.axios = axios
Vue.use(VueAxios, axios)

Vue.prototype.resetForm = resetForm
Vue.prototype.getDicts = remote
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.parseTime = parseTime
Vue.prototype.IMAGE_PATH = imagePath
Vue.prototype.formatNumber = formatNumber
Vue.prototype.downBlobFile = downBlobFile
Vue.prototype.$formRules = rule
Vue.prototype.trimInput = trimInput
Vue.use(ElementUI, {
  size: 'small',
  menuType: 'text'
})
Vue.use(Avue, {
  size: 'small',
  menuType: 'text'
})

Vue.prototype.msgSuccess = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "success"
  })
}

Vue.prototype.msgError = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "error"
  })
}
Vue.prototype.msgWarn = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "warning"
  })
}
Vue.prototype.msgInfo = function (msg) {
  this.$message.info(msg)
}


// 注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('Pagination', Pagination)
// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key]
})

// 加载过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele))
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
