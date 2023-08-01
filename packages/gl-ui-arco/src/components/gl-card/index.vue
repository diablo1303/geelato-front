<template>
  <a-card class="gl-card" :class="{'gl-hidden':isHidden}">
    <template #title>
      <span @click="switchHide" style="cursor: pointer">
        <GlIconfont v-if="isHidden" type="gl-down-circle"></GlIconfont>
        <GlIconfont v-else type="gl-right-circle"></GlIconfont>
      </span> <span>{{ label }}</span>
    </template>
    <!--    <template v-if="glIsRuntime">-->
    <!--&lt;!&ndash;      <slot></slot>&ndash;&gt;-->
    <!--      <GlInstsRuntime :glComponentInst="glComponentInst"  :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"></GlInstsRuntime>-->
    <!--    </template>-->
    <!--    <template v-else>-->
    <!--      <GlInsts :glComponentInst="glComponentInst"></GlInsts>-->
    <!--    </template>-->
    <component :is="'GlInsts'+glRuntimeFlag" :glComponentInst="glComponentInst" :glIsRuntime="glIsRuntime"
               :glRuntimeFlag="glRuntimeFlag"/>
  </a-card>
</template>
<script lang="ts">
export default {
  name: "GlCard"
}
</script>
<script lang="ts" setup>

import {mixins} from "@geelato/gl-ui";
import {ref} from "vue";

const props = defineProps({
  label: String,
  ...mixins.props
})

const isHidden = ref(false)

const switchHide = () => {
  isHidden.value = !isHidden.value
}
</script>

<style>
.gl-card.gl-hidden .arco-card-body {
  display: none;
}
</style>
