import {
  getAction,
  deleteAction,
  putAction,
  postAction,
  httpAction
} from "@/api/manage";
//部门管理
const getDeptTree = (params) => getAction("/admin/dept/tree", params)
const getDeptInfo = (id) => getAction("/admin/dept/" + id)
const addDept = (params) => postAction("/admin/dept/", params)

export {
  getDeptTree,
  getDeptInfo,
  addDept
}
