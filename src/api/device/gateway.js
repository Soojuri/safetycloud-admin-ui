
import request from '@/router/axios'




//绑定子设备
export function bind (query) {
    return request({
        url: '/device​/gateway​/bind',
        method: 'post',
        data: query
    })
}




//网关分页查询
export function getNetWorkList (query) {
    return request({
        url: '/device​/gateway​/getNetWorkList',
        method: 'get',
        params: query
    })
}




//解绑子设备
export function unbind (query) {
    return request({
        url: '/device​/gateway​/unbind',
        method: 'post',
        data: query
    })
}




//获取子设备
export function getChildrenList (query) {
    return request({
        url: '/device​/gateway​/getChildrenList',
        method: 'get',
        params: query
    })
}





//获取可以绑定的子设备列表
export function getBindDeviceList (query) {
    return request({
        url: '/device/gateway​/getBindDeviceList',
        method: 'get',
        params: query
    })
}
