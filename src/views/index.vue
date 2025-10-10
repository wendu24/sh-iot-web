<template>
  <div class="app-container home">
    <el-form :inline="true" :model="form">
      <el-form-item label="小区">
        <el-select
          v-model="form.communityIds"
          multiple
          filterable
          collapse-tags
          placeholder="请选择小区"
          style="width: 220px"
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
        <el-button @click="onReset">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="summary-info-wapper">
      <div class="item">
        <div class="item_left">
          <img src="@/assets/home/community.svg" alt="" />
        </div>
        <div class="item_right">
          <div class="item_right_title">小区</div>
          <div class="item_right_desc">
            <span>{{ overviews.communityNum }}</span>
            <span>个</span>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item_left">
          <img src="@/assets/home/device.svg" alt="" />
        </div>
        <div class="item_right">
          <div class="item_right_title">设备数</div>
          <div class="item_right_wrapper">
            <span v-for="item of deviceNums" :key="item.id"
              >{{ item.name }}：{{ item.value }}个</span
            >
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item_left">
          <img src="@/assets/home/abnormal-device.svg" alt="" />
        </div>
        <div class="item_right">
          <div class="item_right_title">异常设备</div>
          <div class="item_right_wrapper">
            <span v-for="item of abnormalDeviceNums" :key="item.id"
              >{{ item.name }}：{{ item.value }}个</span
            >
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item_left">
          <img src="@/assets/home/temperature.svg" alt="" />
        </div>
        <div class="item_right">
          <div class="item_right_title">平均室温</div>
          <div class="item_right_desc">
            <span>{{ overviews.avgRoomTemperature }}</span>
            <span>°C</span>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item_left">
          <img src="@/assets/home/valve.svg" alt="" />
        </div>
        <div class="item_right">
          <div class="item_right_title">平均阀门开度</div>
          <div class="item_right_desc">
            <span>{{ overviews.avgValvePosition }}</span>
            <span>个</span>
          </div>
        </div>
      </div>
    </div>

    <div class="echarts-wrapper">
      <div ref="chart1" class="chart" style="height: 300px"></div>
      <div ref="chart6" class="chart" style="height: 300px"></div>
      <div ref="chart2" class="chart" style="height: 300px"></div>
      <div ref="chart3" class="chart" style="height: 300px"></div>
      <div ref="chart4" class="chart" style="height: 300px"></div>
      <div ref="chart5" class="chart" style="height: 300px"></div>
    </div>
  </div>
</template>

<script setup name="Index">
import * as echarts from "echarts";
import { computed, reactive } from "vue";
import useAppStore from '@/store/modules/app'
import {
  getCommunityList,
  getOverview,
  getRoomDataThirtyDays,
  getTop5TemperatureCommunity,
  getScatterChart,
  getWaterTemperatureChart
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
    title: {
      text: "近30天平均室温与湿度",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross", // 十字准星指示器，同时显示两个轴的数据
      },
    },
    legend: {
      data: ["温度", "湿度"],
      left: "left",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    // toolbox: {
    //   feature: {
    //     saveAsImage: {},
    //   },
    // },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        interval: 0,
        margin: 15,
      },
      data: res.data.map((item) => item.hour),
    },
    yAxis: [
      {
        type: "value",
        // name: "温度",
        position: "left",
        alignTicks: true,
        axisLabel: {
          formatter: "{value}°C",
        },
      },
      {
        type: "value",
        // name: "湿度1111",
        position: "right",
        alignTicks: true,
        axisLabel: {
          formatter: "{value} %RH",
        },
        startValue: 0,
      },
    ],
    series: [
      {
        name: "温度",
        type: "line",
        // stack: "总量",
        yAxisIndex: 0,
        data: res.data.map((item) => item.avgRoomTemperature),
      },
      {
        name: "湿度",
        type: "line",
        // stack: "总量",
        yAxisIndex: 1,
        data: res.data.map((item) => {
          return item.avgRoomHumidity;
        }),
      },
    ],
  };
  const myChart1 = echarts.init(chart1.value);
  myChart1.setOption(option);
  window.addEventListener('resize', () => {
    myChart1.resize();
  });
};

