import request from '@/router/axios'



//新增产品设备订阅管理
export function addSub(query) {
  return request({
    url: '/notifyMessage/tdevicesubscription',
    method: 'post',
    data: query
  })
}




//修改产品设备订阅管理
export function putSub(query) {
  return request({
    url: '/notifyMessage/tdevicesubscription',
    method: 'put',
    data: query
  })
}


//通过id查询
export function getSub(subscriptionId) {
  return request({
    url: '/notifyMessage/tdevicesubscription​/' + subscriptionId,
    method: 'get'
  })
}




//通过id删除产品设备订阅管理
export function delSub(subscriptionId) {
  return request({
    url: '/notifyMessage/tdevicesubscription​/' + subscriptionId,
    method: 'delete'
  })
}




//分页查询
export function getSubList(query) {
  return request({
    url: '/notifyMessage/tdevicesubscription/page',
    method: 'get',
    params: query
  })
}


//分页查询订阅推送记录
export function getRecordList(params) {
  return request({
    url: '/notifyMessage​/tdevicesubscription​/records',
    method: 'get',
    params
  })
}
