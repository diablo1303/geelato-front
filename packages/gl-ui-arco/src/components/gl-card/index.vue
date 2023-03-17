<template>
  <GlCard :title="title">
    <GlX :glComponentInst="glComponentInst"></GlX>
  </GlCard>
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
