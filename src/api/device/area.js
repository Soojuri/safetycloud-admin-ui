import request from '@/router/axios'
//新增区域表
export function addArea (query) {
    return request({
        url: '/device​/tarea',
        method: 'post',
        data: query
    })
}

//修改区域表
export function putArea (query) {
    return request({
        url: '/device​/tarea',
        method: 'put',
        data: query
    })
}

//通过id查询
export function getAreaInfo (areaId) {
    return request({
        url: '/device​/tarea​/' + areaId,
        method: 'get'
    })
}

//通过id删除区域表
export function delArea (areaId) {
    return request({
        url: '/device​/tarea​/' + areaId,
        method: 'delete'
    })
}

//树形区域集合
export function getAreaTree (query) {
    return request({
        url: '​/device/tarea​/tree',
        method: 'get',
        params: query
    })
}
