<template>
  <el-dialog
    :visible.sync="dialog"
    title="导入"
    width="500px"
    class="dialog-wrappers upload-wrapper"
    show-close
    :close-on-click-modal="false"
  >
    <div>
      <div class="upload-dialog-body">
        <el-upload
          class="upload"
          drag
          :data="params"
          :action="importUrl"
          :show-file-list="false"
          :accept="fileAcceptList"
          :headers="headerObj"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
          :on-error="handleUploadError"
          @on-progress="handlePreview"
        >
          <i v-if="loading" class="el-icon-loading" />
          <svg-icon
            v-if="!loading"
            icon-class="freight-tariff-upload"
            class-name="upload-icon"
          />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <div class="bottom-btn-wrapper">
        <el-button size="small"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="small"
          >确定</el-button
        >
        <a v-if="!hideTemplate" class="download-template" @click="downloadTemplate">
          <svg-icon icon-class="freight-tariff-download" class-name="download-icon" />
          <span>下载模板</span>
        </a>
      </div>
    </div>
  </el-dialog>
</template>

<script setup name="device-Import">

</script>

<style lang="scss" src="./index.scss" scoped></style>
