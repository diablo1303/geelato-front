<script setup lang="ts">
import { computed, type PropType, ref } from "vue";
import ConvertUtil from "../../../../gl-ui/src/m/utils/ConvertUtil";

const props = defineProps({
  layout: {
    type: String,
    default() {
      return "8:8:8";
    },
  },
  columnGap: {
    type: String,
    default() {
      return "16px";
    },
  },
  rowGap: {
    type: String,
    default() {
      return "16px";
    },
  },
  display: {
    type: String,
    default() {
      return "VERTICAL";
    },
  },
  visibility: {
    type: Array,
    default() {
      return ["PC", "MOBILE"];
    },
  },
});

const spans = computed(() => {
  return props.layout?.split(":");
});
// defineExpose();
</script>

<template>
  <a-row :gutter="rowGap">
    <a-col
      v-for="(span, index) in spans"
      :key="index"
      :gutter="columnGap"
      :flex="1"
      colspan="span"
    >
    </a-col>
  </a-row>
</template>

<style scoped></style>
