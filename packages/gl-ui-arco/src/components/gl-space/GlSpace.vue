<script lang="ts">
export default {
  name: 'GlSpace'
}
</script>
<script lang="ts" setup>
import { mixins } from '@geelato/gl-ui'

const props = defineProps({
  label: String,
  // 默认显示标题
  showLabel: Boolean,
  ...mixins.props
})

</script>
<template>
  <a-space class="gl-space" >
    <component
      :is="'GlInsts' + glRuntimeFlag"
      :glComponentInst="glComponentInst"
      :glIsRuntime="glIsRuntime"
      :glLoopItem="glLoopItem"
      :glLoopIndex="glLoopIndex"
      :glRuntimeFlag="glRuntimeFlag"
    />
  </a-space>
</template>
