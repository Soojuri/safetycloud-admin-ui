import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getFaultRecordList = (params) => getAction('/baseinfo/tDeviceFaultRecord/page', params);
const getFaultRecordInfo = (id) => getAction("/baseinfo/tDeviceFaultRecord/" + id);
const addFaultRecord = (params) => postAction("/baseinfo/tDeviceFaultRecord/", params);
const delFaultRecord = (id) => deleteAction('/baseinfo/tDeviceFaultRecord/' + id);
const putFaultRecord = (params) => putAction('/baseinfo/tDeviceFaultRecord/', params);

//指派人员
const assignedPersonnel = (params) => postAction("/baseinfo/tDeviceFaultRecord/assignedPersonnel/", params);

export {
  getFaultRecordList,
  getFaultRecordInfo,
  addFaultRecord,
  delFaultRecord,
  putFaultRecord,
  assignedPersonnel
}
