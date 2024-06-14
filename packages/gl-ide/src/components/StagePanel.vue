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
        <div class="gl-title">
          <GlIconfont class="gl-first" :type="page.iconType"></GlIconfont>
          {{ page.title }}
          <GlIconfont type="gl-wrong" @click.stop="onDelete(index)"></GlIconfont>
          <GlIconfont type="gl-none"></GlIconfont>
        </div>
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


.gl-designer-stage > .arco-tabs > .arco-tabs-nav{
  box-shadow: 0 0 10px rgba(200, 200, 200, 0.53);
}

.gl-designer-stage > .arco-tabs > .arco-tabs-nav .arco-tabs-nav-ink{
  top: 0;
  color: rgba(248, 248, 248, 0.53);
  height: 0;
}

.gl-designer-stage > .arco-tabs > .arco-tabs-nav .arco-tabs-tab{
  margin:0 0 0 8px;
}

.gl-designer-stage > .arco-tabs > .arco-tabs-nav .arco-tabs-tab-close-btn{
  display: none;
}

.gl-designer-stage > .arco-tabs > .arco-tabs-nav .gl-title .gl-wrong-icon{
  display: none;
}

.gl-designer-stage > .arco-tabs > .arco-tabs-nav .gl-title{
  padding:0 4px;
}

.gl-designer-stage > .arco-tabs > .arco-tabs-nav .arco-tabs-tab-active .gl-title{
  border: 1px solid #165dff;
  border-radius: 2px;
}


.gl-designer-stage > .arco-tabs > .arco-tabs-nav .gl-title:hover{
  font-weight: bold;
}

.gl-designer-stage > .arco-tabs > .arco-tabs-nav .gl-title:hover .gl-wrong-icon{
  display: inline-block;
}

.gl-designer-stage > .arco-tabs > .arco-tabs-nav .gl-title:hover .gl-none-icon{
  display: none;
}
</style>
