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
    url: "/biz/device/update",
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

// 修改其他信息
export function editOtherInfoMethod(data) {
  return request({
    url: "/biz/device/public-msg",
    method: "post",
    data,
  });
}

// 查看数据信息
export function viewInfoMethod(url) {
  return request({
    url: `/data/latest/${url}`,
    method: "get",
  });
}
