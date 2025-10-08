import request from "@/utils/request";

// 获取小区列表
export function getCommunityList(data) {
  return request({
    url: "/biz/community/list",
    method: "post",
    data,
  });
}

// 新增小区
export function addMethod(data) {
  return request({
    url: "/biz/community/add",
    method: "post",
    data,
  });
}

// 修改小区
export function editMethod(data) {
  return request({
    url: "/biz/community/edit",
    method: "post",
    data,
  });
}

// 删除小区
export function deleteMethod(data) {
  return request({
    url: "/biz/community/delete",
    method: "post",
    data,
  });
}
