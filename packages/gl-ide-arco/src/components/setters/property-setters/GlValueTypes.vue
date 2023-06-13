<script lang="ts">
export default {
  name: 'GlValueTypes'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";
import {useValueTypeOptions} from "@geelato/gl-ui-schema";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const valueTypeOptions = ref(useValueTypeOptions())
const mv = ref(props.modelValue)

watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <a-select v-model="mv">
    <a-option v-for="item of valueTypeOptions" :value="item.value">{{item.label}}</a-option>
  </a-select>
</template>

<style scoped>

</style>
