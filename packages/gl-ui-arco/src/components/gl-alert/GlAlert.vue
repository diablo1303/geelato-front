<script lang="ts">
export default {
  name: 'GlAlert'
}
</script>
<script lang="ts" setup>

import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  type: String,
  showIcon: Boolean,
  closable: Boolean,
  title: String,
  banner: Boolean,
  center: Boolean,
  _content: String
})

</script>

<template>
  <a-alert v-bind="props">
    {{ _content }}
    <template #action>
      <slot name="action"></slot>
    </template>
  </a-alert>
</template>

<style scoped>

</style>
