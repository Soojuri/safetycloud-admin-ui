import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getEdgeDeviceList = (params) => getAction('/iefVasService/tvideoanalyseedgedevice/page', params);
const getEdgeDeviceInfo = (id) => getAction("/iefVasService/tvideoanalyseedgedevice/" + id);
const addEdgeDevice = (params) => postAction("/iefVasService/tvideoanalyseedgedevice/", params);
const delEdgeDevice = (id) => deleteAction('/iefVasService/tvideoanalyseedgedevice/' + id);
const putEdgeDevice = (params) => postAction('/iefVasService/tvideoanalyseedgedevice/updateDevice/' + params.id, params);
// 新增边缘设备标签
const addEdgeTag = (params) => postAction('/iefVasService/edge/tag/batchUpdateDeviceTag/' + params.edgeDeviceId, params)
// 获取标签列表
const getTagList = (params) => postAction('/iefVasService/edge/tag/queryProjectDeviceTag', params)
// 获取节点列表
const getNodeList = (params) => getAction('/iefVasService/edge/node/getNodeList', params)
// 绑定节点
const putNodeBind = (params) => putAction('/iefVasService/tvideoanalyseedgedevice/updateDeviceNode/' + params.edgeDeviceId, params)
// 查询设备标签
const getTagByDeviceId = (id) => postAction('/iefVasService/edge/tag/queryDeviceTag/' + id)
// 获取未绑定设备
const getEdgeUnbindDeviceList = (params) => getAction('/iefVasService/tvideoanalyseedgedevice/unbindList', params)
export {
  getEdgeDeviceList,
  getEdgeDeviceInfo,
  addEdgeDevice,
  delEdgeDevice,
  putEdgeDevice,
  addEdgeTag,
  getTagList,
  getNodeList,
  putNodeBind,
  getTagByDeviceId,
  getEdgeUnbindDeviceList
}
