<template>
  <a-card :title="title" v-show="!glIsRuntime">
    <a-alert closable>此为隐藏区域，只在设计时能看到，发布运行后看不到该区域内容。</a-alert>
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
  name: "GlHiddenArea"
}
</script>
<script lang="ts" setup>

import {mixins} from "@geelato/gl-ui";

const props = defineProps({
  title: String,
  ...mixins.props
})
</script>

<style scoped>
</style>
