import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getNodeList = (params) => getAction('/iefVasService/edge/node/getNodeList', params);
const getNodeInfo = (id) => getAction("/iefVasService/edge/node/getNodeDetail/" + id);
const registerNode = (params) => postAction("/iefVasService/edge/node/registerNode", params);
const delNode = (id) => getAction('/iefVasService/edge/node/delete/' + id);
const updateNode = (params) => putAction('/iefVasService/edge/node/updateNode/' + params.id, params);
// 启用/停用节点
const operateNode = (params) => postAction('/iefVasService/edge/node/action/' + params.id, params)

const updateDevices = (params) => putAction('/iefVasService/edge/node/updateDevices/' + params.id, params)
//获取边缘设备列表
const getNodeDeviceList = (params) => getAction('/iefVasService/edge/device/getDevices', params);
export {
  getNodeList,
  getNodeInfo,
  registerNode,
  delNode,
  updateNode,
  operateNode,
  updateDevices,
  getNodeDeviceList
}
