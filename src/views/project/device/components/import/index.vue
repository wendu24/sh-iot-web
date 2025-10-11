<template>
  <el-dialog
    v-model="visible"
    title="导入"
    width="500px"
    class="dialog-wrappers upload-wrapper"
    show-close
    :close-on-click-modal="false"
  >
    <div class="upload-dialog-body">
      <el-upload
        class="upload"
        drag
        :show-file-list="false"
        :accept="fileType"
        :action="importUrl"
        :headers="headers"
        :before-upload="handleBeforeUpload"
        :on-error="handleUploadError"
        :on-success="handleUploadSuccess"
      >
        <el-icon v-if="loading" class="is-loading">
          <Loading />
        </el-icon>
        <svg-icon
          v-if="!loading"
          icon-class="import-upload"
          class="upload-icon"
        />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>
    <template #footer>
      <el-button size="small" @click="hide">取消</el-button>
      <!-- <el-button type="primary" size="small">确定</el-button> -->
      <!-- <a
        v-if="!hideTemplate"
        class="download-template"
        @click="downloadTemplate"
      >
        <svg-icon
          icon-class="freight-tariff-download"
          class-name="download-icon"
        />
        <span>下载模板</span>
      </a> -->
    </template>
  </el-dialog>
</template>

<script setup name="Import-component">
import { getToken } from "@/utils/auth"
const props = defineProps({
  hideTemplate: {
    type: Boolean,
    default: true
  },
  importUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    default: '.xls,.xlsx'
  }
})
const { proxy } = getCurrentInstance()
const loading = ref(false)
const visible = ref(false)
const importUrl = props.importUrl
const headers = ref({
  Authorization: "Bearer " + getToken()
})

const show = () => {
  visible.value = true
}

const hide = () => {
  visible.value = false
}

const handleBeforeUpload = (file) => {
  const fileName = file.name
  const ext = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase()
  
  if (props.fileType) {
    // 限制文件格式
    if (props.fileType.indexOf(ext) < 0) {
      proxy.$modal.msgWarning("文件类型不合法，请上传" + props.fileType)
      return false
    }
  }
  loading.value = true // 开启上传中状态
}

const handleUploadError = () => {
  loading.value = false
  proxy.$modal.msgError('上传失败')
}

const handleUploadSuccess = (res) => {
  loading.value = false
  if (res.code === 200) {
    proxy.$modal.msgSuccess('上传成功')
    hide()
  }
}

defineExpose({
  show,
  hide
})
</script>

<style lang="scss" src="./index.scss" scoped></style>
