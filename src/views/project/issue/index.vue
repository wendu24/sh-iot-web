<template>
  <div class="community-container" style="padding: 20px">
    <el-form
      :model="queryParams"
      ref="queryRef"
      v-show="showSearch"
      :inline="true"
      label-width="86px"
    >
      <el-form-item label="设备序列号" prop="deviceSn">
        <el-input
          v-model="queryParams.deviceSn"
          placeholder="请输入设备序列号"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="命令码" prop="cmdCode">
        <el-input
          v-model="queryParams.cmdCode"
          placeholder="请输入命令码"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="读写" prop="readOrWrite">
        <el-input
          v-model="queryParams.readOrWrite"
          placeholder="请输入读写"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否响应" prop="hasReply">
        <el-select v-model="queryParams.hasReply" placeholder="请选择" clearable style="width: 240px">
          <el-option label="是" :value="true">是</el-option>
          <el-option label="否" :value="false">否</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="queryParams.publishTime"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['project:community:add']"
          >新增</el-button
        >
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
          >导出</el-button
        >
      </el-col> -->
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="issueList">
      <el-table-column label="设备序列号" prop="deviceSn" min-width="150" />
      <el-table-column label="命令码" prop="cmdCode" width="120">
        <template #default="{ row }">
          <span>{{ cmdCodeDesc(row.cmdCode) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="读写" prop="readOrWrite" width="80">
        <template #default="{ row }">
          <span>{{ readOrWriteDesc(row.readOrWrite) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="下发数据"
        prop="publishData"
        :show-overflow-tooltip="true"
        min-width="150"
      />
      <el-table-column
        label="设备回复"
        prop="replyData"
        :show-overflow-tooltip="true"
        min-width="150"
      />
      <el-table-column label="发布时间" prop="publishTime" min-width="160" />
      <el-table-column label="回复时间" prop="replyTime" min-width="160" />
      <!-- <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button
              link
              type="primary"
              icon="Edit"
              v-hasPermi="['project:community:edit']"
              @click="handleUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              link
              type="primary"
              icon="Delete"
              v-hasPermi="['project:community:delete']"
              @click="handleDelete(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column> -->
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

<script setup name="Issue">
import { getSetreplyList } from '@/api/project/issue'
const { proxy } = getCurrentInstance()
const issueList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const cmdCodeDesc = computed(() => (cmdCode) => {
  const desc = {
    22: 'IP地址',
    25: '加密密钥',
    35: '数据上报周期',
    37: '数据采集间隔',
    38: '鉴权密钥',
    48: '阀门开度',
    49: '目标回水温度',
    50: '目标室温',
  }
  return desc[cmdCode]
})

const readOrWriteDesc = computed(() => (readOrWrite) => {
  const desc = {
    0: '读取',
    1: '下发'
  }
  return desc[readOrWrite]
})
const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceSn: undefined,
    readOrWrite: undefined,
    cmdCode: undefined,
    hasReply: undefined,
    publishTime: undefined
  }
})

const { queryParams } = toRefs(data)

/** 查询列表 */
function getList() {
  loading.value = true
  const params = {
    ...queryParams.value
  }
  if (params.publishTime) {
    params.publishStartTime = params.publishTime[0] + ' 00:00:00'
    params.publishEndTime = params.publishTime[1] + ' 23:59:59'
    delete params.publishTime
  }
  getSetreplyList(params).then((res) => {
    issueList.value = res.records
    total.value = res.total
    loading.value = false
  })
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  queryParams.value.publishTime = undefined
  handleQuery()
}

onMounted(() => {
  getList()
})
</script>
