<script lang="ts">
export default {
  name: "GlRowLayout"
}
</script>
<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
  layout: {
    type: String,
    default() {
      return "8:8:8";
    },
  },
  colGutter: {
    type: String,
    default() {
      return "16px";
    },
  },
  rowGutter: {
    type: String,
    default() {
      return "16px";
    },
  },
  // components: {
  //   type: Array,
  //   default() {
  //     return []
  //   }
  // },
  // display: {
  //   type: String,
  //   default() {
  //     return "VERTICAL";
  //   },
  // },
  visibility: {
    type: Array,
    default() {
      return ["PC", "MOBILE"];
    },
  },
});

const spans = computed(() => {
  try {
    return props.layout?.split(":");
  } catch (e) {
  }
  return "8:8:8"
});
// defineExpose();
</script>

<template>
  <a-row :gutter="rowGutter">
    <a-col
        v-for="(span, index) in spans"
        :key="index"
        :gutter="colGutter"
        :flex="1"
        colspan="span"
    >
      <a-form-item>
        <slot></slot>
<!--        <GlCompoent :is="components[index].componentName" :="components[index].props"></GlCompoent>-->
      </a-form-item>
    </a-col>
  </a-row>
</template>

<style scoped></style>
