<template>
  <div class="community-container" style="padding: 20px">
    <el-form
      :model="queryParams"
      ref="queryRef"
      v-show="showSearch"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
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
          v-hasPermi="['project:community:add']"
          >新增</el-button
        >
      </el-col>
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
    <el-table v-loading="loading" :data="communityList">
      <el-table-column label="项目编号" prop="code"  min-width="15%"/>
      <el-table-column label="项目名称" prop="name"  min-width="18%" />
      <el-table-column
        label="项目地址"
        prop="address"
        :show-overflow-tooltip="true"
        min-width="25%" 
      />
      <el-table-column label="管理员" prop="manager" min-width="10%" />
      <el-table-column label="电话" prop="phone"  min-width="12%" />
      <el-table-column label="创建时间" prop="createTime" min-width="15%"  />
      <el-table-column label="修改时间" prop="updateTime" min-width="15%"  />
      <el-table-column
        label="操作"
        align="center"
         min-width="10%"
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
      <el-form ref="operateRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="项目地址" prop="address">
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="管理员" prop="manager">
          <el-input v-model="form.manager" />
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

<script setup name="Community">
import {
  getCommunityList,
  deleteMethod,
  addMethod,
  editMethod,
} from "@/api/project/community";
const { proxy } = getCurrentInstance();
const communityList = ref([]);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);
const title = ref("");
const dialogLoading = ref(false);
const visible = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
  },
  rules: {
    name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
    address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
    phone: [
      { required: true, message: "电话不能为空", trigger: "blur" },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: "请输入正确的11位手机号码",
        trigger: "blur",
      },
    ],
    manager: [{ required: true, message: "管理员不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询列表 */
function getList() {
  loading.value = true;
  getCommunityList(queryParams.value).then((res) => {
    communityList.value = res.records;
    total.value = res.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增小区 */
function handleAdd() {
  title.value = "新增";
  reset();
  visible.value = true;
}

/** 修改小区 */
function handleUpdate(row) {
  reset();
  form.value = {
    id: row.id,
    name: row.name,
    code:row.code,
    address: row.address,
    phone: row.phone,
    manager: row.manager,
  };
  title.value = "修改";
  visible.value = true;
}

/** 删除小区 */
async function handleDelete(row) {
  proxy.$modal
    .confirm("是否确认删除该数据项?")
    .then(function () {
      return deleteMethod({ id: row.id });
    })
    .then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    })
    .catch(() => {});
}

/** 提交 */
function submitMethod() {
  proxy.$refs["operateRef"].validate(async (valid) => {
    if (valid) {
      dialogLoading.value = true;
      const method = form.value.id ? editMethod : addMethod;
      const { code } = await method(form.value).catch(
        () => (dialogLoading.value = false)
      );
      dialogLoading.value = false;
      if (code === 200) {
        visible.value = false;
        proxy.$modal.msgSuccess("操作成功");
        getList();
      }
    }
  });
}

function reset() {
  form.value = {
    id: undefined,
    name: undefined,
    address: undefined,
    phone: undefined,
    manager: undefined,
  };
  proxy.resetForm("operateRef");
}

onMounted(() => {
  getList();
});
</script>
