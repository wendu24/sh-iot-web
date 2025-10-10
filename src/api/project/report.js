import request from "@/utils/request";

// 获取udp数据
export function getUdpList(data) {
  return request({
    url: "/data/recent/udp/list",
    method: "post",
    data,
  });
}

// 获取mqtt数据
export function getMqttList(data) {
  return request({
    url: "/data/recent/mqtt/list",
    method: "post",
    data,
  });
}