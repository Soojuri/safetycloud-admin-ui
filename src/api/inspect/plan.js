import request from '@/router/axios'
// 查询巡检策略
export function inspectPlanList (data) {
  return request({
    url: '/device/inspectplan/strategyList',
    method: 'get',
    params: data,
  })
}
// 删除巡检策略
export function inspectPlanDel (id) {
  return request({
    url: '/device/inspectplan/' + id,
    method: 'delete'
  })
}

// 新增巡检策略
export function inspectPlanAdd (data) {
  return request({
    url: '/device/inspectplan',
    method: 'post',
    data: data
  })
}

// 修改启停用
export function activeUpdate (data) {
  return request({
    url: '/device/inspectplan/activeUpdate',
    method: 'put',
    data: data
  })
}

// // 修改巡检策略
export function planUpdate (data) {
  return request({
    url: '/device/inspectplan/planUpdate',
    method: 'put',
    data: data
  })
}

// 详情
export function planInfo (id) {
  return request({
    url: '/device/inspectplan/' + id,
    method: 'get',
  })
}

// 执行巡检策略
export function executePlan (id) {
  return request({
    url: '/device/inspectplan/executePlan',
    method: 'post',
    data: {
      id: id
    }
  })
}