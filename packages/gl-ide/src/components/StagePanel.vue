<template>
  <div class="gl-designer-stage">
    <a-tabs size="small" class="gl-compact" v-model:activeKey="activeKey" @tabClick="tabClick">
      <a-tab-pane v-for="(page,index) in pageStore.pages" :key="index">
        <template #[slotName]>
        <span>
          <GlIconfont :type="page.iconType"></GlIconfont>
          {{ page.title }}
        </span>
        </template>
        <component v-if="ideStore.stageRefreshFlag" :is="page.ideStageComponentName"
                   style="overflow-y: auto"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts">
import {defineComponent, watch, type SetupContext, ref, nextTick} from 'vue'
import {useIdeStore} from "../stores/UseIdeStore";
import {usePageStore} from "../stores/UsePageStore";
import uiLibAdapter from "../utils/UiLibAdapter";

export default defineComponent({
  name: "GlDesignerStage",

  setup(props, {emit}: SetupContext) {
    const activeKey = ref(0)
    const ideStore = useIdeStore()
    const pageStore = usePageStore()

    const slotName = uiLibAdapter.getTabSlotName()
    const tabClick = (index: number) => {
      console.log(index, typeof index)
      activeKey.value = index
    }

    watch(() => ideStore.stageRefreshFlag, (flag: Boolean) => {
      nextTick(() => {
        if (!ideStore.stageRefreshFlag) {
          ideStore.stageRefreshFlag = true
        }
      })
    })
    watch(() => pageStore.currentPageIndex, (index: number) => {
      activeKey.value = Number(index)
      console.log('activeKey.value', activeKey.value, typeof index)
    })

    return {
      slotName,
      tabClick,
      activeKey,
      ideStore,
      pageStore
    }
  }
})
</script>

<style>
/*.gl-designer-stage > div > div > div > div > .ant-tabs-tab + .ant-tabs-tab {*/
/*  margin: 0 0 0 12px;*/
/*}*/
</style>
