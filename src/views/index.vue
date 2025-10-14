<template>
  <div class="home-container">
    <div class="top-info-container">
      <img class="top-title" src="@/assets/home/home_top_title.svg" />
      <img class="top-bg" src="@/assets/home/home_top_bg.svg" />
    </div>

    <div class="home-search-container">
      <img class="img-aborn" src="@/assets/home/home_aborn.svg" />
      <el-form :inline="true" :model="form">
        <el-form-item label="小区">
          <el-select
            v-model="form.communityIds"
            popper-class="custom-select-dropdown"
            multiple
            filterable
            collapse-tags
            placeholder="请选择小区"
          >
            <el-option
              v-for="item of commuityList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="btn btn-left" @click="onReset">
            <img class="btn-img" src="@/assets/home/home_btn_reset.svg" />
            <span class="btn-text">重置</span>
          </div>
          <div class="btn btn-right" @click="onSubmit">
            <img class="btn-img" src="@/assets/home/home_btn_search.svg" />
            <span class="btn-text">查询</span>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="home-card-container">
      <div class="card-item-warpper">
        <img class="card-bg" src="@/assets/home/home_card.svg" />
        <img class="card-img" src="@/assets/home/community_2.svg" />
        <div class="card-text-wrapper">
          <div class="card-title">小区</div>
          <div class="card-desc">
            <span>{{ overviews.communityNum }}</span>
            <span>个</span>
          </div>
        </div>
      </div>
      <div class="card-item-warpper">
        <img class="card-bg" src="@/assets/home/home_card.svg" />
        <img class="card-img" src="@/assets/home/device_2.svg" />
        <div class="card-text-wrapper">
          <div class="card-title">设备数</div>
          <div class="card-right-wrapper">
            <span v-for="item of deviceNums" :key="item.id"
              >{{ item.name }}：{{ item.value }}个</span
            >
          </div>
        </div>
      </div>
      <div class="card-item-warpper">
        <img class="card-bg" src="@/assets/home/home_card.svg" />
        <img class="card-img" src="@/assets/home/abnormal-device_2.svg" />
        <div class="card-text-wrapper">
          <div class="card-title">异常设备</div>
          <div class="card-right-wrapper">
            <span v-for="item of abnormalDeviceNums" :key="item.id"
              >{{ item.name }}：{{ item.value }}个</span
            >
          </div>
        </div>
      </div>
      <div class="card-item-warpper">
        <img class="card-bg" src="@/assets/home/home_card.svg" />
        <img class="card-img" src="@/assets/home/temperature_2.svg" />
        <div class="card-text-wrapper">
          <div class="card-title">平均室温</div>
          <div class="card-desc">
            <span>{{ overviews.avgRoomTemperature }}</span>
            <span>个</span>
          </div>
        </div>
      </div>
      <div class="card-item-warpper">
        <img class="card-bg" src="@/assets/home/home_card.svg" />
        <img class="card-img" src="@/assets/home/valve_2.svg" />
        <div class="card-text-wrapper">
          <div class="card-title">平均阀门开度</div>
          <div class="card-desc">
            <span>{{ overviews.avgValvePosition }}</span>
            <span>个</span>
          </div>
        </div>
      </div>
    </div>

    <div class="echarts-wrapper">
      <div class="echarts-item">
        <img class="echarts-bg" src="@/assets/home/charts_bg.svg" />
        <div class="title-wrapper">
          <img class="title-icon" src="@/assets/home/echart_title_bg.svg" />
          <span>近30天平均室温与湿度</span>
        </div>
        <div ref="chart1" class="echart" style="height: 240px"></div>
      </div>
      <div class="echarts-item">
        <img class="echarts-bg" src="@/assets/home/charts_bg.svg" />
        <div class="title-wrapper">
          <img class="title-icon" src="@/assets/home/echart_title_bg.svg" />
          <span>近30天供水温度和回水温度</span>
        </div>
        <div ref="chart6" class="echart" style="height: 240px"></div>
      </div>
      <div class="echarts-item">
        <img class="echarts-bg" src="@/assets/home/charts_bg.svg" />
        <div class="title-wrapper">
          <img class="title-icon" src="@/assets/home/echart_title_bg.svg" />
          <span>近30天室温较高小区</span>
        </div>
        <div ref="chart2" class="echart" style="height: 240px"></div>
      </div>
      <div class="echarts-item">
        <img class="echarts-bg" src="@/assets/home/charts_bg.svg" />
        <div class="title-wrapper">
          <img class="title-icon" src="@/assets/home/echart_title_bg.svg" />
          <span>近30天室温较低小区</span>
        </div>
        <div ref="chart3" class="echart" style="height: 240px"></div>
      </div>
      <div class="echarts-item">
        <img class="echarts-bg" src="@/assets/home/charts_bg.svg" />
        <div class="title-wrapper">
          <img class="title-icon" src="@/assets/home/echart_title_bg.svg" />
          <span>阀门与室温散点图</span>
        </div>
        <div ref="chart4" class="echart" style="height: 240px"></div>
      </div>
      <div class="echarts-item">
        <img class="echarts-bg" src="@/assets/home/charts_bg.svg" />
        <div class="title-wrapper">
          <img class="title-icon" src="@/assets/home/echart_title_bg.svg" />
          <span>供水水温与室温散点图</span>
        </div>
        <div ref="chart5" class="echart" style="height: 240px"></div>
      </div>
    </div>
  </div>
