<template>
  <div class="gl-app-tree">
    <GlEntityTree :treeId="treeId" @selectNode="onSelectNode"></GlEntityTree>
  </div>
</template>
<script lang="ts">
export default {
  name: "AppTree",
};
</script>
<script setup lang="ts">
import {useIdeStore, useAppStore, Page} from "@geelato/gl-ide";
import {ref} from "vue";

const ideStore = useIdeStore()
const appStore = useAppStore()
appStore.currentApp.id = '1976169388038462609'

// treeId，即应用的id
const treeId = ref(appStore.currentApp.id || '')

const onSelectNode = (params:any) => {
  const dataRef = params.selectedNode
  ideStore.openPage(<Page>{
    type: dataRef.nodeType,
    extendId: dataRef.key,
    title: dataRef.title,
    iconType: dataRef.iconType
  })
}

// const onSelect = (selectedKeys: Array<string | number>, data: any) => {
//   console.log('selectedKeys,data:', selectedKeys, data)
//   const dataRef = data.node
//   ideStore.openPage(<Page>{
//     type: dataRef.nodeType,
//     id: dataRef.key,
//     title: dataRef.title,
//     iconType: dataRef.iconType
//   })
// }

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
