// 配置编译环境和线上环境之间的切换
const env = process.env
let baseUrl = ''
let imagePath = '' // 图片存储地址
let nodeRedPath = '' // node-red访问地址
let tenantId = '' // 租户id
// 图表库为avue和pig2套地址
const iconfontVersion = ['667895_v7uduh4zui', '1638883_qi08jij1ln', '2746732_4ej9j79ab7t']
const iconfontUrl = '//at.alicdn.com/t/font_$key.css'
const codeUrl = `${window.location.origin}/code`
const actUrl = `${window.location.origin}/act/modeler.html?modelId=`

// 开发环境
if (env.NODE_ENV === 'development') {
  imagePath = 'https://sc-img-t.xdwsinfo.com'
  nodeRedPath = 'http://39.108.217.65:1880/#flow/'
  tenantId = '2'
}
// 生产环境
else if (env.NODE_ENV === 'production') {
  imagePath = 'http://222.141.201.221:5069'
  nodeRedPath = 'http://10.11.1.56:1880/#flow/'
  tenantId = ''
}
// 测试环境
else if (env.NODE_ENV === 'test') {
  imagePath = 'https://sc-img-t.xdwsinfo.com'
  nodeRedPath = 'http://39.108.217.65:1880/#flow/'
  tenantId = ''
}
export {
  baseUrl,
  actUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env,
  imagePath,
  nodeRedPath,
  tenantId
}
