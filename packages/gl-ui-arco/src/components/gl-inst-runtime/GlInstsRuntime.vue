<script lang="ts">
export default {
  name: 'GlInstsRuntime'
}
</script>
<script lang="ts" setup>

import {mixins} from "@geelato/gl-ui";

const props = defineProps({
  ...mixins.props
})

</script>

<template>
  <GlInstRuntime v-if="glComponentInst"
                 v-for="(inst, index) in glComponentInst.children"
                 :parentId=glComponentInst.id
                 :id="inst.id"
                 :key="inst.id"
                 :text="inst.id"
                 :index="index"
                 :glComponentInst="inst"
                 :glIsRuntime="glIsRuntime"
                 :glRuntimeFlag="glRuntimeFlag"
  />
</template>

<style scoped>
</style>