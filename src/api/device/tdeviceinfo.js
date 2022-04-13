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
    url: '/device/tdeviceinfo/page',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/device/tdeviceinfo',
    method: 'post',
    data: obj
  })
}

export function getObj (id) {
  return request({
    url: '/device/tdeviceinfo/' + id,
    method: 'get'
  })
}

export function delObj (id) {
  return request({
    url: '/device/tdeviceinfo/' + id,
    method: 'delete'
  })
}

export function putObj (obj) {
  return request({
    url: '/device/tdeviceinfo',
    method: 'put',
    data: obj
  })
}

// 根据父节点ID 查询所有子集列表
export function getChildrenNodes (id) {
  return request({
    url: "/base/getChildrenNodes",
    method: "get",
    params: { "id": id }
  })
}

// 职能部门下教职工信息查询
export function deptList (params) {
  return request({
    url: "/base/staff/deptList",
    method: "get",
    params: params
  })
}