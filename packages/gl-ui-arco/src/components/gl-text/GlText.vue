<script lang="ts">
export default {
  name: 'GlText'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  _text: String,
  bold: Boolean,
  mark: Boolean,
  underline: Boolean,
  delete: Boolean,
  code: Boolean,
  disabled: Boolean,
  editable: Boolean,
  copyable: Boolean
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
if (props._text) {
  mv.value = props._text
}
</script>

<template>
  <a-typography-text v-bind="props">
    {{ mv }}
  </a-typography-text>
</template>

<style scoped>

</style>
