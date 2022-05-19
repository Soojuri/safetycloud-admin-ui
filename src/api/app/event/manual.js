import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getEventList = (params) => getAction('/eventtask/talerteventrecord/page', params);
const getEventInfo = (id) => getAction(`/eventtask/talerteventrecord/${id}`);
const addEvent = (params) => postAction("/eventtask/talerteventrecord", params);
const delEvent = (id) => deleteAction(`/eventtask/talerteventrecord/${id}`);
const putEvent = (params) => putAction('/eventtask/talerteventrecord', params);
// 批量更新事件状态
const updateEventStatus = (params) => putAction('/iefVasService/tvideoanalyseevent/batchUpdateStatus', params)
// 事件统计
const getEventStatic = (params) => getAction('/iefVasService/tvideoanalyseevent/eventStatistics', params)
// 批量上报事件
const reportEvent = (params) => putAction('/iefVasService/tvideoanalyseevent/batchReport', params)
//获取相似的事件列表
const getSameEventList = (id, params) => getAction(`/iefVasService/tvideoanalyseevent/getSameEventList/${id}`, params);
//查询事件进度
const getEventSchedule = (id) => getAction(`/iefVasService/tvideoanalyseevent/queryEventProgress/${id}`);
//获取未读数量
const getUnreadCount = (params) => getAction("/iefVasService/tvideoanalyseevent/getUnreadCount", params);

export {
  getEventList,
  getEventInfo,
  addEvent,
  delEvent,
  putEvent,
  updateEventStatus,
  getEventStatic,
  reportEvent,
  getSameEventList,
  getUnreadCount,
  getEventSchedule
}
