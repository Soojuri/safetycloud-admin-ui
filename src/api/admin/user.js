import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/admin/user/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/admin/user',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/admin/user',
    method: 'put',
    data: obj
  })
}

export function getDetails(obj) {
  return request({
    url: '/admin/user/details/' + obj,
    method: 'get'
  })
}

//获取密码提示时间
export function getPasswordAlertDay(obj) {
  return request({
    url: '/admin/user/passwordAlertDay?username=' + obj,
    method: 'get',
  })
}

// 更改个人信息密码
export function editInfo(obj) {
  return request({
    url: '/admin/user/edit',
    method: 'put',
    data: obj
  })
}
// 更改个人信息
export function editInformation(obj) {
  return request({
    url: '/admin/user/editInfo',
    method: 'put',
    data: obj
  })
}
