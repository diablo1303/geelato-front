<template>
  <div class="gl-entity-tree">
    <GlBaseTree :treeId="treeId" ref="glBaseTree"
                :draggable="draggable"
                :loadTreeData="loadTreeDataFn"
                :addNode="addNodeFn"
                :updateNodeName="updateNodeNameFn"
                :updateNode="updateNodeFn"
                :updateNodeSeqNo="updateNodeSeqNoFn"
                :deleteNode="deleteNodeFn"
                @deleteNode="onDeleteNode"
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
import {ref, toRaw} from "vue";
import GlBaseTree from "./GlBaseTree.vue";

const emits = defineEmits(['selectNode', 'addNode', 'updateNode', 'updateNodeName', 'deleteNode', 'clickContextMenuItem'])
const props = defineProps({
  treeId: {
    type: [String, Number],
    required: true
  },
  draggable: {
    type: Boolean,
    default() {
      return false
    }
  },
  /**
   *  树实体名称，默认是平台内置的树
   */
  treeEntityName: {
    type: String,
    default() {
      return 'platform_tree_node'
    }
  },
  /**
   *  树对应的扩展实体，如这是一棵页面树，则对应页面实体
   */
  extendEntityName: {
    type: String,
    required: true
  },
  /**
   *  树对应的扩展实体中指向树实体的外键字段名，默认为extendId
   */
  extendEntityIdFieldName: {
    type: String,
    default() {
      return 'extendId'
    }
  }

})

const glBaseTree = ref()

const loadTreeDataFn = () => {
  return entityApi.query(props.treeEntityName, 'treeId,id key,text title,pid,iconType,type nodeType,flag,seqNo', {
    treeId: props.treeId,
    delStatus: 0
  }, false)
}

/**
 * 添加节点到后台
 * @param params
 */
const addNodeFn = (params: any) => {
  // addNodeData
  const data = {
    flag: '',
    iconType: params.addNodeData.iconType,
    type: params.addNodeData.nodeType,
    treeId: params.addNodeData.treeId,
    text: params.addNodeData.title,
    pid: params.clickedNodeData.key
  }
  return entityApi.save(props.treeEntityName, data)
}
const updateNodeNameFn = (params: any) => {
  const data = {
    id: params.editNodeData.key,
    text: params.editNodeData.title
  }
  console.log('updateNodeName', params)
  return entityApi.save(props.treeEntityName, data)
}

const updateNodeFn = (params: any) => {
  const data = {
    id: params.editNodeData.key,
    text: params.editNodeData.title,
    flag: params.editNodeData.flag,
    iconType: params.editNodeData.iconType,
    type: params.editNodeData.nodeType,
    pid: params.editNodeData.pid
  }
  console.log('updateNode', params)
  return entityApi.save(props.treeEntityName, data)
}

const updateNodeSeqNoFn = (params: any) => {
  const data = {
    id: params.editNodeData.key,
    seqNo: params.editNodeData.seqNo
  }
  console.log('updateNodeSeqNoFn', params)
  return entityApi.save(props.treeEntityName, data)
}

/**
 * 同时删除树节点、删除扩展实体相应记录
 * @param params
 */
const deleteNodeFn = (params: any) => {
  const data = {
    id: params.clickedNodeData.key,
  }
  const extendData = {
    extendId: params.clickedNodeData.key
  }
  return entityApi.deleteBatch([{
    entityName: props.treeEntityName,
    keyValues: data
  }, {entityName: props.extendEntityName, keyValues: extendData}])
}

const onSelectNode = (params: any) => {
  emits('selectNode', params.selectedNode)
}
const onDeleteNode = (params: any) => {
  emits('deleteNode', toRaw(params.clickedNodeData))
}

</script>
<style>
.gl-entity-tree {
  /*margin: 8px 0 0 8px;*/
}
</style>
