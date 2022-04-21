import {
  getAction,
  deleteAction,
  putAction,
  postAction,
  downFile
} from '@/api/manage'

// 增删改查
const getAutoSubmitList = (params) => getAction('/iefVasService/tvideoanalyseruleconfigautocommit/page', params);
const getAutoSubmitInfo = (id) => getAction("/iefVasService/tvideoanalyseruleconfigautocommit/" + id);
const addAutoSubmit = (params) => postAction("/iefVasService/tvideoanalyseruleconfigautocommit", params);
const delAutoSubmit = (id) => deleteAction('/iefVasService/tvideoanalyseruleconfigautocommit/' + id);
const putAutoSubmit = (params) => putAction('/iefVasService/tvideoanalyseruleconfigautocommit', params);
const changeStatus = (params) => postAction('/iefVasService/tvideoanalyseruleconfigautocommit/updateStatus', params)
const exportEvent = (params) => downFile('/iefVasService/tvideoanalyseruleconfigautocommit/export', params)
const importEvent = (params) => postAction('/iefVasService/tvideoanalyseruleconfigautocommit/import', params)
export {
  getAutoSubmitList,
  getAutoSubmitInfo,
  addAutoSubmit,
  delAutoSubmit,
  putAutoSubmit,
  changeStatus,
  exportEvent,
  importEvent
}
