import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'


// 增删改查
const getTaskList = (params) => getAction('/iefVasService/videoAnalyseEdgTask/page', params);
const getTaskInfo = (id) => getAction("/iefVasService/videoAnalyseEdgTask/" + id);
const addTask = (params) => postAction("/iefVasService/videoAnalyseEdgTask", params);
const delTask = (id) => deleteAction('/iefVasService/videoAnalyseEdgTask/' + id);
const putTask = (params) => putAction('/iefVasService/videoAnalyseEdgTask', params);
// 启动作业
const startTask = (id) => getAction(`/iefVasService/videoAnalyseEdgTask/tasks/${id}/start`)
// 停止作业
const stopTask = (id) => getAction(`/iefVasService/videoAnalyseEdgTask/tasks/${id}/stop`)
// 启用作业
const enableTask = (id) => getAction(`/iefVasService/videoAnalyseEdgTask/tasks/${id}/enable`)
// 禁用作业
const disableTask = (id) => getAction(`/iefVasService/videoAnalyseEdgTask/tasks/${id}/disable`)
// 获取作业统计
const getTaskStatic = (params) => getAction('/iefVasService/videoAnalyseEdgTask/tasks/count', params)
//根据设备id分页查询作业列表
const getTaskInfoList = (params) => getAction("/iefVasService/videoAnalyseEdgTask/pageByDeviceId", params);
export {
  getTaskList,
  getTaskInfo,
  addTask,
  delTask,
  putTask,
  startTask,
  stopTask,
  getTaskStatic,
  getTaskInfoList,
  enableTask,
  disableTask
}
