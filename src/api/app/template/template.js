import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 视频录制模板信息 增删改查
const getRecordList = (params) => getAction('/video/tvideotemplaterecord/page', params);
const getRecordInfo = (id) => getAction("/video/tvideotemplaterecord/" + id);
const addRecord = (params) => postAction("/video/tvideotemplaterecord", params);
const delRecord = (id) => deleteAction('/video/tvideotemplaterecord/' + id);
const putRecord = (params) => putAction('/video/tvideotemplaterecord', params);

// 视频截图模板 增删改查
const getTemplateList = (params) => getAction('/video/tvideotemplatecapture/page', params);
const getTemplateInfo = (id) => getAction("/video/tvideotemplatecapture/" + id);
const addTemplate = (params) => postAction("/video/tvideotemplatecapture", params);
const delTemplate = (id) => deleteAction('/video/tvideotemplatecapture/' + id);
const putTemplate = (params) => putAction('/video/tvideotemplatecapture', params);

export {
  getRecordList,
  getRecordInfo,
  addRecord,
  delRecord,
  putRecord,
  getTemplateList,
  getTemplateInfo,
  addTemplate,
  delTemplate,
  putTemplate,
}
