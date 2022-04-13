import request from "@/router/axios";

// 故障工单派单
export function sentWorkOrder(data) {
  return request({
    url: "/device/tdevicefaultworkorder/sent",
    method: "post",
    data: data
  });
}

// 根据业务记录表查询工单详情
export function getInfoByBusinessId(id) {
  return request({
    url: "/device/tdevicefaultworkorder/" + id,
    method: "get"
  });
}

// 已完成工单查询
export function getList(params) {
  return request({
    url: "/device/tdevicefaultworkorder/finishOrderList",
    method: "get",
    params: params
  });
}

//待办工单查询
export function getTodoList(query) {
  return request({
    url: "​/device/tdevicefaultworkorder​/getTodoList",
    method: "get",
    params: query
  });
}

// 工单详情查询
export function getDTOInfo(id) {
  return request({
    url: "/device/tdevicefaultworkorder/" + id,
    method: "get"
  });
}

// 工单状态统计
export function countOrderByStatus() {
  return request({
    url: "/workOrder/countOrderByStatus",
    method: "get"
  });
}

//维修确认
export function repairConfirm(query) {
  return request({
    url: "/device/tdevicefaultrecordmaintenance/repairConfirm",
    method: "post",
    data: query
  });
}
