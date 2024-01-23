<script setup lang="ts">
import type { PropType } from 'vue'
import type { ComponentInstance } from '@geelato/gl-ui-schema'

const props = defineProps({
  leftColSpan: Number,
  centerColSpan: Number,
  rightColSpan: Number,
  leftItems: {
    type: Array as PropType<ComponentInstance[]>,
    default() {
      return []
    }
  },
  centerItems: {
    type: Array as PropType<ComponentInstance[]>,
    default() {
      return []
    }
  },
  rightItems: {
    type: Array as PropType<ComponentInstance[]>,
    default() {
      return []
    }
  },
  disabled: Boolean
})

// const leftItemsCompute = computed(() => {
//   return props.leftItems.filter((inst) => {
//     return inst.props._hidden !== true
//   })
// })
// const leftItemsComputeHidden = computed(() => {
//   return props.leftItems.filter((inst) => {
//     return inst.props._hidden === true
//   })
// })
//
// const rightItemsCompute = computed(() => {
//   return props.rightItems.filter((inst) => {
//     return inst.props._hidden !== true
//   })
// })
//
// const centerItemsCompute = computed(() => {
//   return props.centerItems.filter((inst) => {
//     return inst.props._hidden !== true
//   })
// })
</script>

<template>
  <a-row class="gl-toolbar">
    <a-col :span="leftColSpan || 12">
      <a-space style="margin-left: -8px">
        <slot name="leftItems"></slot>
        <template v-for="(inst, index) in leftItems" :key="index">
          <GlComponent v-if="inst&&inst.props?._hidden!==true" :glComponentInst="inst"></GlComponent>
        </template>
      </a-space>
    </a-col>
    <a-col :span="centerColSpan || 0">
      <a-space>
        <span></span>
        <template v-for="(inst, index) in centerItems" :key="index">
          <GlComponent v-if="inst" :glComponentInst="inst"></GlComponent>
        </template>
      </a-space>
    </a-col>
    <a-col
      :span="rightColSpan || 12"
      style="display: flex; align-items: center; justify-content: end"
    >
      <a-space>
        <template v-for="(inst, index) in rightItems" :key="index">
          <GlComponent v-if="inst" :glComponentInst="inst"></GlComponent>
        </template>
        <slot name="rightItems"></slot>
        <span></span>
      </a-space>
    </a-col>
  </a-row>
</template>
