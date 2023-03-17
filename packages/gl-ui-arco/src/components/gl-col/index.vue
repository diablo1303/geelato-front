<script lang="ts">
export default {
  name: "GlCol"
}
</script>
<script setup lang="ts">
import {mixins} from "@geelato/gl-ui";


const props = defineProps({
  gutter: {
    type: String,
    default() {
      return "16px";
    },
  },
  ...mixins.props
});

// defineExpose();
</script>

<template>
  <a-col :gutter="gutter">
    <GlX :glComponentInst="glComponentInst"></GlX>
  </a-col>
</template>

<style scoped></style>
