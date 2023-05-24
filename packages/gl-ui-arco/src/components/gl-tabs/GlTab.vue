<script lang="ts">
export default {
  name: 'GlTab'
}
</script>
<script setup lang="ts">
import {mixins} from "@geelato/gl-ui";

const emits = defineEmits(['tabClick'])
const props = defineProps({
  key: Number,
  title: String,
  iconType: String,
  ...mixins.props
})

const tabClick = (key: any) => {
  emits('tabClick', key)
}
</script>
<template>
  <a-tab-pane :key="key">
    <template #title>
      <span @click="tabClick(key)">
        <GlIconfont v-if="iconType" :type="iconType"/>
      {{ title }}
      </span>
    </template>
    <component :is="'GlInsts'+glRuntimeFlag" :glComponentInst="glComponentInst" :componentStoreId="componentStoreId" :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"/>
  </a-tab-pane>
</template>

<style scoped>

</style>
