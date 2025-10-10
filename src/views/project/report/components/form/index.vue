<template>
  <el-form
    :model="queryParams"
    ref="queryRef"
    v-show="showSearch"
    :inline="true"
    label-width="96px"
  >
    <el-form-item label="设备编号" prop="deviceSn">
      <el-input
        v-model="queryParams.deviceSn"
        placeholder="请输入设备编号"
        clearable
        style="width: 240px"
        @keyup.enter="handleQuery"
      />
    </el-form-item>
    <el-form-item label="小区" prop="communityId">
      <el-select
        v-model="queryParams.communityId"
        placeholder="请选择小区"
        clearable
        style="width: 240px"
      >
        <el-option
          v-for="dict of commuityList"
          :key="dict.id"
          :label="dict.name"
          :value="dict.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="数据采集时间">
      <el-date-picker
        v-model="queryParams.collectTime"
        type="daterange"
        value-format="YYYY-MM-DD"
        style="width: 240px"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :disabled-date="disabledDate"
        @change="handleDateChange"
        @calendar-change="handleCalendarChange"
      ></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="Search" @click="handleQuery"
        >搜索</el-button
      >
      <el-button icon="Refresh" @click="resetQuery">重置</el-button>
    </el-form-item>
  </el-form>
  <el-row :gutter="10" class="mb8">
    <right-toolbar
      v-model:showSearch="showSearch"
      @queryTable="onChangeTable"
    ></right-toolbar>
  </el-row>
</template>

<script setup name="report-Form">
const { proxy } = getCurrentInstance()
const emit = defineEmits(['update'])
const props = defineProps({
  commuity: Array
})
const commuityList = props.commuity
const showSearch = ref(true)
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceSn: undefined,
    communityId: undefined,
    collectTime: undefined
  }
})
const { queryParams } = toRefs(data)

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  emit('update', setParams())
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  queryParams.value.collectTime = undefined
  handleQuery()
}

function onChangeTable() {
  emit('update', setParams())
}

const setParams = () => {
  const params = {
    ...queryParams.value
  }
  if (params.collectTime) {
    params.collectStartTime = params.collectTime[0] + ' 00:00:00'
    params.collectEndTime = params.collectTime[1] + ' 23:59:59'
    delete params.collectTime
  }
  return params
}

// 存储第一次选择的日期
const pickerState = reactive({
  firstSelectedDate: null
})

const disabledDate = (time) => {
  const currentDate = new Date()
  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  )

  // 禁用今天之后的日期:cite[2]
  if (time.getTime() > today.getTime()) {
    return true
  }

  // 如果没有选择第一个日期，不禁用任何30天内的日期
  if (!pickerState.firstSelectedDate) {
    return false
  }

  const firstDate = pickerState.firstSelectedDate
  const timeTimestamp = time.getTime()
  const firstDateTimestamp = firstDate.getTime()

  // 计算日期差值（绝对值）:cite[1]
  const diffTime = Math.abs(timeTimestamp - firstDateTimestamp)
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  // 如果差值在30天内，允许选择
  if (diffDays <= 30) {
    return false
  }

  // 如果差值超过30天，只允许选择第一个日期所在月份的日子:cite[6]
  const firstDateYear = firstDate.getFullYear()
  const firstDateMonth = firstDate.getMonth()

  const timeYear = time.getFullYear()
  const timeMonth = time.getMonth()

  // 允许选择第一个日期所在月份的所有日期
  return !(timeYear === firstDateYear && timeMonth === firstDateMonth)
}

const handleCalendarChange = (dates) => {
  if (dates && dates.length > 0) {
    // 当用户选择第一个日期时，记录它
    pickerState.firstSelectedDate = dates[0]
  } else {
    // 清空选择时重置状态
    pickerState.firstSelectedDate = null
  }
}

// 日期变化处理
const handleDateChange = (val) => {
  if (!val || val.length === 0) {
    pickerState.firstSelectedDate = null
  }
}
</script>
