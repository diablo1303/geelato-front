<template>
  <div>
    <div class="gl-ide-arco-stage-main" v-if="componentStore.currentComponentTree.length>0"
         :id="componentStore.currentComponentTree[0].id"
         style="padding-top: 2em">
      <gl-x :glComponentInst="componentStore.currentComponentTree[0]"></gl-x>
      <GlToolbarBreadcrumbs eventType="Hover"></GlToolbarBreadcrumbs>
      <GlToolbarBreadcrumbs eventType="Selected"></GlToolbarBreadcrumbs>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlIdeStageFreePage"
}
</script>
<script setup lang="ts">
import {componentStoreFactory, EventNames} from "@geelato/gl-ide";
import {useGlobal, emitter, utils} from "@geelato/gl-ui";

const global = useGlobal()
const componentStore = componentStoreFactory.useComponentStore("useComponentStore")

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
    console.error('通过moveToTargetId(' + moveToTargetId + ')找不到停靠的对象。')
    return
  }
  // @ts-ignore
  const stageDom = document.getElementById(componentStore.currentComponentTree[0].id)
  const stageDomRect = stageDom?.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()
  // @ts-ignore
  toolbarBreadcrumbsDiv.style.top = (scrollTop + targetRect.top)+'px';
  // @ts-ignore
  toolbarBreadcrumbsDiv.style.left = (scrollLeft + targetRect.left - stageDomRect.left) + "px";
}

emitter.on('setCurrentSelectedComponentId', (data) => {
  utils.sleep(120).then(()=>{
    setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsSelected', componentStore.currentSelectedComponentId)
  })
})
emitter.on('setCurrentHoverComponentId', (data) => {
  utils.sleep(120).then(()=> {
    setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsHover', componentStore.currentHoverComponentId)
  })
})

// emitter.on(EventNames.GlIdeToolbarShowCodeViewer, () => {
//   codeViewerVisible.value = true
// })


/**
 *  初始的组件树
 */
// const items: Array<ComponentInstance> = [
//   {
//     componentName: 'GlPage',
//     id: utils.gid('GlPage'),
//     props: {},
//     slots: {},
//     children: [{
//       componentName: 'GlDndPlaceholder',
//       id: utils.gid('pHolder'),
//       props: {
//         info: undefined
//       },
//       slots: {},
//       children: [],
//       actions: []
//     }
//     ],
//     actions: []
//   }
// ]

// 避免update时，重新push items
// if (componentStore.currentComponentTree.length === 0) {
//   componentStore.currentComponentTree.push(...items)
// }
</script>

<style>
.gl-ide-arco-stage-main {
  padding: 10px 10px 2em 10px;
  overflow: hidden;
}
</style>
