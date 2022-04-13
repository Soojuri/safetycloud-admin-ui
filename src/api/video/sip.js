import request from '@/router/axios'

//删除信令配置
export function delSipConfig(query) {
  return request({
    url: '/sip​/server​/sip_server​/delete',
    method: 'delete',
    params: query
  })
}

//信令服务列表
export function getSipList(query) {
  return request({
    url: '/sip​/server​/sip_server​/list',
    method: 'get',
    params: query
  })
}

//修改信令配置
export function saveSipConfig(query) {
  return request({
    url: '/sip​/server​/sip_server​/save',
    method: 'post',
    data: query
  })
}
