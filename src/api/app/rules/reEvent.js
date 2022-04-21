import {
  getAction,
  deleteAction,
  putAction,
  downFile,
  postAction
} from '@/api/manage'

// 增删改查
const getReEventList = (params) => getAction('/iefVasService/tvideoanalyseruleconfigrepeat/page', params);
const getReEventInfo = (id) => getAction("/iefVasService/tvideoanalyseruleconfigrepeat/" + id);
const addReEvent = (params) => postAction("/iefVasService/tvideoanalyseruleconfigrepeat", params);
const delReEvent = (id) => deleteAction('/iefVasService/tvideoanalyseruleconfigrepeat/' + id);
const putReEvent = (params) => putAction('/iefVasService/tvideoanalyseruleconfigrepeat', params);
const changeStatus = (params) => postAction('/iefVasService/tvideoanalyseruleconfigrepeat/updateStatus', params)
const exportEvent = (params) => downFile('/iefVasService/tvideoanalyseruleconfigrepeat/export', params)
const importEvent = (params) => postAction('/iefVasService/tvideoanalyseruleconfigrepeat/import', params)
export {
  getReEventList,
  getReEventInfo,
  addReEvent,
  delReEvent,
  putReEvent,
  changeStatus,
  exportEvent,
  importEvent
}
