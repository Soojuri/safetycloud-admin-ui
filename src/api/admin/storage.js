import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getStorageList = (params) => getAction('/iefVasService/sysossconfig/page', params);
const getStorageInfo = (id) => getAction("/iefVasService/sysossconfig/" + id);
const addStorage = (params) => postAction("/iefVasService/sysossconfig", params);
const delStorage = (id) => deleteAction('/iefVasService/sysossconfig/' + id);
const putStorage = (params) => putAction('/iefVasService/sysossconfig', params);

export {
  getStorageList,
  getStorageInfo,
  addStorage,
  delStorage,
  putStorage
}
