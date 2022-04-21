import {
  getAction,
  deleteAction,
  putAction,
  postAction
} from '@/api/manage'

// 增删改查
const getPoolList = (params) => getAction('/iefVasService/tvideoanalyseedgepool/page', params);
const getPoolInfo = (id) => getAction("/iefVasService/tvideoanalyseedgepool/" + id);
const addPool = (params) => postAction("/iefVasService/tvideoanalyseedgepool", params);
const delPool = (id) => deleteAction('/iefVasService/tvideoanalyseedgepool/' + id);
const putPool = (params) => putAction('/iefVasService/tvideoanalyseedgepool', params);

export {
  getPoolList,
  getPoolInfo,
  addPool,
  delPool,
  putPool,
}
