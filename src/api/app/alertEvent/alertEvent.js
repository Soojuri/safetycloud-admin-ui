import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 预警事件配置表 增删改查
const getAlertEventConfigList = (params) => getAction('/eventtask/talerteventconfig/page', params);
const getAlertEventConfig = (id) => getAction("/eventtask/talerteventconfig/" + id);
const addAlertEventConfig = (params) => postAction("/eventtask/talerteventconfig", params);
const delAlertEventConfig = (id) => deleteAction('/eventtask/talerteventconfig/' + id);
const putAlertEventConfig = (params) => putAction('/eventtask/talerteventconfig/', params);
//修改事件配置状态
const updateStatus = (params) => postAction("/eventtask/talerteventconfig/updateStatus", params);

// 事件算法模型信息表 增删改查
const getAlgorithmList = (params) => getAction('/eventtask/talerteventalgorithm/page', params);
const getAlgorithmInfo = (id) => getAction("/eventtask/talerteventalgorithm/" + id);
const addAlgorithm = (params) => postAction("/eventtask/talerteventalgorithm", params);
const delAlgorithm = (id) => deleteAction('/eventtask/talerteventalgorithm/' + id);
const putAlgorithm = (params) => putAction('/eventtask/talerteventalgorithm/', params);

export {
  getAlertEventConfigList,
  getAlertEventConfig,
  addAlertEventConfig,
  delAlertEventConfig,
  putAlertEventConfig,
  updateStatus,
  getAlgorithmList,
  getAlgorithmInfo,
  addAlgorithm,
  delAlgorithm,
  putAlgorithm,
}
