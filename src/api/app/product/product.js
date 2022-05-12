import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getProductList = (params) => getAction('/productOrder/tProductInfo/page', params);
const getProductInfo = (id) => getAction("/productOrder/tProductInfo/" + id);
const addProduct = (params) => postAction("/productOrder/tProductInfo/", params);
const delProduct = (id) => deleteAction('/productOrder/tProductInfo/' + id);
const putProduct = (params) => putAction('/productOrder/tProductInfo/', params);

export {
  getProductList,
  getProductInfo,
  addProduct,
  delProduct,
  putProduct
}
