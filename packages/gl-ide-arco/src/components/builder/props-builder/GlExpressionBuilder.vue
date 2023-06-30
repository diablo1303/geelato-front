<script lang="ts">
export default {
  name: 'GlExpressionBuilder'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return {
        showInput: false
      }
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
}, {deep: true})
</script>

<template>
  <a-switch v-model="mv.showInput"/>
</template>

<style scoped>

</style>
