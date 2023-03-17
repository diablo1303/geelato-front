<script lang="ts">
export default {
  name: "GlFormCol"
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
    <a-form-item  field="name" tooltip="Please enter username" label="Username">
      <GlX :glComponentInst="glComponentInst"></GlX>
    </a-form-item>
  </a-col>
</template>

<style scoped></style>
