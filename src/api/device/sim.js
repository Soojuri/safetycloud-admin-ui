import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/device/tdevicesim/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/device/tdevicesim',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/device/tdevicesim/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/device/tdevicesim/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/device/tdevicesim',
    method: 'put',
    data: obj
  })
}


//刷新
export function refresh(id) {
  return request({
    url: '/device/tdevicesim/refresh/' + id,
    method: 'get',
  })
}
