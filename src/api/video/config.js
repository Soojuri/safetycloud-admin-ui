import request from '@/router/axios'

//获取信令服务配置
export function getSignalingConfig (query) {
    return request({
        url: '/device​/signalingconfig​/getInfo',
        method: 'post',
        data: query
    })
}

//新增信令服务配置
export function addSignalingConfig (query) {
    return request({
        url: '/device​/signalingconfig​/saveOrUpdate',
        method: 'post',
        data: query
    })
}

//获取流媒体服务配置
export function getStreamMediaConfig (query) {
    return request({
        url: '/device​/streammediaconfig​/getInfo',
        method: 'post',
        data: query
    })
}

//新增流媒体服务配置
export function addStreamMediaConfig (query) {
    return request({
        url: '/device​/streammediaconfig​/saveOrUpdate',
        method: 'post',
        data: query
    })
}
