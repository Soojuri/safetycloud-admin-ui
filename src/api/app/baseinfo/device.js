import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getDeviceInfoList = (params) => getAction('/baseinfo/tdeviceinfo/page', params);
const getProductList = (params) => getAction('/baseinfo/tdeviceinfo/getProductList', params);
const getDeviceInfo = (id) => getAction("/baseinfo/tdeviceinfo/" + id);
const addDeviceInfo = (params) => postAction("/baseinfo/tdeviceinfo", params);
const delDeviceInfo = (id) => deleteAction('/baseinfo/tdeviceinfo/' + id);
const putDeviceInfo = (params) => putAction('/baseinfo/tdeviceinfo/', params);

export {
  getDeviceInfoList,
  getProductList,
  getDeviceInfo,
  addDeviceInfo,
  delDeviceInfo,
  putDeviceInfo,
}
