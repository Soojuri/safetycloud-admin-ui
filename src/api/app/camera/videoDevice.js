import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getVideoDeviceList = (params) => getAction('/video/tdevicevideo/page', params);
const getVideoDeviceInfo = (id) => getAction("/video/tdevicevideo/" + id);
const addVideoDevice = (params) => postAction("/video/tdevicevideo/", params);
const delVideoDevice = (id) => deleteAction('/video/tdevicevideo/' + id);
const putVideoDevice = (params) => putAction('/video/tdevicevideo/', params);

export {
  putVideoDevice,
  delVideoDevice,
  addVideoDevice,
  getVideoDeviceInfo,
  getVideoDeviceList
}
