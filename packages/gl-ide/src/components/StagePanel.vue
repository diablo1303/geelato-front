<template>
  <div class="gl-designer-stage">
    <a-tabs :editable="true"
            size="small" 
            class="gl-compact" 
            v-model:activeKey="pageStore.currentPageIndex"
            @delete="onDelete"
            @tabClick="tabClick">
      <a-tab-pane v-for="(page,index) in pageStore.pages" :key="index">
        <template #[slotName]>
        <span>
          <GlIconfont :type="page.iconType"></GlIconfont>
          {{ page.title }}
        </span>
        </template>
        <component :is="page.ideStageComponentName" style="overflow-y: auto"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlDesignerStage"
}
</script>
<script lang="ts" setup>
import {usePageStore} from "../stores/UsePageStore";
import uiLibAdapter from "../utils/UiLibAdapter";

const pageStore = usePageStore()
const slotName = uiLibAdapter.getTabSlotName()
const tabClick = (index: number) => {
  pageStore.switchToPage(index)
}
const onDelete = (index: number) => {
  pageStore.closePage(index)
}
</script>

<style>
</style>
