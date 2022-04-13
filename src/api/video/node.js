import request from '@/router/axios'

//流媒体服务列表
export function getNodeList(query) {
  return request({
    url: '/sip/server​/media_server​/list',
    method: 'get',
    params: query
  })
}

//测试流媒体服务
export function checkServer(query) {
  return request({
    url: '/sip​/server​/media_server​/check',
    method: 'get',
    params: query
  })
}

//测试流媒体录像管理服务
export function checkRecordServer(query) {
  return request({
    url: '/sip​/server​/media_server​/record​/check',
    method: 'get',
    params: query
  })
}

//保存流媒体服务
export function saveServer(query) {
  return request({
    url: '/sip​/server​/media_server​/save',
    method: 'post',
    data: query
  })
}




//移除流媒体服务
export function delServer(query) {
  return request({
    url: '​/sip/server​/media_server​/delete',
    method: 'delete',
    params: query
  })
}


//启停用流媒体服务
export function changeStatus(query) {
  return request({
    url: '/sip​/server​/media_server​/changeStatus',
    method: 'get',
    params: query
  })
}
