<template>
  <div class="gl-entity-tree">
    <GlBaseTree
      ref="glBaseTree"
      :treeId="treeId"
      :treeName="treeName"
      :draggable="draggable"
      :loadTreeData="loadTreeDataFn"
      :addNode="addNodeFn"
      :updateNodeName="updateNodeNameFn"
      :updateNodeIcon="updateNodeIconFn"
      :updateNode="updateNodeFn"
      :updateNodeSeqNo="updateNodeSeqNoFn"
      :deleteNode="deleteNodeFn"
      @deleteNode="onDeleteNode"
      @selectNode="onSelectNode"
      @clickContextMenuItem="clickContextMenuItem"
      :contextMenuData="contextMenuData"
    ></GlBaseTree>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlEntityTree'
}
</script>
<script setup lang="ts">
import { entityApi, type EntityReader } from '@geelato/gl-ui'
import { type PropType, ref, toRaw } from 'vue'
import GlBaseTree from './GlBaseTree.vue'
import type { BindField } from '@geelato/gl-ui-schema'
import type { ContextMenuDataType } from './types'

const emits = defineEmits([
  'selectNode',
  'addNode',
  'updateNode',
  'updateNodeName',
  'deleteNode',
  'clickContextMenuItem'
])
const props = defineProps({
  treeId: {
    type: [String, Number],
    required: true
  },
  /**
   *  树根节点名称
   */
  treeName: {
    type: String,
    default() {
      return '根'
    }
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
   * 数据实体
   */
  entityReader: {
    type: Object as PropType<EntityReader>,
    required: true
  },
  /**
   * 菜单项
   */
  contextMenuData: {
    type: Array as PropType<Array<ContextMenuDataType>>,
    default() {
      return []
    }
  },
  /**
   * 树对应的扩展实体，如这是一棵页面树，则对应页面实体
   * 树对应的扩展实体中指向树实体的外键字段名，默认为extendId
   */
  extendEntityField: {
    type: Object as PropType<BindField>,
    required: true
  }
})

const glBaseTree = ref()

const loadTreeDataFn = () => {
  if (props.entityReader) {
    return entityApi.queryByEntityReader(props.entityReader)
  }
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
    type: params.addNodeData._nodeType,
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
  return entityApi.save(props.treeEntityName, data)
}

const updateNodeIconFn = (params: any) => {
  const data = {
    id: params.editNodeData.key,
    iconType: params.editNodeData.iconType
  }
  return entityApi.save(props.treeEntityName, data)
}

const updateNodeFn = (params: any) => {
  const data = {
    id: params.editNodeData.key,
    text: params.editNodeData.title,
    flag: params.editNodeData.flag,
    iconType: params.editNodeData.iconType,
    type: params.editNodeData._nodeType,
    pid: params.editNodeData.pid
  }
  // console.log('updateNode', params)
  return entityApi.save(props.treeEntityName, data)
}

const updateNodeSeqNoFn = (params: any) => {
  const data = {
    id: params.editNodeData.key,
    seqNo: params.editNodeData.seqNo
  }
  // console.log('updateNodeSeqNoFn', params)
  return entityApi.save(props.treeEntityName, data)
}

/**
 * 同时删除树节点、删除扩展实体相应记录
 * @param params
 */
const deleteNodeFn = (params: any) => {
  const data = {
    id: params.clickedNodeData.key
  }
  const extendData = {
    [props.extendEntityField.fieldName]: params.clickedNodeData.key
  }
  return entityApi.deleteBatch([
    {
      entityName: props.treeEntityName,
      keyValues: data
    },
    { entityName: props.extendEntityField.entityName, keyValues: extendData }
  ])
}

const onSelectNode = (params: any) => {
  emits('selectNode', params.selectedNode)
}
const onDeleteNode = (params: any) => {
  emits('deleteNode', toRaw(params.clickedNodeData))
}

const clickContextMenuItem = (params: any) => {
  emits('clickContextMenuItem', params)
}

const refresh = () => {
  glBaseTree.value.refreshTree()
}
const selectNode = (node: any) => {
  glBaseTree.value.selectNode(node)
}

defineExpose({ refresh, selectNode })
</script>
<style>
.gl-entity-tree {
  /*margin: 8px 0 0 8px;*/
}
</style>
