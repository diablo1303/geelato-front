<template>
  <a-card :title="title">
    <GlX :glComponentInst="glComponentInst"></GlX>
  </a-card>
</template>
<script lang="ts">
export default {
  name: "GlCard"
}
</script>
<script lang="ts" setup>

import {mixins} from "@geelato/gl-ui";

const props = defineProps({
  title: String,
  ...mixins.props
})
</script>

<style scoped lang="less">
</style>
