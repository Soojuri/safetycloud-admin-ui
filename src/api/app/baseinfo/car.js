import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getCarInfoList = (params) => getAction('/baseinfo/tcarinfo/page', params);
const getCarInfo = (id) => getAction("/baseinfo/tcarinfo/" + id);
const addCarInfo = (params) => postAction("/baseinfo/tcarinfo", params);
const delCarInfo = (id) => deleteAction('/baseinfo/tcarinfo/' + id);
const putCarInfo = (params) => putAction('/baseinfo/tcarinfo/', params);
export {
  getCarInfoList,
  getCarInfo,
  addCarInfo,
  delCarInfo,
  putCarInfo,
}
