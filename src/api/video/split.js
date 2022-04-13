import request from '@/router/axios'
//获取摄像头列表
export function getCameras() {
  return request({
    url: '/video/hikvisionIsercure/cameras',
    method: 'get',
  })
}
//获取视频地址
export function getVideoUrl(query) {
  return request({
    url: '/video/hikvisionIsercure/previewURLs/',
    method: 'get',
    params: query
  })
}


//云台控制
export function controlling(data) {
  return request({
    url: '/video​/hikvisionIsercure​/controlling',
    method: 'post',
    data,
  })
}


//获取区域树
export function getAreaTree(params) {
  return request({
    url: '/video/hikvisionIsercure/getAreaTree',
    method: 'get',
    params
  })
}
