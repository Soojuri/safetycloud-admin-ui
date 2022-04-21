import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

const getSpaceAreaTree = (params) => getAction('/video/tvideospace/getAreaTree', params)
// 获取行政区域树
const getAreaTree = (params) => getAction('/admin/tadministrativeregion/tree', params);
// 根据Pid获取行政区域
const getAreaListByPid = (params) => getAction('/admin/tadministrativeregion/getListByPid', params);
// 增删改查
const getSpaceList = (params) => getAction('/video/tvideospace/page', params);
const getSpaceInfo = (id) => getAction("/video/tvideospace/" + id);
const addSpace = (params) => postAction("/video/tvideospace/", params);
const delSpace = (id) => deleteAction('/video/tvideospace/' + id);
const putSpace = (params) => putAction('/video/tvideospace/', params);
const getSpaceRate = (params) => getAction('/video/tvideospace/getSpaceOfflineProportion', params)

export {
  getAreaTree,
  getAreaListByPid,
  getSpaceList,
  getSpaceInfo,
  addSpace,
  delSpace,
  putSpace,
  getSpaceAreaTree,
  getSpaceRate
}
