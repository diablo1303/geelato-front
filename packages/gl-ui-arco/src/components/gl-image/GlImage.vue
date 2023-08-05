<script lang="ts">
export default {
  name: 'GlImage'
}
</script>
<script lang="ts" setup>

import {computed, ref, watch} from "vue";
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
  width: [Number,String],
  height: [Number,String],
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
  <a-image :style="defaultStyle" :width="width" :height="height" :src="src" >
  </a-image>
</template>

<style scoped>
</style>
