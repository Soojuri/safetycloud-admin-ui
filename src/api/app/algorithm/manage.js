import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getManageList = (params) => getAction('/iefVasService/tVideoAnalyseAlgorithm/page', params);
const getManageInfo = (id) => getAction("/iefVasService/tVideoAnalyseAlgorithm/" + id);
const addManage = (params) => postAction("/iefVasService/tVideoAnalyseAlgorithm", params);
const delManage = (id) => deleteAction('/iefVasService/tVideoAnalyseAlgorithm/' + id);
const putManage = (params) => putAction('/iefVasService/tVideoAnalyseAlgorithm', params);

//获取算法管理统计
const getCount = (params) => getAction('/iefVasService/tVideoAnalyseAlgorithm/count', params);
//根据订单id分页查询
const getListByOrderId = (params) => getAction('/iefVasService/tVideoAnalyseAlgorithm/pageByOrderId', params);

//根据算法id获取订单列表
const getOrderList = (params) => getAction('/iefVasService/tvideoanalysealgorithmpackageorder/getByAlgorithmId/', params);
export {
  getManageList,
  getManageInfo,
  addManage,
  delManage,
  putManage,
  getCount,
  getListByOrderId,
  getOrderList
}
