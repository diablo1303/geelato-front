<script lang="ts">
export default {
  name: 'GlButton'
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
  label:String,
  iconType: String
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <a-button>
    <template #icon>
      <GlIconfont :type="iconType">xx</GlIconfont>
    </template>
    {{ label}}
  </a-button>
</template>

<style scoped>

</style>
