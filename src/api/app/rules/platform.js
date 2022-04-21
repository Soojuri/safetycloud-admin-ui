import request from '@/router/axios'

//分页查询级联平台的所有所有通道
export function getChannelList(query) {
  return request({
    url: '/sip/platform​/channel_list',
    method: 'post',
    data: query
  })
}

//从上级平台移除国标通道
export function delChannelForGb(query) {
  return request({
    url: '​/sip/platform​/del_channel_for_gb',
    method: 'delete',
    data: query
  })
}

//删除上级平台
export function deletePlatform(serverGBId) {
  return request({
    url: '/sip/platform​/delete​/' + serverGBId,
    method: 'delete'
  })
}

//查询上级平台是否存在
export function exitPlatform(serverGBId) {
  return request({
    url: '/sip/platform​/exit​/' + serverGBId,
    method: 'get',
    params: serverGBId
  })
}

//分页查询级联平台
export function queryPlatform(query) {
  return request({
    url: '/sip/platform​/query​',
    method: 'post',
    data: query
  })
}

//保存上级平台信息
export function savePlatform(query) {
  return request({
    url: '/sip/platform​/save',
    method: 'post',
    data: query
  })
}

//获取国标服务的配置
export function getServeConfig(query) {
  return request({
    url: '/sip/platform​/server_config',
    method: 'get',
    params: query
  })
}

//向上级平台添加国标通道
export function updateChannelForGb(query) {
  return request({
    url: '/sip/platform​/update_channel_for_gb',
    method: 'post',
    data: query
  })
}

//使用ID查询国标设备
export function getPlatformInfo(id) {
  return request({
    url: '/sip/platform/getById/' + id,
    method: 'get'
  })
}

//分页查询级联平台关联的视频流
export function getStreamList(query) {
  return request({
    url: '/sip​/platform_gb_stream​/list',
    method: 'post',
    data: query
  })
}


//新增视频平台
export function addVideoPlatform(data) {
  return request({
    url: '/video​/tvideoplatform',
    method: 'post',
    data
  })
}



//修改视频平台
export function putVideoPlatform(data) {
  return request({
    url: '/video​/tvideoplatform',
    method: 'put',
    data
  })
}


//通过id查询
export function getVideoPlatformInfo(id) {
  return request({
    url: `/video​/tvideoplatform​/${id}`,
    method: 'get'
  })
}


//通过id删除视频平台
export function delVideoPlatform(id) {
  return request({
    url: `/video/tvideoplatform​/${id}`,
    method: 'delete'
  })
}

//分页查询视频平台列表
export function getVideoPlatformList(params) {
  return request({
    url: '/video​/tvideoplatform​/page',
    method: 'get',
    params
  })
}
