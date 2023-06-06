<template>
  <a-card :title="title">
<!--    <template v-if="glIsRuntime">-->
<!--&lt;!&ndash;      <slot></slot>&ndash;&gt;-->
<!--      <GlInstsRuntime :glComponentInst="glComponentInst"  :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"></GlInstsRuntime>-->
<!--    </template>-->
<!--    <template v-else>-->
<!--      <GlInsts :glComponentInst="glComponentInst"></GlInsts>-->
<!--    </template>-->
    <component :is="'GlInsts'+glRuntimeFlag" :glComponentInst="glComponentInst" :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"/>
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
