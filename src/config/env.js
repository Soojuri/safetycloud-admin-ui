// 配置编译环境和线上环境之间的切换
const env = process.env

const isVas = env.VUE_APP_DEPLOY === 'vas' // 判断是否部署vas
const isEuler = env.VUE_APP_DEPLOY === 'euler'

let imagePath = ''
if (isEuler) {
  imagePath = env.VUE_APP_EULER_IMG_PATH
} else if (isVas) {
  imagePath = env.VUE_APP_VAS_IMG_PATH
} else {
  imagePath = env.VUE_APP_IMG_PATH
}

const mapServerPath = env.VUE_APP_MAP_SERVER_PATH // gis地图服务地址

const tenantId = '2' // 租户id
// 图表库为avue和pig2套地址
const iconfontVersion = ['667895_v7uduh4zui', '1638883_qi08jij1ln', '2746732_4ej9j79ab7t']
const iconfontUrl = '//at.alicdn.com/t/font_$key.css'

export {
  isVas,
  iconfontUrl,
  iconfontVersion,
  env,
  imagePath,
  tenantId,
  mapServerPath
}
