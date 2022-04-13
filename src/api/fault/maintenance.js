import request from '@/router/axios'

// 维修记录分页查询
export function maintenancePage (query) {
  return request({
    url: '/device/tdevicefaultrecordmaintenance/page',
    method: 'get',
    params: query
  })
}

// 维修详情
export function getInfo (id) {
  return request({
    url: '/device/tdevicefaultrecordmaintenance/' + id,
    method: 'get',
  })
}
