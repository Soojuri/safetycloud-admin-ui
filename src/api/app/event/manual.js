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
const updateEventStatus = (params) => putAction('/eventtask/talerteventrecord/batchUpdateStatus', params)
// 事件统计
const getEventStatic = (params) => getAction('/iefVasService/tvideoanalyseevent/eventStatistics', params)
// 批量上报事件
const reportEvent = (params) => putAction('/iefVasService/tvideoanalyseevent/batchReport', params)
//获取相似的事件列表
// const getSameEventList = (id, params) => getAction(`/eventtask/talerteventrecord/pageForSame/${id}`, params);
const getSameEventList = (params) => getAction(`/eventtask/talerteventrecord/pageForSame`, params);
//查询事件进度
const getEventSchedule = (id) => getAction(`/iefVasService/tvideoanalyseevent/queryEventProgress/${id}`);
//获取未读数量
const getUnreadCount = (params) => getAction("/iefVasService/tvideoanalyseevent/getUnreadCount", params);
//事件分析统计-预警排名
const getRank = (params) => getAction("/eventtask/talerteventrecord/stats/rank", params);
//事件分析统计-数量统计
const getCount = (params) => getAction("/eventtask/talerteventrecord/stats/count", params);
//地图分页查询
const getPageForMap = (params) => getAction("/eventtask/talerteventrecord/pageForMap", params);
//事件分析统计-事件趋势
const getEventTime = (params) => getAction("/eventtask/talerteventrecord/stats/time", params);
//事件分析统计-事件等级分布
const getEventLevel = (params) => getAction("/eventtask/talerteventrecord/stats/level", params);

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
  getEventSchedule,
  getRank,
  getCount,
  getPageForMap,
  getEventTime,
  getEventLevel
}
