import request from '@/router/axios'



//获取app文件夹列表
export function getRecordList(query) {
  return request({
    url: '/record​/videoRecord​/app​/list',
    method: 'get',
    params: query
  })
}




//获取日期文件夹列表
export function getDateList(query) {
  return request({
    url: '/record​/videoRecord​/date​/list',
    method: 'get',
    params: query
  })
}




//获取视频文件列表
export function getFileList(query) {
  return request({
    url: '/record​/videoRecord​/file​/list',
    method: 'get',
    params: query
  })
}




//获取app文件夹列表
export function getVideoRecordList(query) {
  return request({
    url: '/record​/videoRecord​/list',
    method: 'get',
    params: query
  })
}





//获取stream文件夹列表
export function getStreamList(query) {
  return request({
    url: '/record​/videoRecord​/stream​/list',
    method: 'get',
    params: query
  })
}





//移除文件
export function delRecord(query) {
  return request({
    url: '/record​/videoRecord​/deleteObject',
    method: 'delete',
    params: query
  })
}
