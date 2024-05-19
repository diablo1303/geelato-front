<template>
  <div class="gl-command-editor-sidebar gl-ide-sidebar">
      <GlComponentsSidebar
        :size="SizeType.small"
        :componentGroups="componentGroups"
        :tabs="tabs"
      ></GlComponentsSidebar>
  </div>
</template>

<script lang="ts" setup>
import { SizeType } from '../Types'
import { sidebar as blockBrowserSidebar } from './blocks-browser/Config'
import { sidebar as blockApiSidebar } from './blocks-api/Config'
import {computed} from "vue";

const sidebarMap = {
  'useComponentBrowserBlockStore':blockBrowserSidebar,
  'useComponentApiBlockStore':blockApiSidebar,
}

const props = defineProps({
  componentStoreId: {
    type: String,
    default() {
      return 'useComponentBrowserBlockStore'
    }
  }
})

const componentGroups = computed(() => {
  // @ts-ignore
  return sidebarMap[props.componentStoreId].componentGroups
})

const tabs = computed(() => {
  // @ts-ignore
  return sidebarMap[props.componentStoreId].tabs
})
</script>
