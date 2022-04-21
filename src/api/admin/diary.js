import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'
import request from '@/router/axios'

//作业任务日志管理 增删改查
export function getWorkList(query) {
  return request({
    url: '/device/tvideoanalyseedgetasklog/page',
    method: 'get',
    params: query
  })
}
const getWorkInfo = (id) => getAction("/device/tvideoanalyseedgetasklog/" + id);
const addWork = (params) => postAction("/device/tvideoanalyseedgetasklog", params);
const delWork = (id) => deleteAction('/device/tvideoanalyseedgetasklog/' + id);
const putWork = (params) => putAction('/device/tvideoanalyseedgetasklog', params);

//事件日志管理 增删改查
export function getEventList(query) {
  return request({
    url: '/device/tvideoanalyseeventlog/page',
    method: 'get',
    params: query
  })
}
const getEventInfo = (id) => getAction("/device/tvideoanalyseeventlog/" + id);
const addEvent = (params) => postAction("/device/tvideoanalyseeventlog", params);
const delEvent = (id) => deleteAction('/device/tvideoanalyseeventlog/' + id);
const putEvent = (params) => putAction('/device/tvideoanalyseeventlog', params);

//设备日志管理 增删改查
export function getDeviceList(query) {
  return request({
    url: '/device/tdevicelog/page',
    method: 'get',
    params: query
  })
}
const getDeviceInfo = (id) => getAction("/device/tdevicelog/" + id);
const addDevice = (params) => postAction("/device/tdevicelog", params);
const delDevice = (id) => deleteAction('/device/tdevicelog/' + id);
const putDevice = (params) => putAction('/device/tdevicelog', params);


export {
  getWorkInfo,
  addWork,
  delWork,
  putWork,
  getEventInfo,
  addEvent,
  delEvent,
  putEvent,
  getDeviceInfo,
  addDevice,
  delDevice,
  putDevice,
}
