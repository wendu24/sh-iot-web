<template>
  <div class="device-container">
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
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['project:device:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        v-model:showSearch="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <!-- 表格数据 -->
    <el-table
      v-loading="loading"
      row-key="id"
      :data="deviceList"
      @expand-change="expandChangeMethod"
    >
      <el-table-column type="expand">
        <template #default="{ row }">
          <template v-if="row.deviceType === 20 || row.deviceType === 40">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="电池电量">
                <span>{{ informations.batteryLevel }}</span>
              </el-form-item>
              <el-form-item label="数据上报周期">
                <span>{{ informations.uplinkPeriod }}(分钟)</span>
              </el-form-item>
              <el-form-item label="阀门开度">
                <span>{{ informations.valvePosition }}%</span>
              </el-form-item>
              <el-form-item label="阀门期望开度">
                <span>{{ informations.targetValvePosition }}%</span>
              </el-form-item>
              <el-form-item label="回水温度">
                <span>{{ informations.returnWaterTemperature }}°C</span>
              </el-form-item>
              <el-form-item label="目标回水温度">
                <span>{{ informations.targetReturnWaterTemperature }}°C</span>
              </el-form-item>
              <el-form-item label="供水温度">
                <span>{{ informations.supplyWaterTemperature }}°C</span>
              </el-form-item>
              <el-form-item label="供水压力">
                <span>{{ informations.supplyWaterPressure }}</span>
              </el-form-item>
              <el-form-item label="回水压力">
                <span>{{ informations.returnWaterPressure }}</span>
              </el-form-item>
              <el-form-item label="异常类型">
                <span>{{
                  abnormalTypeTableDesc(informations.abnormalTypes)
                }}</span>
              </el-form-item>
              <el-form-item label="数据采集时间">
                <span>{{ informations.collectionTime }}</span>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="row.deviceType === 30">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="设备版本">
                <span>{{ informations.deviceVersion }}</span>
              </el-form-item>
              <el-form-item label="电池电量">
                <span>{{ informations.batteryLevel }}</span>
              </el-form-item>
              <el-form-item label="数据上报周期">
                <span>{{ informations.uplinkPeriod }}(分钟)</span>
              </el-form-item>
              <el-form-item label="信号强度">
                <span>{{ informations.signalStrength }}</span>
              </el-form-item>
              <el-form-item label="室内温度">
                <span>{{ informations.roomTemperature }}°C</span>
              </el-form-item>
              <el-form-item label="室内湿度">
                <span>{{ informations.roomHumidity }}</span>
              </el-form-item>
              <el-form-item label="异常类型">
                <span>{{
                  abnormalTypeTableDesc(informations.abnormalTypes)
                }}</span>
              </el-form-item>
              <el-form-item label="数据采集时间">
                <span>{{ informations.collectionTime }}</span>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="row.deviceType === 10">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="电池电量">
                <span>{{ informations.batteryLevel }}</span>
              </el-form-item>
              <el-form-item label="信号强度">
                <span>{{ informations.signalStrength }}</span>
              </el-form-item>
              <el-form-item label="设备序列号">
                <span>{{ informations.deviceSn }}</span>
              </el-form-item>
              <el-form-item label="数据采集时间">
                <span>{{ informations.collectionTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="设备序列号" prop="deviceSn" width="180" />
      <el-table-column label="设备位置" prop="position" width="130" />
      <el-table-column label="设备类型" prop="deviceType" width="130">
        <template #default="{ row }">
          <span>{{ deviceTypeTableDesc(row.deviceType) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="DTU序列号"
        prop="dtuSn"
        :show-overflow-tooltip="true"
        width="130"
      />
      <el-table-column label="小区名称" prop="communityName" width="150" />
      <el-table-column label="IP地址" prop="ipAddress" min-width="200">
        <template #default="{ row }">
          <div class="table-edit-wrapper">
            <el-input v-model="row.ipAddress" />
            <el-icon @click="onTableClick(row, 'ipAddress', 1, 'dataStr', 22)">
              <edit color="#409EFF" />
            </el-icon>
            <el-icon @click="onTableClick(row, 'ipAddress', 0, '', 22)">
              <refresh color="#409EFF" />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="加密密钥" prop="aesKey" min-width="200">
        <template #default="{ row }">
          <div class="table-edit-wrapper">
            <el-input v-model="row.aesKey" />
            <el-icon @click="onTableClick(row, 'aesKey', 1, 'dataStr', 25)">
              <edit color="#409EFF" />
            </el-icon>
            <el-icon @click="onTableClick(row, 'aesKey', 0, '', 25)">
              <refresh color="#409EFF" />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="鉴权密钥" align="loginKey" min-width="200">
        <template #default="{ row }">
          <div class="table-edit-wrapper">
            <el-input v-model="row.loginKey" />
            <el-icon @click="onTableClick(row, 'loginKey', 1, 'dataStr', 38)">
              <edit color="#409EFF" />
            </el-icon>
            <el-icon @click="onTableClick(row, 'loginKey', 0, '', 38)">
              <refresh color="#409EFF" />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="数据上报周期" prop="reportPeriod" min-width="200">
        <template #default="{ row }">
          <div class="table-edit-wrapper">
            <el-input v-model="row.reportPeriod" />
            <el-icon @click="onTableClick(row, 'reportPeriod', 1, 'data', 35)">
              <edit color="#409EFF" />
            </el-icon>
            <el-icon @click="onTableClick(row, 'reportPeriod', 0, '', 35)">
              <refresh color="#409EFF" />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="数据采集间隔"
        prop="collectPeriod"
        min-width="200"
      >
        <template #default="{ row }">
          <div class="table-edit-wrapper">
            <el-input v-model="row.collectPeriod" />
            <el-icon @click="onTableClick(row, 'collectPeriod', 1, 'data', 37)">
              <edit color="#409EFF" />
            </el-icon>
            <el-icon @click="onTableClick(row, 'collectPeriod', 0, '', 37)">
              <refresh color="#409EFF" />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="阀门开度" prop="valvePosition" min-width="200">
        <template #default="{ row }">
          <div class="table-edit-wrapper">
            <el-input v-model="row.valvePosition" />
            <el-icon @click="onTableClick(row, 'valvePosition', 1, 'data', 48)">
              <edit color="#409EFF" />
            </el-icon>
            <el-icon @click="onTableClick(row, 'valvePosition', 0, '', 48)">
              <refresh color="#409EFF" />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="目标回水温度"
        prop="returnWaterTemperature"
        min-width="200"
      >
        <template #default="{ row }">
          <div class="table-edit-wrapper">
            <el-input v-model="row.returnWaterTemperature" />
            <el-icon
              @click="
                onTableClick(row, 'returnWaterTemperature', 1, 'data', 49)
              "
            >
              <edit color="#409EFF" />
            </el-icon>
            <el-icon
              @click="onTableClick(row, 'returnWaterTemperature', 0, '', 49)"
            >
              <refresh color="#409EFF" />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="目标室温" prop="roomTemperature" min-width="200">
        <template #default="{ row }">
          <div class="table-edit-wrapper">
            <el-input v-model="row.roomTemperature" />
            <el-icon
              @click="onTableClick(row, 'roomTemperature', 1, 'data', 50)"
            >
              <edit color="#409EFF" />
            </el-icon>
            <el-icon @click="onTableClick(row, 'roomTemperature', 0, '', 50)">
              <refresh color="#409EFF" />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="160" />
      <el-table-column label="更新时间" prop="updateTime" width="160" />
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-tooltip content="修改" placement="top">
            <el-button
              link
              type="primary"
              icon="Edit"
              v-hasPermi="['project:device:edit']"
              @click="handleUpdate(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              link
              type="primary"
              icon="Delete"
              v-hasPermi="['project:device:delete']"
              @click="handleDelete(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" v-model="visible" width="500px" append-to-body>
      <el-form ref="operateRef" :model="form" :rules="rules" label-width="96px">
        <el-form-item label="设备序列号" prop="deviceSn">
          <el-input v-model="form.deviceSn" />
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceType">
          <el-select
            v-model="form.deviceType"
            filterable
            placeholder="请选择设备"
          >
            <el-option
              v-for="item of deviceTypeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="dtu序列号" prop="dtuSn">
          <el-input v-model="form.dtuSn" />
        </el-form-item>
        <el-form-item label="小区" prop="communityId">
          <el-select
            v-model="form.communityId"
            filterable
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
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input v-model="form.ipAddress" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="加密密钥" prop="aesKey">
          <el-input v-model="form.aesKey" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="鉴权密钥" prop="loginKey">
          <el-input v-model="form.loginKey" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数据上报周期" prop="reportPeriod">
          <el-input v-model="form.reportPeriod" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数据采集间隔" prop="collectPeriod">
          <el-input v-model="form.collectPeriod" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="阀门开度" prop="valvePosition">
          <el-input v-model="form.valvePosition" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="目标回水温度" prop="returnWaterTemperature">
          <el-input v-model="form.returnWaterTemperature" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="目标室温" prop="roomTemperature">
          <el-input v-model="form.roomTemperature" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="dialogLoading"
            @click="submitMethod"
            >确 定</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Device">
import {
  getDeviceList,
  deleteMethod,
  addMethod,
  editMethod,
  editOtherInfoMethod,
  viewInfoMethod
} from '@/api/project/device'
import { getCommunityList } from '@/api/home'
import useAppStore from '@/store/modules/app'
const deviceTypeENUM = useAppStore().$state.deviceTypeENUM
const { proxy } = getCurrentInstance()
const commuityList = ref([])
const deviceList = ref([])
const loading = ref(true)
const showSearch = ref(true)
const total = ref(0)
const title = ref('')
const dialogLoading = ref(false)
const visible = ref(false)
const deviceTypeList = computed(() => {
  return Object.keys(deviceTypeENUM).map((item) => ({
    name: deviceTypeENUM[item],
    value: item,
    id: item
  }))
})
const deviceTypeTableDesc = computed(
  () => (type) => deviceTypeENUM[type]
)
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

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deviceSn: undefined
  },
  rules: {
    deviceSn: [
      { required: true, message: '设备序列号不能为空', trigger: 'blur' }
    ],
    deviceType: [
      { required: true, message: '设备不能为空', trigger: 'change' }
    ],
    dtuSn: [{ required: true, message: 'dtu序列号不能为空', trigger: 'blur' }],
    communityId: [
      { required: true, message: '小区不能为空', trigger: 'change' }
    ]
  }
})

const { queryParams, form, rules } = toRefs(data)
watch(
  form,
  (newValue, oldValue) => {
    rules.value.dtuSn[0].required = newValue.deviceType === '10'
  },
  { deep: true }
)

/** 查询列表 */
function getList() {
  loading.value = true
  getDeviceList(queryParams.value).then((res) => {
    deviceList.value = res.records
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
  handleQuery()
}

/** 新增设备 */
function handleAdd() {
  title.value = '新增'
  reset()
  visible.value = true
}

/** 修改设备 */
function handleUpdate(row) {
  reset()
  form.value = {
    id: row.id,
    deviceSn: row.deviceSn,
    deviceType: row.deviceType + '',
    dtuSn: row.dtuSn || '',
    communityId: row.communityId,
    communityName: row.communityName,
    ipAddress: row.ipAddress,
    aesKey: row.aesKey,
    loginKey: row.loginKey,
    reportPeriod: row.reportPeriod,
    collectPeriod: row.collectPeriod,
    valvePosition: row.valvePosition,
    returnWaterTemperature: row.returnWaterTemperature,
    roomTemperature: row.roomTemperature
  }
  title.value = '修改'
  visible.value = true
}

/** 删除设备 */
async function handleDelete(row) {
  proxy.$modal
    .confirm('是否确认删除该数据项?')
    .then(function () {
      return deleteMethod({ id: row.id })
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

/** 提交 */
function submitMethod() {
  proxy.$refs['operateRef'].validate(async (valid) => {
    if (valid) {
      const method = form.value.id ? editMethod : addMethod
      const communityName = commuityList.value.find(
        (item) => item.id === form.value.communityId
      )?.name
      if (!communityName) {
        return proxy.$modal.msgWarning('选择的小区不存在，请重新检查')
      }
      dialogLoading.value = true
      const { code } = await method({ ...form.value, communityName }).catch(
        () => (dialogLoading.value = false)
      )
      dialogLoading.value = false
      if (code === 200) {
        visible.value = false
        proxy.$modal.msgSuccess('操作成功')
        getList()
      }
    }
  })
}

function reset() {
  form.value = {
    id: undefined,
    deviceSn: undefined,
    deviceType: undefined,
    dtuSn: undefined,
    communityId: undefined,
    communityName: undefined,
    ipAddress: undefined,
    aesKey: undefined,
    loginKey: undefined,
    reportPeriod: undefined,
    collectPeriod: undefined,
    valvePosition: undefined,
    returnWaterTemperature: undefined,
    roomTemperature: undefined
  }
  proxy.resetForm('operateRef')
}

// 获取小区下拉列表
const getCommunityLists = async () => {
  const res = await getCommunityList({
    pageNum: 1,
    pageSize: 1000
  })
  commuityList.value = res.records
}

const onTableClick = async (row, key, readWriteFlag, params, cmdcode) => {
  if (!row[key]) {
    return proxy.$modal.msgWarning('请输入值再操作！')
  }
  const postValue = {
    deviceSn: row.deviceSn,
    cmdcode,
    readWriteFlag,
    [key]: row[key]
  }
  if (readWriteFlag === 1) {
    postValue[params] = row[key]
  }
  const res = await editOtherInfoMethod([postValue])
  if (res.code === 200) {
    proxy.$modal.msgSuccess('操作成功')
    readWriteFlag === 1 && getList()
  }
}

const informations = ref({})
const expandChangeMethod = async (row, expandedRows) => {
  // 判断当前行是否在已展开的行数组中
  const isExpanded = expandedRows.some(
    (expandedRow) => expandedRow.id === row.id
  )
  if (isExpanded) {
    const urlObj = {
      10: `dtu/${row.deviceSn}`,
      20: `mqtt/${row.deviceSn}`,
      30: `udp/${row.deviceSn}`,
      40: `mqtt/${row.deviceSn}`
    }
    const res = await viewInfoMethod(urlObj[row.deviceType])
    informations.value = res.data
  }
}

onMounted(() => {
  getList()
  getCommunityLists()
})
</script>
<style lang="scss" scoped>
.device-container {
  padding: 20px;

  .table-edit-wrapper {
    display: flex;
    align-items: center;

    .el-icon {
      margin-left: 6px;
      cursor: pointer;
    }
  }

  .demo-table-expand {
    padding-left: 30px;
    max-width: 600px;

    .el-form-item {
      width: 32%;
      margin-bottom: 0;
      margin-right: 2px;

      &:nth-last-child(2) {
        width: 100%;
      }

      &:last-child {
        width: 100%;
      }
    }
  }
}
</style>
