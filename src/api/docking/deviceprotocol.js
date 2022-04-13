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
    url: '/device/tdeviceprotocol/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/device/tdeviceprotocol',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/device/tdeviceprotocol/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/device/tdeviceprotocol/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/device/tdeviceprotocol',
    method: 'put',
    data: obj
  })
}




//发布协议
export function deploy(id) {
  return request({
    url: '/device​/tdeviceprotocol​/' + id + '​/_deploy',
    method: 'post',
  })
}

//取消发布
export function undeploy(id) {
  return request({
    url: '/device​/tdeviceprotocol​/' + id + '​/_un-deploy',
    method: 'post',
  })
}




//解码调试
export function decode(data) {
  return request({
    url: '/device​/tdeviceprotocol​/decode',
    method: 'post',
    data
  })
}





//编码调试
export function encode(data) {
  return request({
    url: '/device​/tdeviceprotocol​/encode',
    method: 'post',
    data
  })
}

//获取协议详情
export function convert(data) {
  return request({
    url: '/device/tdeviceprotocol​/convert',
    method: 'post',
    data
  })
}
