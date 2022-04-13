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
    url: "/device/systemalertevent/page",
    method: "get",
    params: query
  });
}

export function addObj(obj) {
  return request({
    url: "/device/systemalertevent",
    method: "post",
    data: obj
  });
}

export function getObj(id) {
  return request({
    url: "/device/systemalertevent/" + id,
    method: "get"
  });
}

export function delObj(id) {
  return request({
    url: "/device/systemalertevent/" + id,
    method: "delete"
  });
}

export function putObj(obj) {
  return request({
    url: "/device/systemalertevent",
    method: "put",
    data: obj
  });
}

//通过告警类别获取事件
export function getEventsByAlertType(query) {
  return request({
    url: "/device/systemalertevent/getByAlertType",
    method: "get",
    params: query
  });
}
