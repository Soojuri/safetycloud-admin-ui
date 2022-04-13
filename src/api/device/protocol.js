import request from '@/router/axios'



//新增物联设备协议表
export function postObj (query) {
    return request({
        url: '/device/tdeviceprotocol',
        method: 'POST',
        data: query
    })
}




//修改物联设备协议表
export function putObj (query) {
    return request({
        url: '/device/​tdeviceprotocol',
        method: 'PUT',
        data: query
    })
}




//发布协议
export function deployObj (query) {
    return request({
        url: '/device/tdeviceprotocol​/' + query.id + '/_deploy',
        method: 'POST',
        data: query
    })
}


//取消发布
export function undeployObj (query) {
    return request({
        url: '/device/tdeviceprotocol​/' + query.id + '_un-deploy',
        method: 'POST',
        data: query
    })
}


//通过id查询
export function getObj (id) {
    return request({
        url: '​/device/tdeviceprotocol​/' + id,
        method: 'Get',
    })
}


//通过id删除物联设备协议表
export function delObj (id) {
    return request({
        url: '/device/tdeviceprotocol​/' + id,
        method: 'delete'
    })
}



//获取所有协议
export function getAllProtocol () {
    return request({
        url: '/device​/tdeviceprotocol​/getAllProtocol',
        method: 'Get',
    })
}




//分页查询
export function fetchList (query) {
    return request({
        url: '/device/tdeviceprotocol​/page',
        method: 'Get',
        params: query
    })
}




//获取单位数据
export function getUnits () {
    return request({
        url: '/device​/tdeviceprotocol​/units',
        method: 'get'
    })
}
