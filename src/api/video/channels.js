import request from '@/router/axios'


//新增视频设备通道信息表
export function addChannel(query) {
  return request({
    url: '/device​/tdevicevideochannels',
    method: 'post',
    data: query
  })
}




//修改视频设备通道信息表
export function putChannel(query) {
  return request({
    url: '/device​/tdevicevideochannels',
    method: 'put',
    data: query
  })
}




//通过id查询
export function getChannelInfo(id) {
  return request({
    url: '/device​/tdevicevideochannels​/' + id,
    method: 'get',
    params: query
  })
}




//通过id删除视频设备通道信息表
export function delChannel(id) {
  return request({
    url: '/device​/tdevicevideochannels​/' + id,
    method: 'delete',
    data: query
  })
}




//分页查询
export function getChannelList(query) {
  return request({
    url: '/device​/tdevicevideochannels​/page',
    method: 'get',
    params: query
  })
}



//查询国标设备树
export function getDeviceChannelList() {
  return request({
    url: '/sip/​deviceQuery​/deviceChannelList',
    method: 'get',
  })
}
