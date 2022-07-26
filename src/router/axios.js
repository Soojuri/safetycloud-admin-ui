import axios from 'axios'
import {
  serialize
} from '@/util/util'
import {
  getStore
} from '@/util/store'
import NProgress from 'nprogress' // progress bar
import errorCode from '@/const/errorCode'
import router from '@/router/router'
import {
  Message
} from 'element-ui'
import 'nprogress/nprogress.css'
import qs from 'qs'
import store from '@/store' // progress bar style
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 10000
})
service.defaults.timeout = 10000
// 返回其他状态吗
service.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500 // 默认的
}
// 跨域请求，允许保存cookie
service.defaults.withCredentials = true
// NProgress Configuration
NProgress.configure({
  showSpinner: false
})

// HTTPrequest拦截
service.interceptors.request.use(config => {
  // 先把config.url进行URI编码，然后全局替换其中的特殊字符，然后再URI解码
  config.url = decodeURI(encodeURI(config.url).replace(/%E2%80%8B/g, ""))
  config.url = config.url.replace('#', '%23')
  NProgress.start() // start progress bar
  const TENANT_ID = getStore({
    name: 'tenantId_video'
  })
  const isToken = (config.headers || {}).isToken === false
  const token = store.getters.access_token
  if (token && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + token // token
  }
  if (TENANT_ID) {
    config.headers['TENANT-ID'] = TENANT_ID // 租户ID
  }
  config.headers['SYSTEM-TYPE'] = 2 // 系统类型：视频平台

  // headers中配置serialize为true开启序列化
  if (config.method === 'post' && config.headers.serialize) {
    config.data = serialize(config.data)
    delete config.data.serialize
  }

  if (config.method === 'get') {
    config.paramsSerializer = function (params) {
      return qs.stringify(params, {
        arrayFormat: 'repeat'
      })
    }
  }

  return config
}, error => {
  return Promise.reject(error)
})

// HTTPresponse拦截
service.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const message = res.data.msg || errorCode[status] || errorCode['default']
  if (status === 401) {
    Message({
      message: message,
      type: 'error'
    })
    store.dispatch('LogOut').then(() => {
      router.push({
        path: '/login'
      })
    })
    return
  }

  if (status !== 200 || res.data.code === 1) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  }

  return res
}, error => {
  // 处理 503 网络异常
  if (error.response.status === 503) {
    Message({
      message: error.response.data.msg,
      type: 'error'
    })
  }
  NProgress.done()
  return Promise.reject(new Error(error))
})

export default service
