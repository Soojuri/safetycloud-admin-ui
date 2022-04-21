import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getDeviceVideoCaptureList = (params) => getAction('/video/tdevicevideocapture/page', params);
const getDeviceVideoCaptureInfo = (id) => getAction("/video/tdevicevideocapture/" + id);
const addDeviceVideoCapture = (params) => postAction("/video/tdevicevideocapture/", params);
const delDeviceVideoCapture = (id) => deleteAction('/video/tdevicevideocapture/' + id);
const putDeviceVideoCapture = (params) => putAction('/video/tdevicevideocapture/', params);

export {
  putDeviceVideoCapture,
  delDeviceVideoCapture,
  addDeviceVideoCapture,
  getDeviceVideoCaptureInfo,
  getDeviceVideoCaptureList
}
