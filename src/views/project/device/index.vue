<template>
  <div class="device-index-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        class="el-tabs-recepit-item"
        v-for="item in tabsList"
        :key="item.value"
        :label="item.name"
        :name="item.value"
        lazy
      >
        <Context :active="activeName" :commuity="commuityList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup name="Device">
import Context from './Context.vue'
import { getCommunityList } from '@/api/home'
const tabsList = ref([
  { name: 'mqtt设备', value: 'mqtt' },
  { name: 'udp设备', value: 'udp' },
])
const activeName = ref('mqtt')

// 获取小区下拉列表
const commuityList = ref([])
const getCommunityLists = async () => {
  const res = await getCommunityList({
    pageNum: 1,
    pageSize: 1000
  })
  commuityList.value = res.records
}
onMounted(() => {
  getCommunityLists()
})
</script>
<style lang="scss" scoped>
.device-index-container {
  padding: 20px;
}
</style>
