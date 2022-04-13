import request from '@/router/axios'



//新增规则编排实例
export function addObj(query) {
  return request({
    url: '/ruleEngine​/ruleInstance',
    method: 'post',
    data: query
  })
}



//修改规则编排实例
export function putObj(query) {
  return request({
    url: '/ruleEngine​/ruleInstance',
    method: 'put',
    data: query
  })
}


//通过id查询
export function getObj(id) {
  return request({
    url: '/ruleEngine​/ruleInstance/' + id,
    method: 'get'
  })
}


//删除规则实例
export function delObj(id) {
  return request({
    url: '/ruleEngine​/ruleInstance/delete/' + id,
    method: 'delete'
  })
}




//node-red点击部署后更新流程接口
export function deploy(query) {
  return request({
    url: '​/ruleEngine​/ruleInstance​/deploy',
    method: 'post',
    data: query
  })
}




//分页查询
export function getPage(query) {
  return request({
    url: '​/ruleEngine​/ruleInstance​/page',
    method: 'get',
    params: query
  })
}




//启动规则实例
export function start(id) {
  return request({
    url: '​/ruleEngine​/ruleInstance​/start​/' + id,
    method: 'get'
  })
}


//停止规则实例
export function stop(id) {
  return request({
    url: '​/ruleEngine​/ruleInstance​/stop/' + id,
    method: 'get'
  })
}


//查询7日告警数量趋势
export function getAlarmByWeek() {
  return request({
    url: '/ruleEngine​/ruleDevAlarmHistory​/getAlarmByWeek',
    method: 'get'
  })
}




//查询告警数量趋势
export function getAlarmByMonth() {
  return request({
    url: '/ruleEngine​/ruleDevAlarmHistory​/getAlarmByMonth',
    method: 'get'
  })
}
