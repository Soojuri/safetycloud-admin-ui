import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getDeviceVideoRecordList = (params) => getAction('/video/tdevicevideorecord/page', params);
const getDeviceVideoRecordInfo = (id) => getAction("/video/tdevicevideorecord/" + id);
const addDeviceVideoRecord = (params) => postAction("/video/tdevicevideorecord/", params);
const delDeviceVideoRecord = (id) => deleteAction('/video/tdevicevideorecord/' + id);
const putDeviceVideoRecord = (params) => putAction('/video/tdevicevideorecord/', params);
export {
  putDeviceVideoRecord,
  delDeviceVideoRecord,
  addDeviceVideoRecord,
  getDeviceVideoRecordInfo,
  getDeviceVideoRecordList,
}
