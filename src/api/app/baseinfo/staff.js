import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getStaffInfoList = (params) => getAction('/baseinfo/tstaffinfo/page', params);
const getStaffInfo = (id) => getAction("/baseinfo/tstaffinfo/" + id);
const addStaffInfo = (params) => postAction("/baseinfo/tstaffinfo", params);
const delStaffInfo = (id) => deleteAction('/baseinfo/tstaffinfo/' + id);
const putStaffInfo = (params) => putAction('/baseinfo/tstaffinfo/', params);
export {
  getStaffInfoList,
  getStaffInfo,
  addStaffInfo,
  delStaffInfo,
  putStaffInfo,
}
