import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getProductOrderList = (params) => getAction('/productOrder/tProductOrder/page', params);
const getProductOrderInfo = (id) => getAction("/productOrder/tProductOrder/" + id);
const addProductOrder = (params) => postAction("/productOrder/tProductOrder/", params);
const delProductOrder = (id) => deleteAction('/productOrder/tProductOrder/' + id);
const putProductOrder = (params) => putAction('/productOrder/tProductOrder/', params);
const pay = (params)=>postAction("/productOrder/pay/initiatePayment",params)
const queryPayStatus = (id)=>getAction("/productOrder/pay/wechatPayQueryOrder?orderCode="+id)

export {
  getProductOrderList,
  getProductOrderInfo,
  addProductOrder,
  delProductOrder,
  putProductOrder,
  pay,
  queryPayStatus
}
