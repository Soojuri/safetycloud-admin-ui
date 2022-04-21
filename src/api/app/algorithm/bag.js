import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getAlgorithmList = (params) => getAction('/iefVasService/tvideoanalysealgorithmpackage/page', params);
const getAlgorithmInfo = (id) => getAction("/iefVasService/tvideoanalysealgorithmpackage/" + id);
const addAlgorithm = (params) => postAction("/iefVasService/tvideoanalysealgorithmpackage", params);
const delAlgorithm = (id) => deleteAction('/iefVasService/tvideoanalysealgorithmpackage/' + id);
const putAlgorithm = (params) => putAction('/iefVasService/tvideoanalysealgorithmpackage', params);

//视频算法分类关联购买订单信息 增删改查
const getOrderList = (params) => getAction('/iefVasService/tvideoanalysealgorithmpackageorder/page', params);
const getOrderInfo = (id) => getAction("/iefVasService/tvideoanalysealgorithmpackageorder/" + id);
const addOrder = (params) => postAction("/iefVasService/tvideoanalysealgorithmpackageorder", params);
const delOrder = (id) => deleteAction('/iefVasService/tvideoanalysealgorithmpackageorder/' + id);
const putOrder = (params) => putAction('/iefVasService/tvideoanalysealgorithmpackageorder', params);

export {
  getAlgorithmList,
  getAlgorithmInfo,
  addAlgorithm,
  delAlgorithm,
  putAlgorithm,
  getOrderList,
  getOrderInfo,
  addOrder,
  delOrder,
  putOrder
}
