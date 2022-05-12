import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getEnterpriseList = (params) => getAction('/baseinfo/tenterpriseinfo/page', params);
const getEnterprise = (id) => getAction("/baseinfo/tenterpriseinfo/" + id);
const addEnterprise = (params) => postAction("/baseinfo/tenterpriseinfo", params);
const delEnterprise = (id) => deleteAction('/baseinfo/tenterpriseinfo/' + id);
const putEnterprise = (params) => putAction('/baseinfo/tenterpriseinfo/', params);

//企业机构信息表

export {
  getEnterprise,
  addEnterprise,
  delEnterprise,
  putEnterprise,
  getEnterpriseList,
}
