import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/device/tdevicesimaccount/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/device/tdevicesimaccount',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/device/tdevicesimaccount/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/device/tdevicesimaccount/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/device/tdevicesimaccount',
    method: 'put',
    data: obj
  })
}
