import request from '@/router/axios'


//新增物联设备产品表
export function postObj (obj) {
    return request({
        url: '/device/tdeviceproduct',
        method: 'post',
        data: obj
    })
}

//修改物联设备产品表
export function putObj (query) {
    return request({
        url: '/device/tdeviceproduct',
        method: 'put',
        data: query
    })
}


//通过id查询
export function getObj (id) {
    return request({
        url: '/device/tdeviceproduct​/' + id,
        method: 'get'
    })
}


//通过id删除物联设备产品表
export function delObj (id) {
    return request({
        url: '/device/tdeviceproduct​/' + id,
        method: 'delete'
    })
}



//获取所有产品
export function fetchList (query) {
    return request({
        url: '/device/tdeviceproduct​/getList',
        method: 'get',
        params: query
    })
}


//分页查询
export function getPage (query) {
    return request({
        url: '/device/tdeviceproduct/page',
        method: 'get',
        params: query
    })
}



//获取物模型数据
export function getProperties (query) {
    return request({
        url: '/device​/tdeviceproduct​/getProperties',
        method: 'get',
        params: query
    })
}


//
export function getPropertiesById (query) {
    return request({
        url: '/device/tdeviceproduct/getPropertiesById',
        method: 'get',
        params: query
    })
}





//获取产品需要的配置定义信息
export function getConfigMetaData (id) {
    return request({
        url: '​/device/tdeviceproduct​/' + id + '/config-metadata',
        method: 'get'
    })
}




//修改产品配置
export function updateConfig (query) {
    return request({
        url: '/device​/tdeviceproduct​/updateConfig',
        method: 'post',
        data: query
    })
}



//激活产品
export function deploy (productId) {
    return request({
        url: `/device/tdeviceproduct/${productId}/deploy`,
        method: 'post'
    })
}


//注销产品
export function undeploy (productId) {
    return request({
        url: `/device/tdeviceproduct/${productId}/undeploy`,
        method: 'post',
    })
}

