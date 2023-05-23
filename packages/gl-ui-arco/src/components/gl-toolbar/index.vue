<script setup lang="ts">
import type {PropType} from "vue";
import type {ComponentMeta} from "./toolbar";

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

</script>

<template>
  <a-row>
    <a-col :span="leftColSpan">
      <a-space style="margin-left: -8px">
        <slot name="leftItems"></slot>
        <span></span>
        <template v-for="(item, index) in leftItems" :key="index">
          <GlComponent v-if="item" :glComponentInst="item"></GlComponent>
        </template>
      </a-space>
    </a-col>
    <a-col :span="centerColSpan">
      <a-space>
        <span></span>
        <template v-for="(item, index) in centerItems" :key="index">
          <GlComponent v-if="item" :glComponentInst="item"></GlComponent>
        </template>
      </a-space>
    </a-col>
    <a-col :span="rightColSpan" style="display: flex; align-items: center; justify-content: end">
      <a-space>
        <template v-for="(item, index) in rightItems" :key="index">
          <GlComponent v-if="item" :glComponentInst="item"></GlComponent>
        </template>
        <slot name="rightItems"></slot>
        <span></span>
      </a-space>
    </a-col>
  </a-row>
</template>

<style scoped></style>
