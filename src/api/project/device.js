import request from "@/utils/request";

// 获取设备列表
export function getDeviceList(data) {
  return request({
    url: "/biz/device/list",
    method: "post",
    data,
  });
}

// 新增设备
export function addMethod(data) {
  return request({
    url: "/biz/device/add",
    method: "post",
    data,
  });
}

// 修改设备
export function editMethod(data) {
  return request({
    url: "/biz/device/edit",
    method: "post",
    data,
  });
}

// 删除设备
export function deleteMethod(data) {
  return request({
    url: "/biz/device/delete",
    method: "post",
    data,
  });
}
