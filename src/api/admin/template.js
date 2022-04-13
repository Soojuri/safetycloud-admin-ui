import request from '@/router/axios'



//新增导入文件模板信息表
export function addTemplate(data) {
  return request({
    url: '/admin​/systemplate',
    method: 'post',
    data
  })
}




//修改导入文件模板信息表
export function putTemplate(data) {
  return request({
    url: '/admin​/systemplate',
    method: 'put',
    data
  })
}


//通过id查询
export function getTemplateInfo(id) {
  return request({
    url: `/admin/systemplate​/${id}`,
    method: 'get'
  })
}




//通过id删除导入文件模板信息表
export function delTemplate(id) {
  return request({
    url: `/admin/systemplate​/${id}`,
    method: 'delete'
  })
}




//通过模板名称获取模板文件
export function getTemplateFile(templateName) {
  return request({
    url: `/admin​/systemplate​/${templateName}`,
    method: 'get'
  })
}




//分页查询
export function getTemplateList(params) {
  return request({
    url: '/admin​/systemplate​/page',
    method: 'get',
    params
  })
}




//上传文件
export function uploadTemplateFile(data) {
  return request({
    url: '/admin​/systemplate​/upload',
    method: 'post',
    data
  })
}
