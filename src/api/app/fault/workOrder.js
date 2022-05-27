import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getWorkOrderList = (params) => getAction('/baseinfo/tDeviceWorkOrder/page', params);
const getWorkOrderInfo = (id) => getAction("/baseinfo/tDeviceWorkOrder/" + id);
const addWorkOrder = (params) => postAction("/baseinfo/tDeviceWorkOrder/", params);
const delWorkOrder = (id) => deleteAction('/baseinfo/tDeviceWorkOrder/' + id);
const putWorkOrder = (params) => putAction('/baseinfo/tDeviceWorkOrder/', params);

//查询目标设备列表
const getDeviceInfoList = (params) => getAction('/baseinfo/tdeviceinfo/getDeviceInfoList', params);

//完成工单
const complete = (params) => postAction("/baseinfo/tDeviceWorkOrder/complete", params);
//关闭工单
const closed = (id) => postAction(`/baseinfo/tDeviceWorkOrder/${id}/closed`);
//执行工单
const execute = (id) => postAction(`/baseinfo/tDeviceWorkOrder/${id}/execute`);
//接收工单
const receive = (id) => postAction(`/baseinfo/tDeviceWorkOrder/${id}/receive`);
//驳回工单
const reject = (id) => postAction(`/baseinfo/tDeviceWorkOrder/${id}/reject`);
//指派工单
const appoint = (id, executorUserId) => postAction(`/baseinfo/tDeviceWorkOrder/${id}/${executorUserId}/appoint`);

export {
  getWorkOrderList,
  getWorkOrderInfo,
  addWorkOrder,
  delWorkOrder,
  putWorkOrder,
  getDeviceInfoList,
  complete,
  closed,
  execute,
  receive,
  reject,
  appoint,
}
