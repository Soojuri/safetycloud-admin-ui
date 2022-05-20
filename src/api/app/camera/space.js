import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

const getSpaceAreaTree = (params) => getAction('/baseinfo/tdevicespace/getAreaTree', params)
// 获取行政区域树
const getAreaTree = (params) => getAction('/admin/tadministrativeregion/tree', params);
// 根据Pid获取行政区域
const getAreaListByPid = (params) => getAction('/admin/tadministrativeregion/getListByPid', params);
// 增删改查
const getSpaceList = (params) => getAction('/baseinfo/tdevicespace/page', params);
const getSpaceInfo = (id) => getAction("/baseinfo/tdevicespace/" + id);
const addSpace = (params) => postAction("/baseinfo/tdevicespace/", params);
const delSpace = (id) => deleteAction('/baseinfo/tdevicespace/' + id);
const putSpace = (params) => putAction('/baseinfo/tdevicespace/', params);
const getSpaceRate = (params) => getAction('/baseinfo/tdevicespace/getSpaceOfflineProportion', params)

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
