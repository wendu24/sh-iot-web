import request from "@/utils/request";

// 获取小区列表
export function getCommunityList(data) {
  return request({
    url: "/biz/community/list",
    method: "post",
    data,
  });
}

// 获取概览
export function getOverview(data) {
  return request({
    url: "/home/overview",
    method: "post",
    data,
  });
}

// 获取室温24小时数据
export function getRoomDataThirtyDays(data) {
  return request({
    url: "/home/roomDataThirtyDays",
    method: "post",
    data,
  });
}

// 获取室内温度前五和后五的小区数据
export function getTop5TemperatureCommunity(data) {
  return request({
    url: "/home/top5TemperatureCommunity",
    method: "post",
    data,
  });
}

// 获取同一室温下，供水温度，供水压力，阀门开度等数据
export function getScatterChart(data) {
  return request({
    url: "/home/scatterChart",
    method: "post",
    data,
  });
}

// 供水水温/回水水温折线图数据
export function getWaterTemperatureChart(data) {
  return request({
    url: "/home/waterTemperatureAndHour",
    method: "post",
    data,
  });
}
