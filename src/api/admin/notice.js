import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getNoticeList = (params) => getAction('/admin/sysnotice/page', params);
const getNoticeInfo = (id) => getAction("/admin/sysnotice/" + id);
const addNotice = (params) => postAction("/admin/sysnotice", params);
const delNotice = (id) => deleteAction('/admin/sysnotice/' + id);
const putNotice = (params) => putAction('/admin/sysnotice', params);

export {
  getNoticeList,
  getNoticeInfo,
  addNotice,
  delNotice,
  putNotice
}
