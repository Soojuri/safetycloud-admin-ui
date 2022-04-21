import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getSubscribeList = (params) => getAction('/iefVasService/tvideoanalysesubscription/page', params);
const getSubscribeInfo = (id) => getAction("/iefVasService/tvideoanalysesubscription/" + id);
const addSubscribe = (params) => postAction("/iefVasService/tvideoanalysesubscription", params);
const delSubscribe = (id) => deleteAction('/iefVasService/tvideoanalysesubscription/' + id);
const putSubscribe = (params) => putAction('/iefVasService/tvideoanalysesubscription', params);
// 订阅记录
const getSubscribeRecordList = (params) => getAction('/iefVasService/tvideoanalysesubscriptionrecord/page', params);
const getSubscribeRecordInfo = (id) => getAction("/iefVasService/tvideoanalysesubscriptionrecord/" + id);
const addSubscribeRecord = (params) => postAction("/iefVasService/tvideoanalysesubscriptionrecord", params);
const delSubscribeRecord = (id) => deleteAction('/iefVasService/tvideoanalysesubscriptionrecord/' + id);
const putSubscribeRecord = (params) => putAction('/iefVasService/tvideoanalysesubscriptionrecord', params);
export {
  getSubscribeList,
  getSubscribeInfo,
  addSubscribe,
  delSubscribe,
  putSubscribe,
  getSubscribeRecordList,
  getSubscribeRecordInfo,
  addSubscribeRecord,
  delSubscribeRecord,
  putSubscribeRecord
}
