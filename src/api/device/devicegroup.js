/*
 *    Copyright (c) 2018-2025, cloud All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: cloud
 */

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/device/tdevicegroup/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/device/tdevicegroup',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/device/tdevicegroup/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/device/tdevicegroup/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/device/tdevicegroup',
    method: 'put',
    data: obj
  })
}




//获取树形列表
export function getTree(obj) {
  return request({
    url: '/device/​tdevicegroup​/tree',
    method: 'get',
    params: obj
  })
}





//设备分组绑定设备
export function bind(query) {
  return request({
    url: '/device​/tdevicegroup​/bind',
    method: 'post',
    data: query
  })
}




//根据分组id获取绑定设备列表
export function getDeviceByGroupId(query) {
  return request({
    url: '/device​/tdevicegroup​/getDeviceByGroupId',
    method: 'post',
    data: query
  })
}





//设备分组解绑设备
export function unbind(query) {
  return request({
    url: '/device​/tdevicegroup​/unbind',
    method: 'post',
    data: query
  })
}
