<script lang="ts">
export default {
  name: 'GlUploadClipboard',
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";
import {type FileItem, type FormInstance, Message} from "@arco-design/web-vue";
import {entityApi, useGlobal, utils} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue', 'update:visible', 'success', 'cancel']);
const props = defineProps({
  modelValue: {type: Object, default: ''},// 表单 - 主键
  visible: {type: Boolean, default: false},// 弹层 - 是否显示
  action: {type: String, default: ''},// 接口地址
});

const global = useGlobal();
const visibleForm = ref<boolean>(false);
const uploadRef = ref();
const labelCol = ref<number>(0);// 表单-标题宽度
const wrapperCol = ref<number>(24); // 表单-内容宽度
const fileList = ref<FileItem[]>([]);
const mv = ref<Record<string, any>>({name: '', suffix: '', clean: true});
/**
 * 保存按钮
 * @param ev
 */
const handleModelOk = (ev?: Event) => {
  if (mv.value.name && mv.value.suffix) {
    console.log(fileList.value)
    uploadRef.value.submit();
  } else {
    global.$message.warning('文件名称不能为空');
  }
};
/**
 * 取消按钮
 * @param ev
 */
const handleModelCancel = (ev?: Event) => {
  visibleForm.value = false;
  emits('cancel', ev);
}

const uploadError = (fileItem: FileItem) => {
  console.error('上传失败', fileItem)
  Message.error('上传失败，请重试！')
}

const uploadSuccess = (fileItem: FileItem) => {
  if (mv.value.clean) navigator.clipboard.writeText('');
  console.log('上传成功', navigator.clipboard.read())
  fileItem.uid = fileItem.response.data.id
  fileList.value = [fileItem];
  Message.success('上传成功')
  emits('success', fileItem);
  visibleForm.value = false;
}

watch(() => props, () => {
  console.log('watch props', props);
  if (props.visible === true) {
    const file = props.modelValue as File;
    fileList.value = [{
      uid: utils.generateRandom(),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file,
      status: 'init',
    }];
    mv.value = {...utils.getFileParts(file.name || ''), clean: true};
  }
  // 显示页面
  visibleForm.value = props.visible === true;
}, {deep: true, immediate: true});

watch(() => mv.value, () => {
  fileList.value[0].name = mv.value.name + mv.value.suffix;
}, {deep: true, immediate: true});

watch(() => visibleForm, () => {
  emits('update:visible', visibleForm.value);
}, {deep: true, immediate: true});
</script>

<template>
  <a-modal v-model:visible="visibleForm" draggable title="粘贴板文件" title-align="start">
    <template #footer>
      <a-button @click="handleModelCancel">不上传粘贴板文件</a-button>
      <a-button type="primary" @click="handleModelOk">上传粘贴板文件</a-button>
    </template>
    <a-form :label-col-props="{ span: labelCol }" :model="mv" :wrapper-col-props="{ span: wrapperCol }" class="form">
      <a-row :gutter="wrapperCol">
        <a-col :span="(labelCol+wrapperCol)">
          <a-form-item class="form-item-image" field="file">
            <a-upload ref="uploadRef"
                      :action="action"
                      :auto-upload="false"
                      :file-list="fileList"
                      :headers="entityApi.getHeader()"
                      :limit="1"
                      :show-cancel-button="false"
                      :show-remove-button="false"
                      :show-retry-button="false"
                      :show-upload-button="false"
                      image-preview
                      list-type="picture-card"
                      @error="uploadError"
                      @success="uploadSuccess"/>
          </a-form-item>
        </a-col>
        <a-col :span="(labelCol+wrapperCol)">
          <a-form-item field="name">
            <a-input v-model="mv.name" :error="!mv.name" :max-length="250" placeholder="文件名称">
              <template #prefix>
                文件名称：
              </template>
              <template #suffix>
                {{ mv.suffix }}
              </template>
            </a-input>
          </a-form-item>
          <a-form-item field="clean">
            <a-checkbox v-model="mv.clean">上传成功后清理粘贴板。</a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<style lang="less">
.form-item-image {

  .arco-upload-wrapper.arco-upload-wrapper-type-picture-card {
    justify-content: center !important;
  }

  .arco-upload-list-picture {
    width: 160px;
    height: 160px;
  }

  .arco-upload-list-picture-mask {
    line-height: 160px;
  }
}
</style>