<template>
  <a-card :title="title">
    <template v-if="glIsRuntime">
      <slot></slot>
    </template>
    <template v-else>
      <GlInsts :glComponentInst="glComponentInst"></GlInsts>
    </template>
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
