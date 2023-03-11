<template>
  <div class="gl-app-tree">
    <GlEntityTree ref="glEntityTree" @addNode="onAddNode" @renameNode="onRenameNode" @deleteNode="onDeleteNode"></GlEntityTree>
  </div>
</template>
<script lang="ts">
export default {
  name: "AppTree",
};
</script>
<script setup lang="ts">
import {useIdeStore, Page} from "@geelato/gl-ide";
import {entityApi} from "@geelato/gl-ui";
import {ref} from "vue";

// treeId，即project表中的id
const treeId = ref('1976169388038462609')
const ideStore = useIdeStore()
const glEntityTree = ref()
const onAddNode = (params:any) => {
  // addNodeData
  const data = {
    flag: 'menuItem',
    iconType: params.addNodeData.iconType,
    type: params.addNodeData.nodeType,
    treeId: treeId.value,
    title: params.addNodeData.title,
    pid: params.clickedNodeData.key
  }
  entityApi.save('platform_tree_node', data).then((res: any) => {

  })
}
const onRenameNode = (params:any) => {
  const data = {
    id: params.editNodeData.key,
    title: params.editNodeData.title
  }
  console.log('onRenameNode',params)
  entityApi.save('platform_tree_node', data).then((res: any) => {

  })
}

const onDeleteNode = (params:any) => {
  const data = {
    id: params.clickedNodeData.key,
  }
  console.log('onRenameNode',params)
  entityApi.delete('platform_tree_node', data).then((res: any) => {
    glEntityTree.value.reloadTreeData()
  })
}

const onSelect = (selectedKeys: Array<string | number>, data: any) => {
  console.log('selectedKeys,data:', selectedKeys, data)
  const dataRef = data.node
  ideStore.openPage(<Page>{
    type: dataRef.nodeType,
    id: dataRef.key,
    title: dataRef.title,
    iconType: dataRef.iconType
  })
}

const onIconClick = (nodeData: any) => {
  console.log('onIconClick:', nodeData)
  ideStore.openPage(<Page>{
    type: nodeData.nodeType,
    id: nodeData.key,
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
