<template>
  <div class="gl-entity-tree">
    <GlBaseTree
      v-model="selectedKeys"
      ref="glBaseTree"
      :treeId="treeId"
      :expandedKeysCacheKey="expandedKeysCacheKey"
      :treeName="treeName"
      :draggable="draggable"
      :searchable="searchable"
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
import {type PropType, ref, toRaw, watch} from 'vue'
import { entityApi, type EntityReader, utils } from '@geelato/gl-ui'
import type { BindField } from '@geelato/gl-ui-schema'
import type { ContextMenuDataType } from './types'
import GlBaseTree from './GlBaseTree.vue'

const emits = defineEmits([
  'selectNode',
  'addNode',
  'updateNode',
  'updateNodeName',
  'deleteNode',
  'clickContextMenuItem',
  'update:modelValue'
])
const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  // 设置该值之后，展开的keys将会缓存到本地浏览器
  expandedKeysCacheKey: String,
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
  searchable:Boolean,
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

const selectedKeys = ref(props.modelValue)
watch(() => props.modelValue, (newVal) => {
  selectedKeys.value = newVal
},{deep:true})
watch(selectedKeys, (newVal) => {
  emits('update:modelValue', newVal)
}, { deep: true })
const glBaseTree = ref()

const key = utils.gid('entityTree')
const loadTreeDataFn = () => {
  if (props.entityReader) {
    return entityApi.queryByEntityReader(props.entityReader,false,key)
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
  return entityApi.save(props.treeEntityName, data).then((res) => {
    emits('updateNodeName', params)
    return res
  })
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

/**
 * 从服务端获取树数据，并渲染树
 */
const fetchData = ()=>{
  return glBaseTree.value.fetchData()
}

/**
 * 基于当前的数据重新渲染树
 */
const reRender = () => {
  glBaseTree.value.reRender()
}
/**
 * 选中传入的节点
 * @param node
 */
const selectNode = (node: any) => {
  glBaseTree.value.selectNode(node)
}
/**
 * 基于key选中节点
 * @param nodeKey
 */
const selectNodeByKey = (nodeKey: string) => {
  glBaseTree.value.selectNodeByKey(nodeKey)
}

/**
 * 搜索树标题，并录入到输入框中
 * @param keywords
 */
const search = (keywords: string) => {
  glBaseTree.value.search(keywords)
}

defineExpose({ fetchData,reRender, selectNode,selectNodeByKey,search })
</script>
<style>
.gl-entity-tree {
}
</style>
