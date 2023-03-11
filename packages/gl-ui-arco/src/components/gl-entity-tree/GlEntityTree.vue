<template>
  <div class="gl-entity-tree">
    <GlBaseTree ref="glBaseTree" :loadTreeData="loadTreeData" :addNode="addNode" :renameNode="renameNode"
                  :deleteNode="deleteNode"></GlBaseTree>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlEntityTree",
};
</script>
<script setup lang="ts">
import {entityApi} from "@geelato/gl-ui";
import {ref} from "vue";
import GlBaseTree from "./GlBaseTree.vue";

// treeId，即project表中的id
const treeId = ref('1976169388038462609')
const glBaseTree = ref()


const loadTreeData = () => {
  return entityApi.query('platform_tree_node', 'id key,title,pid,iconType,type nodeType', {}, false)
}

/**
 * 添加节点到后台
 * @param params
 */
const addNode = (params: any) => {
  // addNodeData
  const data = {
    flag: 'menuItem',
    iconType: params.addNodeData.iconType,
    type: params.addNodeData.nodeType,
    treeId: treeId.value,
    title: params.addNodeData.title,
    pid: params.clickedNodeData.key
  }
  return entityApi.save('platform_tree_node', data)
}
const renameNode = (params: any) => {
  const data = {
    id: params.editNodeData.key,
    title: params.editNodeData.title
  }
  console.log('onRenameNode', params)
  return entityApi.save('platform_tree_node', data)
}

const deleteNode = (params: any) => {
  const data = {
    id: params.clickedNodeData.key,
  }
  console.log('onDeleteNode', params)
  return entityApi.delete('platform_tree_node', data)
}

</script>
<style>
.gl-entity-tree {
  /*margin: 8px 0 0 8px;*/
}
</style>