// 获取前五及后五小区温度
const getCommunityTemperature = async () => {
  const res = await getTop5TemperatureCommunity({
    communityIds: form.communityIds,
  });
  const option2 = {
    title: {
      text: "近30天室温较高小区",
      left: "center",
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['平均室温', '平均供水水温', '平均供水水压'],
      bottom: "10",
    },
    xAxis: {
      type: "category",
      data: res.data.top5.map((item) => item.communityName),
    },
    yAxis: {
      type: "value",
      alignTicks: true,
      axisLabel: {
        formatter: "{value}°C",
      },
    },
    series: [
      {
        name: '平均室温',
        data: res.data.top5.map((item) => item.avgRoomTemperature),
        type: "bar",
      },
      {
        name: '平均供水水温',
        data: res.data.top5.map((item) => item.supplyWaterTemperature),
        type: "bar",
      },
      {
        name: '平均供水水压',
        data: res.data.top5.map((item) => item.supplyWaterPressure),
        type: "bar",
      }
    ],
  };
  const option3 = {
    title: {
      text: "近30天室温较低小区",
      left: "center",
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['平均室温', '平均供水水温', '平均供水水压'],
      bottom: "10",
    },
    xAxis: {
      type: "category",
      data: res.data.low5.map((item) => item.communityName),
    },
    yAxis: {
      type: "value",
      alignTicks: true,
      axisLabel: {
        formatter: "{value}°C",
      },
    },
    series: [
      {
        name: '平均室温',
        data: res.data.low5.map((item) => item.avgRoomTemperature),
        type: "bar",
      },
      {
        name: '平均供水水温',
        data: res.data.low5.map((item) => item.supplyWaterTemperature),
        type: "bar",
      },
      {
        name: '平均供水水压',
        data: res.data.low5.map((item) => item.supplyWaterPressure),
        type: "bar",
      }
    ],
  };
  const myChart2 = echarts.init(chart2.value);
  const myChart3 = echarts.init(chart3.value);
  myChart2.setOption(option2);
  myChart3.setOption(option3);
  window.addEventListener('resize', () => {
    myChart2.resize();
    myChart3.resize();
  });
};

const getScatterData = async () => {
  const res = await getScatterChart({ communityIds: form.communityIds });
  const option4 = {
    title: {
      text: "阀门与室温散点图",
      left: "center",
    },
    xAxis: {},
    yAxis: {
      type: "value",
      alignTicks: true,
      axisLabel: {
        formatter: "{value}°C",
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
    title: {
      text: "供水水温与室温散点图",
      left: "center",
    },
    xAxis: {},
    yAxis: {
      type: "value",
      alignTicks: true,
      axisLabel: {
        formatter: "{value}°C",
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
  window.addEventListener('resize', () => {
    myChart4.resize();
    myChart5.resize();
  });
};

const getWaterTemperatureData = async () => {
  const res = await getWaterTemperatureChart({ communityIds: form.communityIds })
  const option6 = {
    title: {
      text: "近30天供水温度和回水温度",
      left: 0,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross", // 十字准星指示器，同时显示两个轴的数据
      },
    },
    legend: {
      data: ["供水温度", "回水温度"],
      right: 0,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      axisLabel: {
        interval: 0,
        margin: 15,
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
        },
      },
      {
        type: "value",
        position: "right",
        alignTicks: true,
        axisLabel: {
          formatter: "{value}°C",
        },
        startValue: 0,
      },
    ],
    series: [
      {
        name: "供水温度",
        type: "line",
        // stack: "总量",
        yAxisIndex: 0,
        data: res.data.map((item) => item.avgSupplyWaterTemperature),
      },
      {
        name: "回水温度",
        type: "line",
        // stack: "总量",
        yAxisIndex: 1,
        data: res.data.map((item) => item.avgReturnWaterTemperature),
      },
    ],
  };
  const myChart6 = echarts.init(chart6.value);
  myChart6.setOption(option6);
  window.addEventListener('resize', () => {
    myChart6.resize();
  });
}

onMounted(() => {
  getCommunityLists();
  getOverViewData();
  getRoomDataThirtyDay();
  getCommunityTemperature();
  getScatterData();
  getWaterTemperatureData()
});
</script>

<style scoped lang="scss">
.home {
  background-color: #f5f6f7;
  min-height: calc(100vh - 84px);
  box-sizing: border-box;

  .el-form {
    .el-form-item {
      margin-bottom: 12px;
    }
  }

  .summary-info-wapper {
    display: flex;
    align-items: flex-start;

    .item {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 16px;
      width: 24%;
      margin: 0.5%;
      min-height: 150px;
      box-shadow: 0px 8px 14px 0px rgba(55, 131, 136, 0.09);
      background-color: #fff;
      border-radius: 16px;

      &:hover {
        background-color: #f5f6f7;
      }

      .item_left {
        width: 50px;
        height: 50px;
        margin: 0 20px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .item_right {
        flex: 1;

        .item_right_title {
          color: #0b1019;
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .item_right_desc {
          span {
            color: #0b1019;
            font-size: 14px;

            &:first-child {
              font-size: 36px;
              font-weight: 600;
              margin-right: 4px;
            }
          }
        }

        .item_right_wrapper {
          display: flex;
          flex-direction: column;

          span {
            color: #0b1019;
            font-size: 12px;
            margin-right: 4px;
            margin-bottom: 4px;

            &:nth-child(even) {
              margin-right: 0 !important;
            }
          }
        }
      }
    }
  }

  .echarts-wrapper {
    margin-top: 12px;
    // padding-right: 16px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .chart {
      width: calc(50% - 16px);
      margin: 8px;
      background-color: #fff;
      border-radius: 16px;
      padding: 12px;
    }
  }
}
</style>

