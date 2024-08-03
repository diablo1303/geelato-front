<script setup lang="ts">
import type { PropType } from 'vue'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import { selectComponent } from '@geelato/gl-ui'
import type { PagePermission } from '@geelato/gl-ui'

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
  disabled: Boolean,
  glIsRuntime: Boolean,
  pagePermissions:Object as PropType<PagePermission>
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
      <div class="gl-toolbar-items">
        <slot name="leftItems"></slot>
        <template v-for="(inst, index) in leftItems" :key="index">
          <GlComponent
            :glComponentInst="inst"
            :glIsRuntime="glIsRuntime"
            :pagePermissions="pagePermissions"
            @click="selectComponent($event,inst)"
          ></GlComponent>
        </template>
      </div>
    </a-col>
    <a-col :span="centerColSpan || 0">
      <div class="gl-toolbar-items">
        <span></span>
        <template v-for="(inst, index) in centerItems" :key="index">
          <GlComponent
            v-if="inst"
            v-show="inst?.props?._hidden !== true"
            :glComponentInst="inst"
            :glIsRuntime="glIsRuntime"
            @click="selectComponent($event,inst)"
          ></GlComponent>
        </template>
      </div>
    </a-col>
    <a-col
      :span="rightColSpan || 12"
      style="display: flex; align-items: center; justify-content: end"
    >
      <div class="gl-toolbar-items">
        <template v-for="(inst, index) in rightItems" :key="index">
          <GlComponent
            v-if="inst"
            v-show="inst?.props?._hidden !== true"
            :glComponentInst="inst"
            :glIsRuntime="glIsRuntime"
            @click="selectComponent($event,inst)"
          ></GlComponent>
        </template>
        <slot name="rightItems"></slot>
        <span></span>
      </div>
    </a-col>
  </a-row>
</template>
<style>
.gl-toolbar-items {
  display: flex;
}

.gl-toolbar-items > * {
  margin-right: 8px;
}
</style>
