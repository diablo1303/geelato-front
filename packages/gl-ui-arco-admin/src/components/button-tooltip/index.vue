<script lang="ts">
export default {
  name: 'GlButtonTooltip',
};
</script>

<script lang="ts" setup>
import {ref, watch} from "vue";

const emits = defineEmits(['update:modelValue', 'click']);
const props = defineProps({
  modelValue: {type: String, default: ''},
  content: {type: String, default: ''},
  status: {type: String, default: 'primary'},
});

const onclick = () => {
  emits('click');
}
</script>

<template>
  <a-tooltip :content="content">
    <a-button class="select-button" :class="`button-${status}`" @click="onclick">
      <slot></slot>
      <slot name="icon"></slot>
    </a-button>
  </a-tooltip>
</template>

<style lang="less" scoped>
.select-button {
  height: 31.6px;
  padding: 0 8px;
  font-weight: bold;
}

.button-success {
  color: rgb(var(--success-6));
}

.button-primary {
  color: rgb(var(--primary-6));
}

.button-warning {
  color: rgb(var(--warning-6));
}

.button-danger {
  color: rgb(var(--danger-6));
}
</style>