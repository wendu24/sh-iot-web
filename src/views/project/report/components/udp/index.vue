<template>
  <div class="report-udp-container">
    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="udpList">
      <el-table-column label="设备编号" prop="deviceSn" min-width="180" />
      <el-table-column label="ICCID" prop="iccId" min-width="200" />
      <el-table-column
        label="小区名称"
        prop="communityName"
        :show-overflow-tooltip="true"
        min-width="150"
      />
      <el-table-column label="设备版本" prop="deviceVersion" width="100" />
      <el-table-column
        label="异常"
        prop="abnormalTypes"
        min-width="100"
        :show-overflow-tooltip="true"
      >
        <template #default="{ row }">
          <span>{{ abnormalTypeTableDesc(row.abnormalTypes) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电池电量" prop="batteryLevel" width="100" />
      <el-table-column label="上报周期" prop="reportPeriod" width="100" />
      <el-table-column label="信号强度" prop="signalStrength" width="100" />
      <el-table-column label="采集时间" prop="collectTime" width="160" />
      <el-table-column
        label="室内温度°C"
        prop="roomTemperature"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="室内湿度"
        prop="roomHumidity"
        width="130"
        :show-overflow-tooltip="true"
      />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup name="Udp">
import { getUdpList } from '@/api/project/report'
const abnormalTypeTableDesc = computed(() => (type) => {
  const obj = {
    10: '拆卸告警',
    20: '阀门堵转',
    30: '传感器异常'
  }
  if (type) {
    const types = type
      .split(',')
      .map((item) => obj[item])
      .join(',')
    return types
  }
  return ''
})

const udpList = ref([])
const loading = ref(true)
const total = ref(0)
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10
  }
})
const { queryParams } = toRefs(data)

/** 查询列表 */
function getList(params = queryParams.value) {
  if (params.page) {
    params = {
      pageNum: params.page,
      pageSize: params.limit,
      ...queryParams.value
    }
  }
  loading.value = true
  getUdpList(params).then((res) => {
    queryParams.value = params
    udpList.value = res.records
    total.value = res.total
    loading.value = false
  })
}

onMounted(() => {
  getList()
})

defineExpose({
  getList
})
</script>
