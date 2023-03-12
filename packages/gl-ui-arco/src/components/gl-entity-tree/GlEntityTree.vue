<template>
  <div class="gl-entity-tree">
    <GlBaseTree :treeId="treeId" ref="glBaseTree"
                :loadTreeData="loadTreeData"
                :addNode="addNode"
                :renameNode="renameNode"
                :deleteNode="deleteNode"

                @selectNode="onSelectNode"
    ></GlBaseTree>
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

const emits = defineEmits(['selectNode', 'addNode', 'updateNode', 'renameNode', 'deleteNode', 'clickContextMenuItem'])
const props = defineProps({
  treeId: {
    type: [String, Number],
    required: true
  }
})

const glBaseTree = ref()


const loadTreeData = () => {
  return entityApi.query('platform_tree_node', 'treeId,id key,title,pid,iconType,type nodeType', {treeId: props.treeId}, false)
}

/**
 * 添加节点到后台
 * @param params
 */
const addNode = (params: any) => {
  // addNodeData
  const data = {
    flag: '',
    iconType: params.addNodeData.iconType,
    type: params.addNodeData.nodeType,
    treeId: params.addNodeData.treeId,
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
  console.log('renameNode', params)
  return entityApi.save('platform_tree_node', data)
}

const deleteNode = (params: any) => {
  const data = {
    id: params.clickedNodeData.key,
  }
  console.log('deleteNode', params)
  return entityApi.delete('platform_tree_node', data)
}

const onSelectNode = (params: any) => {
  emits('selectNode',params)
}

</script>
<style>
.gl-entity-tree {
  /*margin: 8px 0 0 8px;*/
}
</style>
