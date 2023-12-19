<script lang="ts">
export default {
  name: 'GlTinymce'
}
</script>
<script lang="ts" setup>
import { type PropType, type Ref, ref, reactive, watch, onMounted, computed } from 'vue'
import { entityApi, EntityReader, utils } from '@geelato/gl-ui'
import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue'

import {
  TINY_FONT_FAMILY_FORMATS,
  TINY_FONT_SIZE_FORMATS,
  TINY_PLUGINS,
  TINY_TOOLBAR
} from './type'

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
  height: { type: String, default: '400px' },
  resize: { type: Boolean, default: false },
  menubar: { type: Boolean, default: false }
})
const key = ref(utils.gid())

const tinyInit = ref({})

watch(
  () => {
    return props
  },
  () => {
    tinyInit.value = {
      height: props.height,
      resize: props.resize, // 不允许用户调整大小
      language: 'zh-Hans', // 汉化
      branding: false, // 隐藏tinymce右下角水印
      convert_urls: false, // 不自动转换链接地址
      plugins: props.plugins, // 插件
      contextmenu: '', // 上下文菜单
      menubar: props.menubar, // 菜单栏
      toolbar_mode: props.toolbarMode, // 工具栏多行显示样式
      toolbar: props.toolbar, // 工具栏
      font_family_formats: props.fontFamilyFormats, // 字体选择
      font_size_formats: props.fontSizeFormats // 字号选择
    }
    key.value = utils.gid()
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  console.log(tinyInit.value)
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
   <div :key="key">
     <Editor  v-model="mv" :init="tinyInit" />
   </div>
</template>

