<script lang="ts">
/**
 *  input设置器，带有变量设置功能
 */
export default {
  name: 'GlInputSetter'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";
import {useValueTypeOptions, ValueTypes} from "@geelato/gl-ui-schema";

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

const options = useValueTypeOptions()
</script>

<template>
  <a-input :style="{width:'320px'}" placeholder="Please enter something" allow-clear>
    <template #append>
      <a-select :options="options">
      </a-select>
    </template>
  </a-input>
</template>

<style scoped>

</style>
