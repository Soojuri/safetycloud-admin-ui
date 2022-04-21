import request from '@/router/axios'


//新增物联设备分类表
export function addDeviceClassify (query) {
    return request({
        url: '/device/tdeviceclassify',
        method: 'POST',
        data: query
    })
}


//修改物联设备分类表
export function updateDeviceClassify (query) {
    return request({
        url: '​/device/tdeviceclassify',
        method: 'PUT',
        data: query
    })
}


//通过id查询
export function queryDeviceClassifyById (id) {
    return request({
        url: '​/device/tdeviceclassify​/' + id,
        method: 'GET',
    })
}




//通过id删除物联设备分类表
export function delDeviceClassifyById (id) {
    return request({
        url: '/device​/tdeviceclassify​/' + id,
        method: 'DELETE'
    })
}


//获取分类列表
export function getTree (lazy, parentId) {
    return request({
        url: '/device/tdeviceclassify/tree',
        method: 'get',
        params: { lazy: lazy, parentId: parentId }
    })
}