</template>

<script setup name="Index">
import * as echarts from "echarts";
import { computed, reactive } from "vue";
import useAppStore from "@/store/modules/app";
import {
  getCommunityList,
  getOverview,
  getRoomDataThirtyDays,
  getTop5TemperatureCommunity,
  getScatterChart,
  getWaterTemperatureChart,
} from "@/api/home";
const commuityList = ref([]);
const overviews = ref({});
const form = reactive({
  communityIds: [],
});

const chart1 = ref(null);
const chart2 = ref(null);
const chart3 = ref(null);
const chart4 = ref(null);
const chart5 = ref(null);
const chart6 = ref(null);

const deviceNums = computed(() => {
  const list = [];
  if (overviews.value.deviceTypeNum) {
    Object.keys(overviews.value.deviceTypeNum).forEach((item) => {
      if (useAppStore().$state.deviceTypeENUM[item]) {
        list.push({
          name: useAppStore().$state.deviceTypeENUM[item],
          value: overviews.value.deviceTypeNum[item],
          id: Date.now(),
        });
      }
    });
  }
  return list;
});

const abnormalDeviceNums = computed(() => {
  const obj = {
    10: "拆卸告警",
    20: "阀门堵转",
    30: "传感器异常",
    40: "按键报警触发",
  };
  const list = [];
  if (overviews.value.abnormalTypeNum) {
    Object.keys(overviews.value.abnormalTypeNum).forEach((item) => {
      if (obj[item]) {
        list.push({
          name: obj[item],
          value: overviews.value.abnormalTypeNum[item],
          id: Date.now(),
        });
      }
    });
  }
  return list;
});

const onReset = () => {
  form.communityIds = [];
};

const onSubmit = () => {
  getOverViewData();
  getRoomDataThirtyDay();
  getScatterData();
  getWaterTemperatureData();
};

// 获取小区下拉列表
const getCommunityLists = async () => {
  const res = await getCommunityList({
    pageNum: 1,
    pageSize: 1000,
  });
  commuityList.value = res.records;
};

// 获取数据概况
const getOverViewData = async () => {
  const res = await getOverview({ communityIds: form.communityIds });
  overviews.value = res.data;
};

// 获取24小时小区室温加湿度数据
const getRoomDataThirtyDay = async () => {
  const res = await getRoomDataThirtyDays({ communityIds: form.communityIds });
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross", // 十字准星指示器，同时显示两个轴的数据
      },
    },
    color: ["#17D9FF", "#4EFAE2"],
    legend: {
      data: ["温度", "湿度"],
      bottom: 0,
      textStyle: {
        color: "#fff",
      },
    },
    grid: {
      left: "4%",
      right: "1%",
      bottom: "16%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        interval: 0,
        margin: 15,
        color: "#fff",
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#234A7E",
        },
      },
      data: res.data.map((item) => item.hour),
    },
    yAxis: [
      {
        type: "value",
        position: "left",
        alignTicks: true,
        axisLabel: {
          formatter: "{value}°C",
          color: "#fff",
          lineHeight: 35,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#234A7E",
          },
        },
      },
      {
        type: "value",
        position: "right",
        alignTicks: true,
        axisLabel: {
          lineHeight: 35,
          formatter: "{value} %RH",
          color: "#fff",
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#234A7E",
          },
        },
        startValue: 0,
      },
    ],
    series: [
      {
        name: "温度",
        type: "line",
        yAxisIndex: 0,
        data: res.data.map((item) => item.avgRoomTemperature),
      },
      {
        name: "湿度",
        type: "line",
        yAxisIndex: 1,
        data: res.data.map((item) => item.avgRoomHumidity),
      },
    ],
  };
  const myChart1 = echarts.init(chart1.value);
  myChart1.setOption(option);
  window.addEventListener("resize", () => {
    myChart1.resize();
  });
};

