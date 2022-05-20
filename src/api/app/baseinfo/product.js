import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getProductList = (params) => getAction('/baseinfo/tdeviceproduct/page', params);
const getProduct = (id) => getAction("/baseinfo/tdeviceproduct/" + id);
const addProduct = (params) => postAction("/baseinfo/tdeviceproduct", params);
const delProduct = (id) => deleteAction('/baseinfo/tdeviceproduct/' + id);
const putProduct = (params) => putAction('/baseinfo/tdeviceproduct/', params);

export {
  getProductList,
  getProduct,
  addProduct,
  delProduct,
  putProduct,
}
