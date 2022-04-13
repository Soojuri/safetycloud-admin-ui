import request from '@/router/axios'

// 故障记录分页查询
export function faultPage (query) {
  return request({
    url: '/device/faultrecord/page',
    method: 'get',
    params: query
  })
}

// 故障记录详情
export function getDTOInfo (id) {
  return request({
    url: '/device/faultrecord/' + id,
    method: 'get',
  })
}

// 故障误报
export function falseFault (id) {
  return request({
    url: '/device/faultrecord/falseFault',
    method: 'put',
    params: {
      id: id
    }
  })
}

export function addFaultRecord (data) {
  return request({
    url: '/device/faultrecord/addFault',
    method: 'post',
    data: data
  })
}

// 本月故障数统计
export function monthCount () {
  return request({
    url: '/device/faultrecord/monthCount',
    method: 'get',
  })
}

// 故障类型统计
export function typeCount () {
  return request({
    url: '/device/faultrecord/typeCount',
    method: 'get',
  })
}

// 设备列表统计
export function listCount (query) {
  return request({
    url: '/device/faultrecord/listCount',
    method: 'get',
    params: query
  })
}

//手动新增故障
export function addInfo (data) {
  return request({
    url: '/device/faultrecord/addFault',
    method: 'post',
    data: data
  })
}

// 获取最新故障记录
export function lastFaultRecord () {
  return request({
    url: '/device/faultrecord/lastFaultRecord',
    method: 'get',
  })
}

// 获取近12个月的故障统计
export function countFaultByMonth () {
  return request({
    url: '/device/faultrecord/countFaultByMonth',
    method: 'get',
  })
}

