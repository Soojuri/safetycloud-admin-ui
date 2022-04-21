import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'
const getCamera = (params) => getAction('/iefVasService/work/platform/camera/Statistics', params)
const getComputingResources = (params) => getAction('/iefVasService/work/platform/computingResources', params)
const getIntelligentRecognition = (params) => getAction('/iefVasService/work/platform/intelligentRecognition/Statistics', params)
const getAreaRank = (params) => getAction('/iefVasService/work/platform/task/areaRank', params)
const getTaskStatic = (params) => getAction('/iefVasService/work/platform/task/quantityStatistics', params)
const getAlgoStatic = (params) => getAction('/iefVasService/work/platform/algorithmStatistics', params)
export {
  getCamera,
  getComputingResources,
  getIntelligentRecognition,
  getAreaRank,
  getTaskStatic,
  getAlgoStatic
}
