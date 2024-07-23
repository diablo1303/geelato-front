<script lang="ts">
export default {
  name: 'GlUploadBase64'
}
</script>
<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import type {Base64FileParams} from "@geelato/gl-ui";
import {fileApi, isUtil} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  accept: {type: String, default: ''},
  disabled: {type: Boolean, default: false},
  showButtonUpload: {type: Boolean, default: true},
  showButtonDownload: {type: Boolean, default: true},
  showButtonRemove: {type: Boolean, default: true},
});
const mv = ref({
  baseName: '',
  baseJson: props.modelValue,
  accept: props.accept,
  disabled: props.disabled,
  showButtonUpload: props.showButtonUpload,
  showButtonDownload: props.showButtonDownload,
  showButtonRemove: props.showButtonRemove,
});

/**
 * base64编码字符串文件值变更
 */
watch(() => mv.value.baseJson, () => {
  emits('update:modelValue', mv.value.baseJson);
  emits('change', mv.value.baseJson);
}, {deep: true});

/**
 * 元组件参数变更，初始化
 */
watch(() => props, () => {
  const {modelValue, ...mvParams} = props;
  Object.assign(mv.value, reactive({
    ...mvParams,
    ...{baseName: '', baseJson: props.modelValue}
  }));
  if (mv.value.baseJson && isUtil.isJSON(mv.value.baseJson)) {
    const baseData: Base64FileParams = JSON.parse(mv.value.baseJson);
    mv.value.baseName = (baseData && baseData.name) || '';
  }
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
        const data: Base64FileParams = {
          // @ts-ignore
          base64: event.target.result.split(",")[1],
          name: files[0].name, size: files[0].size, type: files[0].type
        };
        mv.value.baseJson = JSON.stringify(data);
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
  mv.value.baseJson = '';
  mv.value.baseName = '';
}
</script>
<template>
  <a-input v-if="!mv.disabled" v-model="mv.baseName" :title="mv.baseName" class="input-icon" readonly>
    <template #append>
      <a-button v-if="mv.showButtonUpload" class="input-button input-button-primary" type="dashed" @click="base64Upload($event)">
        <IconUpload/>
      </a-button>
      <a-button v-if="mv.showButtonDownload&&mv.baseJson" class="input-button input-button-primary" type="dashed"
                @click="fileApi.downloadFileByBase64String(mv.baseJson)">
        <IconDownload/>
      </a-button>
      <a-button v-if="mv.showButtonRemove" class="input-button input-button-close" type="dashed" @click="base64Remove($event)">
        <IconClose/>
      </a-button>
    </template>
  </a-input>
  <span v-else>
    <a class="arco-upload-list-item-name-link" @click="fileApi.downloadFileByBase64String(mv.baseJson)">
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