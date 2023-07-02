<script lang="ts">
/**
 *  基于当前选中的页面组件进行渲染，
 *  当前选中的页面组件为：componentStore.currentComponentTree[0]
 */
export default {
  name: "GlBasePage"
}
</script>
<script lang="ts" setup>

import {componentStoreFactory} from "@geelato/gl-ide";
import {useGlobal, emitter, utils} from "@geelato/gl-ui";
import GlInst from "../dnd/GlInst.vue";
import {onUnmounted, provide} from "vue";

const emits = defineEmits(['drop'])

const props = defineProps({
  componentStoreId: {
    type: String,
    required: true
  },
  /**
   *  是否启用选择中组件后，显示工具条
   */
  enableToolbar: {
    type: Boolean,
    default() {
      return false
    }
  }
})
provide('componentStoreId', props.componentStoreId)
const global = useGlobal()
const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)
const pageInstId = componentStore.currentComponentTree[0].id
// 特殊处理，解决历史数据问题GlBlockRoot->GlPage
if (componentStore.currentComponentTree[0].componentName === 'GlBlockRoot') {
  componentStore.currentComponentTree[0].componentName = 'GlPage'
}
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
    // ！！！注意，这里对虚拟节点做了特殊处理，id命名规则为virtual_开头
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

const onSetCurrentSelectedComponentId = (data: any) => {
  // console.log('setCurrentSelectedComponentId data:', data, pageInstId === data.fromPageId)
  if (pageInstId === data.fromPageId) {
    utils.sleep(120).then(() => {
      setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsSelected', componentStore.currentSelectedComponentId)
    })
  }
}
const onSetCurrentHoverComponentId = (data: any) => {
  if (pageInstId === data.fromPageId) {
    utils.sleep(120).then(() => {
      if (componentStore.currentSelectedComponentId != componentStore.currentHoverComponentId) {
        setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsHover', componentStore.currentHoverComponentId)
      }
    })
  }
}
console.log('props:', props)
if (props.enableToolbar) {
  emitter.on('setCurrentSelectedComponentId', onSetCurrentSelectedComponentId)
  emitter.on('setCurrentHoverComponentId', onSetCurrentHoverComponentId)
}

onUnmounted(() => {
  if (props.enableToolbar) {
    emitter.off('setCurrentSelectedComponentId', onSetCurrentSelectedComponentId)
    emitter.off('setCurrentSelectedComponentId', onSetCurrentHoverComponentId)
  }
  console.log('BasePage > onUnmounted()')
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
            :componentStoreId="componentStoreId"
    >
    </GlInst>
  </div>
</template>
<style>
.gl-base-page {
  padding: 0 1em 0 0;
  overflow: hidden;
}
</style>