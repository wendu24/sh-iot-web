import request from "@/utils/request";

// 获取数据列表
export function getSetreplyList(data) {
  return request({
    url: "/biz/msg/set-reply/list",
    method: "post",
    data,
  });
}