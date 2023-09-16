<script lang="ts">
export default {
  name: 'GlEmpty'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: String,
  description: String
})

const mv = ref(props.modelValue || props.description)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})

watch(() => {
  return props.description
}, (value) => {
  mv.value = value
})
</script>

<template>
  <a-empty>
    {{ mv }}
  </a-empty>
</template>