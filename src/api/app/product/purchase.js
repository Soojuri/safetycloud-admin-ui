import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getPurchaseList = (params) => getAction('/productOrder/tProductOrderRecord/page', params);
const getPurchaseInfo = (id) => getAction("/productOrder/tProductOrderRecord/" + id);
const addPurchase = (params) => postAction("/productOrder/tProductOrderRecord/", params);
const delPurchase = (id) => deleteAction('/productOrder/tProductOrderRecord/' + id);
const putPurchase = (params) => putAction('/productOrder/tProductOrderRecord/', params);

export {
  getPurchaseList,
  getPurchaseInfo,
  addPurchase,
  delPurchase,
  putPurchase
}
