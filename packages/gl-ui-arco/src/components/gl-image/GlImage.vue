<script lang="ts">
export default {
  name: 'GlImage'
}
</script>
<script lang="ts" setup>

import {computed} from "vue";
import {fileApi} from "@geelato/gl-ui";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  srcType: String,
  srcValue: String,
  width: [String, Number],
  height: [String, Number],
  defaultStyle: {
    type: Object,
    default() {
      return {
        "min-width": '1em',
        "min-height": '1em'
      }
    }
  }
})

const src = computed(() => {
  switch (props.srcType) {
    case "ID":
      return (props.srcValue || props.modelValue) ? fileApi.getDownloadUrlById(props.srcValue || props.modelValue) : ''
    case "URL":
      return props.srcValue || props.modelValue
    case "Base64":
      return props.srcValue || props.modelValue
    default:
      return props.srcValue || props.modelValue
  }
})
</script>

<template>
  <a-image class="gl-image" :style="defaultStyle" :width="width" :height="height" :src="src">
  </a-image>
</template>

<style scoped>
</style>
