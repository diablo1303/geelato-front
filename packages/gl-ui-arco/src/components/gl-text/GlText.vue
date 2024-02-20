<script lang="ts">
export default {
  name: 'GlText'
}
</script>
<script lang="ts" setup>
import { ref, watch } from 'vue'
import { utils } from '@geelato/gl-ui'

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  _content: String,
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

const key = ref(utils.gid('key', 6))
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

watch(
  props,
  () => {
    if (props._content) {
      mv.value = props._content
    } else {
      mv.value = props.modelValue
    }
    key.value = utils.gid('key', 6)
  },
  { deep: true }
)

// watch(
//   () => {
//     return props._content
//   },
//   () => {
//     if (props._content) {
//       mv.value = props._content
//     } else {
//       mv.value = props.modelValue
//     }
//   }
// )
</script>

<template>
  <a-typography-text v-bind="props" :key="key">
    {{ mv }}
  </a-typography-text>
</template>

<style scoped></style>
