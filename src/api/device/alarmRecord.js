
import request from '@/router/axios'




//新增规则引擎代码
export function postObj (query) {
    return request({
        url: '​/ruleEngine​/ruleDevAlarmHistory',
        method: 'post',
        data: query
    })
}




//修改规则引擎代码
export function putObj (query) {
    return request({
        url: '/ruleEngine​/ruleDevAlarmHistory',
        method: 'put',
        data: query
    })
}



//通过id查询
export function getObj (id) {
    return request({
        url: '​/ruleEngine​/ruleDevAlarmHistory​/' + id,
        method: 'get'
    })
}




//通过id删除规则引擎代码
export function delObj (id) {
    return request({
        url: '/ruleEngine​/ruleDevAlarmHistory​/' + id,
        method: 'delete'
    })
}




//分页查询
export function getPage (query) {
    return request({
        url: '/ruleEngine/ruleDevAlarmHistory​/page',
        method: 'get',
        params: query
    })
}
