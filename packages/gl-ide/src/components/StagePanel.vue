<template>
  <div class="gl-designer-stage">
    <!-- 这里需加上 :destroy-on-hide="true"，默认值为false，否则在页面切换时，各个页面重复更新渲染，性能很差-->
    <a-tabs :editable="true"
            size="small"
            class="gl-compact"
            :activeKey="pageStore.currentPageIndex"
            :destroy-on-hide="true"
            @delete="onDelete"
            @tabClick="tabClick">
      <a-tab-pane v-for="(page,index) in pageStore.pages" :key="index">
        <template #[slotName]>
        <span>
          <GlIconfont :type="page.iconType"></GlIconfont>
          {{ page.title }}
        </span>
        </template>
        <keep-alive>
          <component :is="page.ideStageComponentName" style="overflow-y: auto"></component>
        </keep-alive>
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
// @ts-nocheck
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
