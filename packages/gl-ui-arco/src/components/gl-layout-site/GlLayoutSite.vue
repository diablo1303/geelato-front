<script lang="ts">
/**
 *  站点主页面布局
 *  内置了站点主页面使用的一些元素
 */
export default {
  name: 'GlLayoutSite'
}
</script>
<script lang="ts" setup>
import {type PropType, ref, watch} from 'vue'
import {LayoutStore} from './LayoutStore'
import {LayoutMode, LayoutNavigation} from './GlLayout'
import GlLayoutModeSidebar from './GlLayoutModeSidebar.vue'
import GlLayoutModeTopNav from "./GlLayoutModeTopNav.vue";
import GlLayoutModeCollapse from "./GlLayoutModeCollapse.vue";

const layoutStore = LayoutStore()
window.onresize = () => {
  layoutStore.resize()
}
layoutStore.resize()

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  menuItems: Object as PropType<LayoutNavigation>
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
</script>

<template>
  <div class="gl-layout">
    <GlLayoutModeSidebar v-if="layoutStore.layoutMode === LayoutMode.Sidebar"></GlLayoutModeSidebar>
    <GlLayoutModeTopNav v-else-if="layoutStore.layoutMode === LayoutMode.TopNav"></GlLayoutModeTopNav>
    <GlLayoutModeCollapse v-else-if="layoutStore.layoutMode === LayoutMode.Collapse"></GlLayoutModeCollapse>
  </div>
</template>

<style></style>
