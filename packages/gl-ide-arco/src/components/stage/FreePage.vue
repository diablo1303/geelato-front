<template>
  <div>
    <div class="gl-ide-arco-stage-main" v-if="componentStore.currentComponentTree.length>0"
         :id="componentStore.currentComponentTree[0].id"
         style="padding-top: 2em">
      <gl-x :glComponentInst="componentStore.currentComponentTree[0]"></gl-x>
      <GlToolbarBreadcrumbs eventType="Hover"></GlToolbarBreadcrumbs>
      <GlToolbarBreadcrumbs eventType="Selected"></GlToolbarBreadcrumbs>
      <gl-modal :visible="codeViewerVisible"
                title="生成的配置代码预览"
                :fullscreen="true"
                @ok="codeViewerVisible=false"
                @cancel="codeViewerVisible=false">
        <VueJsonPretty :data="componentStore.currentComponentTree[0]"></VueJsonPretty>
      </gl-modal>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlIdePluginCoreStageFreePage"
}
</script>
<script setup lang="ts">
import {ref} from 'vue'
import {componentStoreFactory, EventNames} from "@geelato/gl-ide";
import {useGlobal, emitter} from "@geelato/gl-ui";
import VueJsonPretty from "vue-json-pretty";

const global = useGlobal()
const componentStore = componentStoreFactory.useComponentStore("useComponentStore")
const codeViewerVisible = ref(false)

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
  // console.log('targetRect:', targetRect, 'scrollTop:', scrollTop)
  // @ts-ignore
  // 对高度低于32的组件进行位置校正 targetRect.height<32?32:targetRect.height
  // - (targetRect.height < 32 ? 32 : targetRect.height) - 2 + "px"
  toolbarBreadcrumbsDiv.style.top = (scrollTop + targetRect.top)+'px';
  // @ts-ignore
  toolbarBreadcrumbsDiv.style.left = (scrollLeft + targetRect.left - stageDomRect.left) + "px";
  // @ts-ignore
  // console.log(toolbarBreadcrumbsDiv?.style,toolbarBreadcrumbsDiv?.style?.top)
}

emitter.on('setCurrentSelectedComponentId', (data) => {
  setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsSelected', componentStore.currentSelectedComponentId)
})
emitter.on('setCurrentHoverComponentId', (data) => {
  setToolbarBreadcrumbsPosition('glToolbarBreadcrumbsHover', componentStore.currentHoverComponentId)
})

emitter.on(EventNames.GlIdeToolbarShowCodeViewer, () => {
  codeViewerVisible.value = true
})


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
