import {
  getAction,
  postAction
} from '@/api/manage'


// 增删改查

const getTimeConfig = () => getAction("/admin/sysconfig/getById");
const saveTimeConfig = (params) => postAction("/admin/sysconfig", params);
const testNtp = (params) => getAction('/admin/sysconfig/testNtp', params)

export {
  getTimeConfig,
  saveTimeConfig,
  testNtp
}
