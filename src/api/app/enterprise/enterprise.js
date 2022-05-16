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

//企业证照信息表
const getEnterpriseInfoCertificateList = (params) => getAction('/baseinfo/tenterpriseinfocertificate/page', params);
const getEnterpriseInfoCertificate = (id) => getAction("/baseinfo/tenterpriseinfocertificate/" + id);
const addEnterpriseInfoCertificate = (params) => postAction("/baseinfo/tenterpriseinfocertificate", params);
const delEnterpriseInfoCertificate = (id) => deleteAction('/baseinfo/tenterpriseinfocertificate/' + id);
const putEnterpriseInfoCertificate = (params) => putAction('/baseinfo/tenterpriseinfocertificate/', params);

export {
  getEnterprise,
  addEnterprise,
  delEnterprise,
  putEnterprise,
  getEnterpriseList,
  getEnterpriseInfoCertificateList,
  getEnterpriseInfoCertificate,
  addEnterpriseInfoCertificate,
  delEnterpriseInfoCertificate,
  putEnterpriseInfoCertificate,
}
