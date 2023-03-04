<script setup lang="ts">
import type { PropType, ref } from "vue";
import type { ComponentMeta } from "./toolbar";

defineProps({
  leftColSpan: {
    type: Number,
    default() {
      return 12;
    },
  },
  centerColSpan: {
    type: Number,
    default() {
      return 0;
    },
  },
  rightColSpan: {
    type: Number,
    default() {
      return 12;
    },
  },
  leftItems: {
    type: Array as PropType<ComponentMeta[]>,
    default() {
      return [];
    },
  },
  centerItems: {
    type: Array as PropType<ComponentMeta[]>,
    default() {
      return [];
    },
  },
  rightItems: {
    type: Array as PropType<ComponentMeta[]>,
    default() {
      return [];
    },
  },
});

// defineExpose();
</script>

<template>
  <a-row>
    <a-col :span="leftColSpan">
      <a-space>
        <slot name="leftItems"></slot>
        <template v-for="(item, index) in leftItems" :key="index">
          <component :is="item.componentName"></component>
        </template>
      </a-space>
    </a-col>
    <a-col :span="centerColSpan">
      <template v-for="(item, index) in centerItems" :key="index">
        <component :is="item.componentName"></component> </template
    ></a-col>
    <a-col
      :span="rightColSpan"
      style="display: flex; align-items: center; justify-content: end"
    >
      <a-space>
        <template v-for="(item, index) in rightItems" :key="index">
          <component :is="item.componentName"></component>
        </template>
        <slot name="rightItems"></slot>
      </a-space>
    </a-col>
  </a-row>
</template>

<style scoped></style>
