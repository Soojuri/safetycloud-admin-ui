import request from '@/router/axios'




//设备告警信息
export function deviceAlarmCondition(query) {
  return request({
    url: '/device​/home​/deviceAlarmCondition',
    method: 'get',
    params: query
  })
}




//物联产品排名
export function deviceProductRanking(query) {
  return request({
    url: '/device​/home​/deviceProductRanking',
    method: 'get',
    params: query
  })
}



//各物联产品占比
export function deviceProductRatio(query) {
  return request({
    url: '/device​/home​/deviceProductRatio',
    method: 'get',
    params: query
  })
}



//创建/激活设备趋势
export function getDeviceTrend(query) {
  return request({
    url: '/device​/home​/getDeviceTrend',
    method: 'get',
    params: query
  })
}




//获取首页首行统计数据
export function homeStastics(query) {
  return request({
    url: '/device​/home​/homeStastics',
    method: 'get',
    params: query
  })
}




//网络组件类别占比 0停止状态 1启动状态
export function netComponentProportion(query) {
  return request({
    url: '/device​/home​/netComponentProportion',
    method: 'get',
    params: query
  })
}


//产品数量分布
export function getProductStatistics(query) {
  return request({
    url: '/device/opsPlate/getProductStatistics',
    method: 'get',
    params: query
  })
}


//24小时消息量
export function getSystemMessageTrend(query) {
  return request({
    url: '/bigdata/statistics/getSystemMessageTrend',
    method: 'get',
    params: query
  })
}


//设备在线率
export function getDeviceOnlineRate(query) {
  return request({
    url: '/device/opsPlate/getDeviceOnlineRate',
    method: 'get',
    params: query
  })
}


//市级在线排名top5
export function getOnlineCityRanking(query) {
  return request({
    url: '/device/opsPlate/getOnlineCityRanking',
    method: 'get',
    params: query
  })
}



//发送到平台的消息量(接收)received_message平台发送的消息量(发送)sent_message
export function getMessageByDay(type) {
  return request({
    url: '/bigdata/statistics/getMessageByDay/' + type,
    method: 'get'
  })
}


//物联产品消息
export function getMessageByProduct(query) {
  return request({
    url: '/bigdata/statistics/getMessageByProduct',
    method: 'get',
    params: query
  })
}


//累计在线设备数
export function getOnlineDeviceByMonth(query) {
  return request({
    url: '/bigdata/statistics/getOnlineDeviceByMonth',
    method: 'get',
    params: query
  })
}





//24小时消息通信趋势(上行)
export function getSendMessageTrend(query) {
  return request({
    url: '/bigdata​/statistics​/getSendMessageTrend',
    method: 'get',
    params: query
  })
}


//24小时消息通信趋势(下行)
export function getReceivedMessageTrend(query) {
  return request({
    url: '/bigdata​/statistics/getReceivedMessageTrend',
    method: 'get',
    params: query
  })
}





//七日事件上报TOP5设备
export function getEventNumByDevice() {
  return request({
    url: '/bigdata​/statistics​/getEventNumByDevice',
    method: 'get'
  })
}




//七日事件上报TOP5事件
export function getEventNumByType() {
  return request({
    url: '/bigdata/statistics​/getEventNumByType',
    method: 'get'
  })
}





//统计7日设备消息量
export function getMessageCountByWeek(query) {
  return request({
    url: '/bigdata​/statistics​/getMessageCountByWeek',
    method: 'get'
  })
}




//七日事件消息量
export function getEventCountByWeek(query) {
  return request({
    url: '/bigdata​/statistics​/getEventCountByWeek',
    method: 'get'
  })
}

//七天在线设备数
export function getDeviceStatusByWeek() {
  return request({
    url: '/bigdata​/statistics​/getDeviceStatusByWeek',
    method: 'get'
  })
}
