<script lang="ts">
export default {
  name: 'GlTinymce'
}
</script>
<script lang="ts" setup>
import {type PropType, type Ref, ref, reactive, watch, onMounted, computed} from 'vue'
import {entityApi, EntityReader, fileApi, useApiUrl, utils} from '@geelato/gl-ui'
import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'
import {TINY_FONT_FAMILY_FORMATS, TINY_FONT_SIZE_FORMATS, TINY_PLUGINS, TINY_TOOLBAR} from './type'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
    default: ''
  },
  plugins: {
    type: [String, Array],
    default: TINY_PLUGINS
  },
  toolbar: {
    type: [String, Array],
    default: TINY_TOOLBAR
  },
  toolbarMode: {
    type: String,
    default: 'wrap'
  },
  fontFamilyFormats: {
    type: String,
    default: TINY_FONT_FAMILY_FORMATS
  },
  fontSizeFormats: {
    type: String,
    default: TINY_FONT_SIZE_FORMATS
  },
  height: {type: String, default: '400px'},
  resize: {type: Boolean, default: false},
  autoUpload: {type: Boolean, default: false},
  menubar: {type: Boolean, default: false},
  disabled: {type: Boolean, default: false},
  readonly: {type: Boolean, default: false},
})
const key = ref(utils.gid());
const baseUrl = useApiUrl().getApiBaseUrl();
const replaceStr = "REPLACE_API_BASE_URL";

const example_image_upload_handler = (blobInfo: any, progress: any) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('POST', fileApi.getUploadUrl(), true);
  xhr.setRequestHeader('Authorization', entityApi.getAuthorization() || '');
  xhr.upload.onprogress = (e) => {
    progress(e.loaded / e.total * 100);
  };
  xhr.onload = () => {
    if (xhr.status === 403) {
      reject({message: 'HTTP Error: ' + xhr.status, remove: true});
      return;
    }
    if (xhr.status < 200 || xhr.status >= 300) {
      reject('HTTP Error: ' + xhr.status);
      return;
    }
    const json = JSON.parse(xhr.responseText);
    if (!json || json.code != 20000) {
      reject('Invalid JSON: ' + xhr.responseText);
      return;
    }
    resolve(fileApi.getDownloadUrlById(json.data.id));
  };
  xhr.onerror = () => {
    reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
  };
  const formData = new FormData();
  formData.append('file', blobInfo.blob(), blobInfo.filename());
  xhr.send(formData);
});

const tinyInit = ref({
  height: props.height,
  statusbar: true, // 底部状态栏，是否显示
  elementpath: true, // 底部状态栏，元素路径
  resize: props.resize, // 底部状态栏，大小调整
  branding: false, // 底部状态栏，隐藏tinymce右下角水印
  language: 'zh-Hans', // 汉化
  convert_urls: false, // 不自动转换链接地址
  plugins: props.plugins, // 插件
  contextmenu: '', // 上下文菜单
  menubar: props.menubar, // 顶部菜单栏
  promotion: false, // 顶部菜单栏，upgrade
  toolbar_mode: props.toolbarMode, // 工具栏多行显示样式
  toolbar: props.readonly === false ? props.toolbar : true, // 工具栏
  font_family_formats: props.fontFamilyFormats, // 字体选择
  font_size_formats: props.fontSizeFormats, // 字号选择
  automatic_uploads: props.autoUpload,
  images_upload_handler: example_image_upload_handler
});

watch(
  () => {
    return props.height
  },
  () => {
    tinyInit.value.height = props.height
    key.value = utils.gid()
  },
  {deep: true, immediate: true}
)
watch(
  () => {
    return props.autoUpload
  },
  () => {
    tinyInit.value.automatic_uploads = props.autoUpload
    key.value = utils.gid()
  },
  {deep: true, immediate: true}
)
watch(
  () => {
    return props.resize
  },
  () => {
    tinyInit.value.resize = props.resize
    key.value = utils.gid()
  },
  {deep: true, immediate: true}
)
watch(
  () => {
    return props.menubar
  },
  () => {
    tinyInit.value.menubar = props.menubar
    key.value = utils.gid()
  },
  {deep: true, immediate: true}
)
watch(
  () => {
    return props.readonly
  },
  () => {
    tinyInit.value.toolbar = props.readonly === false ? props.toolbar : false;
    key.value = utils.gid()
  },
  {deep: true, immediate: true}
)

const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value?.replace(new RegExp(baseUrl, "g"), "${" + replaceStr + "}"));
})
watch(
  () => {
    return props.modelValue
  },
  () => {
    mv.value = props.modelValue?.replace(new RegExp("\\$\\{" + replaceStr + "\\}", "g"), baseUrl);
  }, {deep: true, immediate: true}
)
</script>

<template>
  <div :key="key" :style="{'width':'100%'}">
    <div v-if="props.readonly" v-html="mv" :style="{'min-height':props.height}">
    </div>
    <Editor v-else v-model="mv" :init="tinyInit" :disabled="props.readonly"/>
  </div>
</template>
