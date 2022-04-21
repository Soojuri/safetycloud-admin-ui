import request from '@/router/axios'


//新增物联设备信息表
export function postObj(query) {
  return request({
    url: '/device​/tdeviceinfo',
    method: 'post',
    data: query
  })
}

//修改物联设备信息表
export function putObj(query) {
  return request({
    url: '/device​/tdeviceinfo',
    method: 'put',
    data: query
  })
}



//通过id查询
export function getObj(id) {
  return request({
    url: '/device/tdeviceinfo/' + id + '/detail',
    method: 'get',
  })
}


//通过id删除物联设备信息表
export function delObj(id) {
  return request({
    url: '/device​​/tdeviceinfo​/' + id,
    method: 'delete',
  })
}


//地理位置--设备分页查询
export function getAreaDeviceList(query) {
  return request({
    url: '/device/tdeviceinfo​/getAreaDeviceList',
    method: 'get',
    params: query
  })
}




//巡检策略-通过产品类型查询相关设备
export function getByClassifyId(query) {
  return request({
    url: '/device​/tdeviceinfo​/getByClassifyId',
    method: 'get',
    params: query
  })
}




//分页查询
export function fetchList(query) {
  return request({
    url: '/device​/tdeviceinfo​/page',
    method: 'get',
    params: query
  })
}




//设备汇总（在线，离线，未启用）
export function getStastics(query) {
  return request({
    url: '/device​/tdeviceinfo​/stastics',
    method: 'get',
    params: query
  })
}




//激活指定ID设备
export function deploy(id) {
  return request({
    url: '​/device​/tdeviceinfo​/' + id + '/deploy',
    method: 'post'
  })
}

//注销指定ID设备
export function undeploy(id) {
  return request({
    url: '​/device​/tdeviceinfo​/' + id + '/undeploy',
    method: 'post'
  })
}




//获取标准设备属性
export function getStandardPorper(query) {
  return request({
    url: '​/device/tdeviceinfo​/standard​/' + query.deviceId + '/property​/' + query.property,
    method: 'get'
  })
}





//查询设备日志数据
export function getLogs(query) {
  return request({
    url: '/device/​tdeviceinfo​/' + query.deviceId + '/logs',
    method: 'get',
    params: query
  })
}




//查询设备日志数据 多条件
export function getLogList(query) {
  return request({
    url: '​/device/tdeviceinfo​/logs',
    method: 'get',
    params: query
  })
}



//发送调用设备功能指令到设备
export function startfun(deviceId, functionId, properties) {
  return request({
    url: '​/device/tdeviceinfo​/' + deviceId + '​/function​/' + functionId,
    method: 'post',
    data: {
      properties
    }
  })
}



//批量获取仪表数据
export function _multi(query) {
  return request({
    url: '/device/dashboard/_multi',
    method: 'post',
    data: query
  })
}



//获取物模型数据
export function getProperties(query) {
  return request({
    url: '/device/tdeviceinfo/getProperties',
    method: 'get',
    params: query
  })
}

//获取物模型数据
export function getPropertiesById(query) {
  return request({
    url: '/device/tdeviceinfo/getPropertiesById',
    method: 'get',
    params: query
  })
}


//获取指定ID设备在线状态
export function getState(id) {
  return request({
    url: `/device/tdeviceinfo/${id}/state`,
    method: 'get'
  })
}



//发送设置属性指令到设备
export function setProperty(query) {
  return request({
    url: '/device/tdeviceinfo/' + query.deviceId + '/property',
    method: 'put',
    data: query.params
  })
}




//查询设备事件数据
export function getEvents(query) {
  return request({
    url: `/device/tdeviceinfo​/${query.deviceId}​/event​/${query.eventId}`,
    method: 'get',
    params: {
      format: query.format,
      size: query.size,
      current: query.current
    }
  })
}

//获取可以绑定的子设备列表
export function getBindDeviceList(query) {
  return request({
    url: '/device​/tdeviceinfo​/getBindDeviceList',
    method: 'get',
    params: query
  })
}

//刷新指定ID设备
export function refresh(id) {
  return request({
    url: `/device​/tdeviceinfo​/${id}​/refresh`,
    method: 'post'
  })
}
