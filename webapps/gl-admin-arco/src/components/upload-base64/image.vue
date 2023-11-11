<script lang="ts">
export default {
  name: 'UploadImageBase64'
}
</script>
<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {downloadFileByBase64} from "@/api/application";
import {uploadFile} from "@/components/vue-cropper/type";

const emits = defineEmits(['update:modelValue', 'change']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  imageName: {type: String, default: 'Image'},
  imageWidth: {type: Number, default: 80},
  imageHeight: {type: Number, default: 80},
  disabled: {type: Boolean, default: false},
  showButtonPreview: {type: Boolean, default: true},
  showButtonDownload: {type: Boolean, default: true},
  showButtonSelect: {type: Boolean, default: true},
  showButtonRemove: {type: Boolean, default: true},
});
const mv = ref({
  imageSrc: props.modelValue,
  imageName: props.imageName,
  imageWidth: props.imageWidth,
  imageHeight: props.imageHeight,
  disabled: props.disabled,
  showButtonPreview: props.showButtonPreview,
  showButtonDownload: props.showButtonDownload,
  showButtonSelect: props.showButtonSelect,
  showButtonRemove: props.showButtonRemove,
});
const visible = ref(false);

/**
 * base64编码字符串文件值变更
 */
watch(() => mv.value.imageSrc, () => {
  emits('update:modelValue', mv.value.imageSrc);
  emits('change', mv.value.imageSrc);
}, {deep: true});

/**
 * 元组件参数变更，初始化
 */
watch(() => props, () => {
  console.log(props);
  const {modelValue, ...mvParams} = props;
  Object.assign(mv.value, reactive({
    ...mvParams,
    ...{imageSrc: props.modelValue}
  }));
}, {deep: true, immediate: true});

/**
 * 文件选择
 * @param ev
 */
const selectClick = (ev?: MouseEvent) => {
  uploadFile((file: File, url: string) => {
    if (!file) { // 如果没有选择文件，则返回
      return;
    }
    const reader = new FileReader(); // 创建FileReader对象
    reader.onload = function (e) { // 当读取完成时触发该事件
      mv.value.imageSrc = (e && e.target && e.target.result as string) || '';
    };
    reader.readAsDataURL(file); // 以DataURL格式读取文件内容
  });
}
/**
 * 文件移除
 * @param ev
 */
const deleteClick = (ev?: MouseEvent) => {
  mv.value.imageSrc = "";
}
/**
 *
 * @param ev
 */
const downloadClick = (ev?: MouseEvent) => {
  if (mv.value.imageSrc) {
    const arr = mv.value.imageSrc.split(",");
    const mine = arr[0].split(":").pop() || '';
    const base64Str = arr[1] || '';
    downloadFileByBase64(base64Str, mine, mv.value.imageName || 'Image');
  }
}
</script>
<template>
  <a-space>
    <div v-show="!mv.imageSrc" :style="{'width':`${mv.imageWidth}px`,'height':`${mv.imageHeight}px`}"
         class="arco-upload-picture-card" @click="selectClick($event)">
      <div class="arco-upload-picture-card-text">
        <svg class="arco-icon arco-icon-plus" stroke-width="4" viewBox="0 0 48 48">
          <path d="M5 24h38M24 5v38"></path>
        </svg>
      </div>
    </div>
    <a-image v-show="mv.imageSrc" v-model:src="mv.imageSrc" :height="mv.imageHeight" :preview-visible="visible"
             :width="mv.imageWidth" class="a-image" @preview-visible-change="() => { visible = false }">
      <template #extra>
        <div class="actions actions-outer">
          <span v-if="mv.showButtonPreview" class="action" @click="() => { visible = true }"><icon-eye/></span>
          <span v-if="mv.showButtonPreview" class="action" @click="downloadClick($event)"><icon-download/></span>
          <span v-if="!mv.disabled&&mv.showButtonSelect" class="action" @click="selectClick($event)"><icon-edit/></span>
          <span v-if="!mv.disabled&&mv.showButtonRemove" class="action" @click="deleteClick($event)"><icon-delete/></span>
        </div>
      </template>
    </a-image>
  </a-space>
</template>
<style lang="less" scoped>
.arco-upload-picture-card {
  cursor: pointer;
}

.a-image {
  border-radius: 2px;
  border: 1px solid #e8e8e8;
  box-shadow: 2px 2px 5px 3px rgba(0, 0, 0, 0.08);

  .actions {
    display: flex;
    align-items: center;
    padding-left: 64px;
    margin-bottom: -16px;
  }

  .action {
    padding: 5px 4px;
    font-size: 14px;
    margin-left: 12px;
    border-radius: 2px;
    line-height: 1;
    cursor: pointer;
    color: var(--color-text-1);
  }

  .action:first-child {
    margin-left: 0;
  }

  .action:hover {
    background: rgba(0, 0, 0, .5);
  }

  .actions-outer {
    .action {
      &:hover {
        color: #ffffff;
      }
    }
  }
}

</style>