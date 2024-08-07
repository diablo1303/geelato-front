<script lang="ts">
export default {
  name: 'GlUploadFile'
}
</script>
<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import type {AttachmentForm, UploadFileParams} from "@geelato/gl-ui";
import {fileApi} from "@geelato/gl-ui";

// 页面所需 参数
type PageParams = {
  appId?: string; // 应用主键
  tenantCode?: string; // 租户编码
}

const emits = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  parameter: {type: Object, default: () => ({} as PageParams)},// 页面需要的参数
  accept: {type: String, default: ''},
  disabled: {type: Boolean, default: false},
  showButtonUpload: {type: Boolean, default: true},
  showButtonDownload: {type: Boolean, default: true},
  showButtonRemove: {type: Boolean, default: true},
  tableType: {type: String, default: ''},
  genre: {type: String, default: ''},
  objectId: {type: String, default: ''},
});

const uploadParams = ref<UploadFileParams>({
  tableType: props.tableType || '',// 类型
  isRename: true,// 文件重命名，默认：true
  objectId: props.objectId || '',// 文件所属对象id
  genre: props.genre || '',// 类型
  appId: props.parameter?.appId || '',// 所属应用
  tenantCode: props.parameter?.tenantCode || '',// 所属租户
});// 上传参数

const mv = ref({
  baseName: '',
  baseId: props.modelValue,
  accept: props.accept,
  disabled: props.disabled,
  showButtonUpload: props.showButtonUpload,
  showButtonDownload: props.showButtonDownload,
  showButtonRemove: props.showButtonRemove,
});

/**
 * base64编码字符串文件值变更
 */
watch(() => mv.value.baseId, () => {
  emits('update:modelValue', mv.value.baseId);
  emits('change', mv.value);
}, {deep: true});

/**
 * 获取附件
 * @param id
 * @param successBack
 * @param failBack
 */
const getAttach = async (id: string, successBack?: any, failBack?: any) => {
  try {
    const {data} = await fileApi.getAttachment(id);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

const uploadSome = async (formData: FormData, successBack?: any, failBack?: any) => {
  try {
    const {data} = await fileApi.updateFile(formData, uploadParams.value);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

/**
 * 元组件参数变更，初始化
 */
watch(() => props, () => {
  const {modelValue, ...mvParams} = props;
  Object.assign(mv.value, reactive({
    ...mvParams,
    ...{baseName: '', baseId: props.modelValue}
  }));
  if (mv.value.baseId) {
    getAttach(mv.value.baseId, (data: AttachmentForm) => {
      mv.value.baseName = data.name;
    });
  }
  Object.assign(uploadParams.value, {
    tableType: props.tableType || '',// 类型
    objectId: props.objectId || '',// 文件所属对象id
    genre: props.genre || '',// 类型
    appId: props.parameter?.appId || '',// 所属应用
    tenantCode: props.parameter?.tenantCode || '',// 所属租户
  });
}, {deep: true, immediate: true});

/**
 * 选择文件
 * @param ev
 */
const base64Upload = (ev?: MouseEvent) => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = mv.value.accept;
  fileInput.onchange = (event) => {
    // @ts-ignore
    const files = event && event.target && event.target.files;
    if (files && files.length > 0) {
      const URL = window.URL || window.webkitURL;
      mv.value.baseName = files[0].name;
      const reader = new FileReader();
      reader.onload = function (event) {
        const formData = new FormData();
        // 假设你的服务器期望的文件字段名为 "file"
        formData.append('file', files[0]);
        uploadSome(formData, (data: AttachmentForm) => {
          mv.value.baseId = data.id;
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };
  fileInput.click();
}
/**
 * 删除文件
 * @param ev
 */
const base64Remove = (ev?: MouseEvent) => {
  mv.value.baseId = '';
  mv.value.baseName = '';
  emits('change', mv.value);
}
</script>
<template>
  <a-input v-if="!mv.disabled" v-model="mv.baseName" :title="mv.baseName" class="input-icon" readonly>
    <template #append>
      <a-button v-if="mv.showButtonUpload" class="input-button input-button-primary" type="dashed" @click="base64Upload($event)">
        <IconUpload/>
      </a-button>
      <a-button v-if="mv.showButtonDownload&&mv.baseId" class="input-button input-button-primary" type="dashed" @click="fileApi.fetchFileById(mv.baseId)">
        <IconDownload/>
      </a-button>
      <a-button v-if="mv.showButtonRemove" class="input-button input-button-close" type="dashed" @click="base64Remove($event)">
        <IconClose/>
      </a-button>
    </template>
  </a-input>
  <span v-else>
    <a class="arco-upload-list-item-name-link" @click="fileApi.fetchFileById(mv.baseId)">
      <IconDownload/>
      {{ mv.baseName }}
    </a>
  </span>
</template>
<style lang="less" scoped>
.input-button {
  height: 31px;
  padding: 0 8px;
}

.input-button-primary {
  color: rgb(var(--primary-6));
  border-color: var(--color-primary-light-3);
}

.input-button-close {
  color: rgb(var(--danger-6));
  border-color: var(--color-danger-light-3);
}

.input-icon > :last-child {
  padding: 0px !important;
}

</style>