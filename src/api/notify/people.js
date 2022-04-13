import request from '@/router/axios'

export function fetchList (query) {
    return request({
        url: '/device/tnotifyreceiver/page',
        method: 'get',
        params: query
    })
}

export function addObj (obj) {
    return request({
        url: '/device/tnotifyreceiver',
        method: 'post',
        data: obj
    })
}

export function getObj (id) {
    return request({
        url: '/device/tnotifyreceiver/' + id,
        method: 'get'
    })
}

export function delObj (id) {
    return request({
        url: '/device/tnotifyreceiver/' + id,
        method: 'delete'
    })
}

export function putObj (obj) {
    return request({
        url: '/device/tnotifyreceiver',
        method: 'put',
        data: obj
    })
}
