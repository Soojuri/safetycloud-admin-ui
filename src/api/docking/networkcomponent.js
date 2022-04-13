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

export function fetchList (query) {
  return request({
    url: '/device/tnetworkcomponent/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/device/tnetworkcomponent',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/device/tnetworkcomponent/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/device/tnetworkcomponent/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/device/tnetworkcomponent',
    method: 'put',
    data: obj
  })
}

//停止网络组件
export function shutdown (id) {
  return request({
    url: '​/device/tnetworkcomponent​/' + id + '​/_shutdown',
    method: 'post'
  })
}

//启动网络组件
export function start (id) {
  return request({
    url: '​/device/tnetworkcomponent​/' + id + '​/_start',
    method: 'post'
  })
}


//获取网络组件配置
export function getNetworkByWS () {
  return request({
    url: '/device/tnetworkcomponent/getNetworkByWS',
    method: 'get'
  })
}
