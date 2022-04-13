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

import request from "@/router/axios";

export function fetchList(query) {
  return request({
    url: "/device/tsystemalertrecord/page",
    method: "get",
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: "/device/tsystemalertrecord",
    method: "post",
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: "/device/tsystemalertrecord/" + id,
    method: "get"
  });
}

export function delObj(id) {
  return request({
    url: "/device/tsystemalertrecord/" + id,
    method: "delete"
  });
}

export function putObj(obj) {
  return request({
    url: "/device/tsystemalertrecord",
    method: "put",
    data: obj
  });
}

//处理预警
export function dealAlert(query) {
  return request({
    url: "/device​/tsystemalertrecord​/dealAlert",
    method: "put",
    data: query
  });
}

//误报
export function falseFault(query) {
  return request({
    url: "/device​/tsystemalertrecord​/falseFault",
    method: "put",
    data: query
  });
}
