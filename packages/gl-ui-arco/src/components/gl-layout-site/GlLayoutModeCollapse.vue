<script lang="ts">
export default {
  name: 'GlLayoutModeCollapse'
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
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <div>
    GlLayoutModeCollapse
  </div>
</template>

<style scoped>

</style>
