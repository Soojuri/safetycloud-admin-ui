import request from '@/router/axios'

//新增视频设备信息表
export function addVideo(query) {
  return request({
    url: '/device​/devicevideo',
    method: 'post',
    data: query
  })
}

//修改视频设备信息表
export function putVideo(query) {
  return request({
    url: '/sip​/deviceQuery​/devices​/update',
    method: 'post',
    data: query
  })
}

//通过id查询
export function getVideoInfo(id) {
  return request({
    url: '/device​/devicevideo​/' + id,
    method: 'get'
  })
}

//通过id删除视频设备信息表
export function delVideo(query) {
  return request({
    url: '/device​/devicevideo​/' + id,
    method: 'delete',
    data: query
  })
}

//视频网关-视频设备-分页查询
export function getVideoList(query) {
  return request({
    url: '/device​/devicevideo​/getVideoList',
    method: 'get',
    params: query
  })
}

//分页查询国标设备
export function getDeviceList(query) {
  return request({
    url: '/sip/deviceQuery​/devices',
    method: 'post',
    data: query
  })
}




//使用ID查询国标设备
export function getDeviceInfo(deviceId) {
  return request({
    url: '/sip​/deviceQuery​/devices​/' + deviceId,
    method: 'get'
  })
}





//分页查询通道
export function getChannels(query) {
  return request({
    url: '/sip​/deviceQuery​/devices​/channels',
    method: 'post',
    data: query
  })
}





//开始点播
export function play({
  deviceId,
  channelId
}) {
  return request({
    url: `/sip​/play​/start​/${deviceId}​/${channelId}`,
    method: 'get'
  })
}





//云台控制
export function ptzControl(query) {
  return request({
    url: `/sip​/ptz​/control​/${query.deviceId}​/${query.channelId}`,
    method: 'post',
    data: query
  })
}





//获取流媒体编码信息
export function getMediaInfo(query) {
  return request({
    url: '/sip​/media/getMediaInfo',
    method: 'get',
    params: query
  })
}




//分页查询报警
export function getDeviceAlarmList(query) {
  return request({
    url: '/sip​/alarm​/all',
    method: 'get',
    params: query
  })
}





//删除设备录像
export function delVideoDeviceRecord(query) {
  return request({
    url: '/sip​/deviceControl​/deleteRecord',
    method: 'delete',
    params: query
  })
}
