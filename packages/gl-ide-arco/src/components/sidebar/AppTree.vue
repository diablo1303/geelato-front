<template>
  <div class="gl-app-tree">
    <GlEntityTree :treeId="appStore.currentApp.id"
                  :treeName="appStore.currentApp.name"
                  :draggable="true"
                  extendEntityName="platform_app_page"
                  @selectNode="onSelectNode"
                  @deleteNode="onDeleteNode"
    >
    </GlEntityTree>
  </div>
</template>
<script lang="ts">
export default {
  name: "AppTree",
};
</script>
<script setup lang="ts">
import {useIdeStore, useAppStore, Page, usePageStore} from "@geelato/gl-ide";

const ideStore = useIdeStore()
const appStore = useAppStore()
const pageStore = usePageStore()
pageStore.addPageTemplate("formPage", import("../stage/formPageTemplate.json"))
pageStore.addPageTemplate("freePage", import("../stage/freePageTemplate.json"))
pageStore.addPageTemplate("listPage", import("../stage/listPageTemplate.json"))

const onSelectNode = (params: any) => {
  console.log('onSelectNode() > params:', params)
  if (['root', 'folder'].indexOf(params.nodeType) >= 0) {
    // 根节点或目录节点
  } else {
    // 子节点
    const dataRef = params
    ideStore.openPage(<Page>{
      type: dataRef.nodeType,
      extendId: dataRef.key,
      title: dataRef.title,
      iconType: dataRef.iconType
    })
  }
}

const onDeleteNode = (params: any) => {
  if (['root'].indexOf(params.nodeType) >= 0) {
    // 根节点
  } else {
    // 子节点
    const dataRef = params
    ideStore.closePage(<Page>{
      type: dataRef.nodeType,
      extendId: dataRef.key,
      title: dataRef.title,
      iconType: dataRef.iconType
    })
  }
}

const onIconClick = (nodeData: any) => {
  console.log('onIconClick:', nodeData)
  ideStore.openPage(<Page>{
    type: nodeData.nodeType,
    extendId: nodeData.key,
    title: nodeData.title,
    iconType: nodeData.iconType
  })
}

</script>
<style>
.gl-app-tree {
  margin: 8px 0 0 8px;
}
</style>
