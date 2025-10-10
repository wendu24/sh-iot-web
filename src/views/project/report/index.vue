<template>
  <div class="report-container" style="padding: 20px">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="udp设备数据" name="udp" lazy>
        <Form :commuity="commuityList" @update="handleUpdate" />
        <Udp ref="udpRef" />
      </el-tab-pane>
      <el-tab-pane label="mqtt设备数据" name="mqtt" lazy>
        <Form :commuity="commuityList" @update="handleUpdate" />
        <Mqtt ref="mqttRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="Report">
import { getCommunityList } from '@/api/home'
import Form from './components/form'
import Udp from './components/udp'
import Mqtt from './components/mqtt'
const activeName = ref('udp')
const commuityList = ref([])
// 获取小区下拉列表
const getCommunityLists = async () => {
  const res = await getCommunityList({
    pageNum: 1,
    pageSize: 1000,
  });
  commuityList.value = res.records;
};
const udpRef = ref(null)
const mqttRef = ref(null)
const handleUpdate = (params) => {
  if (activeName.value === 'udp') {
    if (udpRef.value) {
      udpRef.value.getList(params)
    }
  } else {
    if (mqttRef.value) {
      mqttRef.value.getList(params)
    }
  }
}
onMounted(() => {
  getCommunityLists()
})
</script>