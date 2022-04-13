import request from '@/router/axios'




//新增设备告警
export function postObj (query) {
    return request({
        url: '/ruleEngine​/ruleDevAlarm',
        method: 'post',
        data: query
    })
}




//修改设备告警
export function putObj (query) {
    return request({
        url: '/ruleEngine​/ruleDevAlarm',
        method: 'put',
        data: query
    })
}




//通过id查询
export function getObj (id) {
    return request({
        url: '/ruleEngine​/ruleDevAlarm​/' + id,
        method: 'get'
    })
}


//通过id删除设备告警
export function delObj (id) {
    return request({
        url: '/ruleEngine​/ruleDevAlarm​/' + id,
        method: 'delete'
    })
}





//分页查询根据设备id或产品id获取告警配置列表
export function getAlarmRulePage (query) {
    return request({
        url: '​/ruleEngine​/ruleDevAlarm​/alarmRulePage',
        method: 'get',
        params: query
    })
}




//分页查询
export function getPage (query) {
    return request({
        url: '​/ruleEngine​/ruleDevAlarm​/page',
        method: 'get',
        params: query
    })
}




//启动规则
export function startRule (query) {
    return request({
        url: '/ruleEngine​/ruleDevAlarm​/startRule',
        method: 'get',
        params: query
    })
}

//停止规则
export function stopRule (query) {
    return request({
        url: '/ruleEngine​/ruleDevAlarm​/stopRule',
        method: 'get',
        params: query
    })
}


//通过产品或设备id删除设备告警
export function delTarget (id) {
    return request({
        url: '​/ruleEngine​/ruleDevAlarm​/target​/' + id,
        method: 'delete'
    })
}