// 获取前五及后五小区温度
const getCommunityTemperature = async () => {
  const res = await getTop5TemperatureCommunity({
    communityIds: form.communityIds,
  });
  const option2 = {
    tooltip: {
      trigger: "axis",
    },
    color: ['#0EC4E8', '#4EFAE2', '#F7C25B'],
    legend: {
      data: ["平均室温", "平均供水水温", "平均供水水压"],
      bottom: "10",
      textStyle: {
        color: "#fff",
      },
    },
    xAxis: {
      type: "category",
      axisLabel: {
        color: "#fff",
        lineHeight: 35,
      },
      data: res.data.top5.map((item) => item.communityName),
    },
    yAxis: [
      {
        type: "value",
        alignTicks: true,
        axisLabel: {
          formatter: "{value}°C",
          color: '#fff'
        },
      },
      {
        type: "value",
        alignTicks: true,
        axisLabel: {
          formatter: "{value}MPa",
          color: '#fff'
        },
      },
    ],
    series: [
      {
        name: "平均室温",
        data: res.data.top5.map((item) => item.avgRoomTemperature),
        type: "bar",
        yAxisIndex: 0,
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0]
        }
      },
      {
        name: "平均供水水温",
        data: res.data.top5.map((item) => item.supplyWaterTemperature),
        type: "bar",
        yAxisIndex: 0,
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0]
        }
      },
      {
        name: "平均供水水压",
        data: res.data.top5.map((item) => item.supplyWaterPressure),
        type: "bar",
        yAxisIndex: 1,
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0]
        }
      },
    ],
  };
  const option3 = {
    color: ['#0EC4E8', '#4EFAE2', '#F7C25B'],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["平均室温", "平均供水水温", "平均供水水压"],
      bottom: "10",
      textStyle: {
        color: "#fff",
      },
    },
    xAxis: {
      type: "category",
      data: res.data.low5.map((item) => item.communityName),
      axisLabel: {
        color: '#fff'
      },
    },
    yAxis: [
      {
        type: "value",
        alignTicks: true,
        axisLabel: {
          formatter: "{value}°C",
          color: '#fff'
        },
      },
      {
        type: "value",
        alignTicks: true,
        axisLabel: {
          formatter: "{value}MPa",
          color: '#fff'
        },
      },
    ],
    series: [
      {
        name: "平均室温",
        data: res.data.low5.map((item) => item.avgRoomTemperature),
        type: "bar",
        yAxisIndex: 0,
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0]
        }
      },
      {
        name: "平均供水水温",
        data: res.data.low5.map((item) => item.supplyWaterTemperature),
        type: "bar",
        yAxisIndex: 0,
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0]
        }
      },
      {
        name: "平均供水水压",
        data: res.data.low5.map((item) => item.supplyWaterPressure),
        type: "bar",
        yAxisIndex: 1,
        itemStyle: {
          barBorderRadius: [10, 10, 0, 0]
        }
      },
    ],
  };
  const myChart2 = echarts.init(chart2.value);
  const myChart3 = echarts.init(chart3.value);
  myChart2.setOption(option2);
  myChart3.setOption(option3);
  window.addEventListener("resize", () => {
    myChart2.resize();
    myChart3.resize();
  });
};

const getScatterData = async () => {
  const res = await getScatterChart({ communityIds: form.communityIds });
  const option4 = {
    color: ['#5AC1FF'],
    xAxis: {
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      type: "value",
      alignTicks: true,
      axisLabel: {
        formatter: "{value}°C",
        color: '#fff'
      },
    },
    series: [
      {
        symbolSize: 10,
        data: res.data.map((item) => [
          item.avgValvePosition,
          item.avgTemperature,
        ]),
        type: "scatter",
      },
    ],
  };
  const option5 = {
    color: ['#5AC1FF'],
    xAxis: {
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      type: "value",
      alignTicks: true,
      axisLabel: {
        formatter: "{value}°C",
        color: '#fff'
      },
    },
    series: [
      {
        symbolSize: 10,
        data: res.data.map((item) => [
          item.avgSupplyWaterTemperature,
          item.avgTemperature,
        ]),
        type: "scatter",
      },
    ],
  };
  const myChart4 = echarts.init(chart4.value);
  const myChart5 = echarts.init(chart5.value);
  myChart4.setOption(option4);
  myChart5.setOption(option5);
  window.addEventListener("resize", () => {
    myChart4.resize();
    myChart5.resize();
  });
};

const getWaterTemperatureData = async () => {
  const res = await getWaterTemperatureChart({
    communityIds: form.communityIds,
  });
  const option6 = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross", // 十字准星指示器，同时显示两个轴的数据
      },
    },
    color: ["#17D9FF", "#4EFAE2"],
    legend: {
      data: ['供水温度', '回水温度'],
      bottom: 0,
      textStyle: {
        color: "#fff",
      },
    },
    grid: {
      left: "4%",
      right: "3%",
      bottom: "16%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        interval: 0,
        margin: 15,
        color: "#fff",
      },
      data: res.data.map((item) => item.hour),
    },
    yAxis: {
      type: "value",
      position: "left",
      alignTicks: true,
      axisLabel: {
        formatter: "{value}°C",
        color: "#fff",
      },
    },
    series: [
      {
        name: "供水温度",
        type: "line",
        data: res.data.map((item) => item.avgSupplyWaterTemperature),
      },
      {
        name: "回水温度",
        type: "line",
        data: res.data.map((item) => item.avgReturnWaterTemperature),
      },
    ],
  };
  const myChart6 = echarts.init(chart6.value);
  myChart6.setOption(option6);
  window.addEventListener("resize", () => {
    myChart6.resize();
  });
};

onMounted(() => {
  getCommunityLists();
  getOverViewData();
  getRoomDataThirtyDay();
  getCommunityTemperature();
  getScatterData();
  getWaterTemperatureData();
});
</script>

<style scoped lang="scss" src="./index.scss"></style>
