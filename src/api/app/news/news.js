import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 消息通知 增删改查
const getNoticeList = (params) => getAction('/notifyMessage/tnotifymessage/page', params);
const getNoticeInfo = (id) => getAction("/notifyMessage/tnotifymessage/" + id);
const addNotice = (params) => postAction("/notifyMessage/tnotifymessage/", params);
const delNotice = (id) => deleteAction('/notifyMessage/tnotifymessage/' + id);
const putNotice = (params) => putAction('/notifyMessage/tnotifymessage', params);
// 批量已读消息
const setReadStatus = (params) => getAction('/notifyMessage/tnotifymessage/setReadStatus', params)

// 任务管理 增删改查
const getTaskList = (params) => getAction('/notifyMessage/tnotifyusertask/page', params);
const getTask = (id) => getAction("/notifyMessage/tnotifyusertask/" + id);
const addTask = (params) => postAction("/notifyMessage/tnotifyusertask/", params);
const delTask = (id) => deleteAction('/notifyMessage/tnotifyusertask/' + id);
const putTask = (params) => putAction('/notifyMessage/tnotifyusertask', params);

//任务驳回
const putTaskReject = (id) => putAction(`/notifyMessage/tnotifyusertask/workOrderId/${id}/reject`);

// 通知公告 增删改查
const getAnnouncementList = (params) => getAction('/notifyMessage/sysnotice/page', params);
const getAnnouncement = (id) => getAction("/notifyMessage/sysnotice/" + id);
const addAnnouncement = (params) => postAction("/notifyMessage/sysnotice/", params);
const delAnnouncement = (id) => deleteAction('/notifyMessage/sysnotice/' + id);
const putAnnouncement = (params) => putAction('/notifyMessage/sysnotice', params);

// 消息配置 增删改查
const getConfigList = (params) => getAction('/notifyMessage/tnotifymessageconfig/page', params);
const getConfig = (id) => getAction("/notifyMessage/tnotifymessageconfig/" + id);
const addConfig = (params) => postAction("/notifyMessage/tnotifymessageconfig/", params);
const delConfig = (id) => deleteAction('/notifyMessage/tnotifymessageconfig/' + id);
const putConfig = (params) => putAction('/notifyMessage/tnotifymessageconfig', params);

// 消息配置接收人员关联表 增删改查
const getReceiverList = (params) => getAction('/notifyMessage/tnotifymessageconfigreceiver/page', params);
const getReceiver = (id) => getAction("/notifyMessage/tnotifymessageconfigreceiver/" + id);
const addReceiver = (params) => postAction("/notifyMessage/tnotifymessageconfigreceiver/", params);
const delReceiver = (id) => deleteAction('/notifyMessage/tnotifymessageconfigreceiver/' + id);
const putReceiver = (params) => putAction('/notifyMessage/tnotifymessageconfigreceiver', params);

export {
  getNoticeList,
  getNoticeInfo,
  addNotice,
  delNotice,
  putNotice,
  setReadStatus,
  getTaskList,
  getTask,
  addTask,
  delTask,
  putTask,
  putTaskReject,
  getAnnouncementList,
  getAnnouncement,
  addAnnouncement,
  delAnnouncement,
  putAnnouncement,
  getConfigList,
  getConfig,
  addConfig,
  delConfig,
  putConfig,
  getReceiverList,
  getReceiver,
  addReceiver,
  delReceiver,
  putReceiver,
}
