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
  label: String,
  iconType: String
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <a-button class="gl-button">
    <template #icon>
      <GlIconfont v-if="iconType" :type="iconType"></GlIconfont>
    </template>
    {{ label }}
  </a-button>
</template>

<style>
.gl-button .arco-btn-icon {
  margin-right: 0 !important;
}

.gl-button .gl-icon-font {
  margin-right: 8px;
}
</style>
