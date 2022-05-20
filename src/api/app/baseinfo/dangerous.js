import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getDangerousList = (params) => getAction('/baseinfo/tdangerousgoods/page', params);
const getDangerous = (id) => getAction("/baseinfo/tdangerousgoods/" + id);
const addDangerous = (params) => postAction("/baseinfo/tdangerousgoods", params);
const delDangerous = (id) => deleteAction('/baseinfo/tdangerousgoods/' + id);
const putDangerous = (params) => putAction('/baseinfo/tdangerousgoods/', params);
export {
  getDangerousList,
  getDangerous,
  addDangerous,
  delDangerous,
  putDangerous,
}
