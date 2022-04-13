import request from '@/router/axios'
// 查询巡检日志
export function listInspect (query) {
  return request({
    url: '/device/inspectrecord/getRecordList',
    method: 'get',
    params: query
  })
}
// 删除巡检记录
export function delRecord (id) {
  return request({
    url: '/device/inspectrecord/' + id,
    method: 'delete'
  })
}

export function recordInfo (id) {
  return request({
    url: '/device/inspectrecord/' + id,
    method: 'get'
  })
}

export function inspectPlanDeviceList (query) {
  return request({
    url: '/device/inspectrecord/inspectPlanDeviceList',
    method: 'get',
    params: query
  })
}
