<script lang="ts">
export default {
  name: "GlIdeStageBasePage"
}
</script>
<script lang="ts" setup>

import {componentStoreFactory} from "@geelato/gl-ide";
import {useGlobal, emitter, utils} from "@geelato/gl-ui";
import GlInst from "../dnd/GlInst.vue";

const props = defineProps({
  componentStoreId: {
    type: String,
    default() {
      return 'useComponentStore'
    }
  }
})

const global = useGlobal()
const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)

/**
 * 设置工具条的位置
 * @param toolbarBreadcrumbsId 一般该Id值为'glToolbarBreadcrumbsHover'或'glToolbarBreadcrumbsSelected'
 * @param moveToTargetId
 */
const setToolbarBreadcrumbsPosition = (toolbarBreadcrumbsId: string, moveToTargetId: string) => {
  // console.log('setToolbarBreadcrumbsPosition,toolbarBreadcrumbsId:', toolbarBreadcrumbsId, 'moveToTargetId:',moveToTargetId)
  if (!moveToTargetId || moveToTargetId === 'glToolbarBreadcrumbsHover' || moveToTargetId === 'glToolbarBreadcrumbsSelected' || moveToTargetId === 'glToolbarBreadcrumbs') {
    return
  }
  let toolbarBreadcrumbsDiv = document.getElementById(toolbarBreadcrumbsId);
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
  const target = typeof moveToTargetId === 'string' ? document.getElementById(moveToTargetId) : moveToTargetId
  if (!target) {
    // 对于虚拟节点，找不到停靠的对象是正常的情况
    if (moveToTargetId.indexOf('virtual_') === -1) {
      console.error('通过moveToTargetId(' + moveToTargetId + ')找不到停靠的对象。')
    }
    return
  }
  // @ts-ignore
  const stageDom = document.getElementById(componentStore.currentComponentTree[0].id)
  const stageDomRect = stageDom?.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  // @ts-ignore
  toolbarBreadcrumbsDiv.style.top = (scrollTop + targetRect.top) + 'px';
  // @ts-ignore
  toolbarBreadcrumbsDiv.style.left = (scrollLeft + targetRect.left - stageDomRect.left) + "px";
}

emitter.on('setCurrentSelectedComponentId', (data) => {
  utils.sleep(120).then(() => {
    setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsSelected', componentStore.currentSelectedComponentId)
  })
})
emitter.on('setCurrentHoverComponentId', (data) => {
  utils.sleep(120).then(() => {
    if (componentStore.currentSelectedComponentId != componentStore.currentHoverComponentId) {
      setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsHover', componentStore.currentHoverComponentId)
    }
  })
})

</script>

<template>
  <div class="gl-base-page" v-if="componentStore.currentComponentTree.length>0"
       :id="componentStore.currentComponentTree[0].id">
    <GlToolbarBreadcrumbs eventType="Hover"></GlToolbarBreadcrumbs>
    <GlToolbarBreadcrumbs eventType="Selected"></GlToolbarBreadcrumbs>
    <GlInst :id="componentStore.currentComponentTree[0].id"
            :key="componentStore.currentComponentTree[0].id"
            :text="componentStore.currentComponentTree[0].id"
            :index="0"
            :glComponentInst="componentStore.currentComponentTree[0]"
            :componentStoreId="componentStoreId">
      <GlInsts :glComponentInst="componentStore.currentComponentTree[0]">
      </GlInsts>
    </GlInst>
  </div>
</template>
<style>
.gl-base-page {
  padding: 0 1em 0 0;
  overflow: hidden;
}
</style>