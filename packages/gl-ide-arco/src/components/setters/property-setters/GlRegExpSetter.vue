<script lang="ts">
export default {
  name: 'GlRegExpSetter'
}
</script>
<script lang="ts" setup>
import { ref, watch } from 'vue'

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
    <a-input v-model="mv" type="text" placeholder="正则表达式">
      <template #prefix> 比值 </template>
      <template #suffix>
        <GlIconfont type="gl-select"></GlIconfont>
      </template>
      <a-modal>

      </a-modal>
    </a-input>
  </div>
</template>

<style scoped></style>
