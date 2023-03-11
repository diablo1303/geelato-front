<template>
  <div class="gl-entity-tree">
    <ATree v-if="treeData&&treeData.length>0" blockNode :data="treeData" :draggable="true"
           @select="onSelect" show-line>
      <template #switcher-icon="node, { isLeaf }">
        <GlIconfont :type="node.iconType" style="font-size: 1.2em;color:#3370ff"></GlIconfont>
      </template>
      <template #extra="nodeData">
        <a-trigger ref="contextMenu" position="tl" auto-fit-position :click-to-close="true" :show-arrow="true"
                   @popupVisibleChange="()=>onShowContextMenu(nodeData)">
            <span class="gl-more" style="position: absolute; right: 16px; color: #3370ff;">
              <GlIconfont type="gl-more"></GlIconfont>
            </span>
          <template #content>
            <div style="border:1px solid rgb(231,231,231)">
              <a-menu :style="{ width: '180px', height: '100%' }" :default-open-keys="['0']"
                      :default-selected-keys="['0_2']"
                      breakpoint="xl">
                <a-menu-item class="gl-context-menu-item"
                             v-for="(contextMenuItem,contextMenuItemIndex) in filterContextMenuData"
                             :key="contextMenuItemIndex"
                             @click="() => onMenuItemClick(nodeData,contextMenuItem)">
                  <template #icon>
                    <GlIconfont :type="contextMenuItem.iconType" :style="{color:contextMenuItem.iconColor}"></GlIconfont>
                  </template>
                  {{ contextMenuItem.title }}
                </a-menu-item>
              </a-menu>
            </div>
          </template>
        </a-trigger>
      </template>

    </ATree>
    <a-modal :visible="currentAction&&['addNode','renameNode'].includes(currentAction.action)" @ok="saveNode"
             @cancel="closeModal">
      <template #title>
        {{ currentAction.title }}
      </template>
      <div>
        <a-input v-model="currentEditNodeData.title" @keyup.enter="saveNode"></a-input>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlEntityTree",
};
</script>
<script setup lang="ts">
import {entityApi, utils, Utils,} from "@geelato/gl-ui";
import {PropType, ref} from "vue";

const props = defineProps({
  contextMenuData: {
    type: Array as PropType<Array<ContextMenuDataType>>,
    default() {
      return [
        {title: '新建目录', iconType: 'gl-folder', nodeType: 'folder', useFor: ['folder'], action: 'addNode'},
        {title: '新建自由页面', iconType: 'gl-file', nodeType: 'freePage', useFor: ['folder'], action: 'addNode'},
        {title: '新建表单页面', iconType: 'gl-form', nodeType: 'formPage', useFor: ['folder'], action: 'addNode'},
        {title: '新建列表页面', iconType: 'gl-list', nodeType: 'listPage', useFor: ['folder'], action: 'addNode'},
        {
          title: '重命名',
          iconType: 'gl-edit-square',
          nodeType: 'freePage',
          useFor: ['folder', 'freePage', 'formPage', 'listPage'],
          action: 'renameNode'
        },
        {
          title: '删除',
          iconType: 'gl-delete',
          iconColor:'#cc3636',
          nodeType: 'freePage',
          useFor: ['folder', 'freePage', 'formPage', 'listPage'],
          action: 'deleteNode'
        }
      ]
    }
  }
})
// 注意，所有的contextMenuitem click都会触发clickContextMenuItem事件，若是内置的addNode等，还会先触发addNode等事件
const emits = defineEmits(['addNode', 'renameNode', 'deleteNode', 'clickContextMenuItem'])
const treeData = ref(new Array<any>())
const contextMenu = ref()
const currentClickedNodeData = ref({})
const currentEditNodeData = ref({})
const currentAction = ref({action: '', title: ''})

type ContextMenuDataType = { title: String, iconType: String,iconColor?:String, nodeType: String, useFor: Array<String>, action: String }


const defaultTreeData = [
  {
    title: '根节点',
    key: '0-0',
    nodeType: 'folder',
    children: [],
  }
];

const dragRules = [{type: 'allow', from: '*', to: 'folder'}]

const filterContextMenuData = ref(new Array<ContextMenuDataType>())
const onShowContextMenu = (clickedNodeData: any) => {
  filterContextMenuData.value = props.contextMenuData.filter((item: ContextMenuDataType) => {
    return item.useFor.includes(clickedNodeData.nodeType)
  })
}

/**
 * 点击右键菜单项，进行添加节点、修改节点、删除节点等操作
 * @param clickedNodeData
 * @param contextMenuItemData
 */
const onMenuItemClick = (clickedNodeData: any, contextMenuItemData: ContextMenuDataType) => {
  console.log('onMenuItemClick:', clickedNodeData)
  currentClickedNodeData.value = clickedNodeData
  if (contextMenuItemData.action === 'addNode') {
    currentEditNodeData.value = {
      title: contextMenuItemData.title,
      iconType: contextMenuItemData.iconType,
      nodeType: contextMenuItemData.nodeType
    }
    currentAction.value = {action: 'addNode', title: '添加节点'}
  } else if (contextMenuItemData.action === 'renameNode') {
    currentEditNodeData.value = JSON.parse(JSON.stringify(clickedNodeData))
    currentAction.value = {action: 'renameNode', title: '修改名称'}
  } else if (contextMenuItemData.action === 'deleteNode') {
    currentAction.value = {action: 'deleteNode', title: '删除节点'}
    console.log('currentAction deleteNode',clickedNodeData)

    deleteNode(currentClickedNodeData.value)
  } else {
    // custom click event
  }
  // 所有的操作都会触发此事件
  emits('clickContextMenuItem', {clickedNodeData, contextMenuItemData})
}

const saveNode = () => {
  console.log('saveNode', currentEditNodeData)
  // @ts-ignore
  if (currentEditNodeData.value.key) {
    // 修改
    updateNode(currentClickedNodeData.value, currentEditNodeData.value)
  } else {
    // 新增
    addNode(currentClickedNodeData.value, currentEditNodeData.value)
  }
  currentAction.value = {action: '', title: ''}
}

const updateNode = (clickedNodeData: any, editNodeData: any) => {
  clickedNodeData.title = editNodeData.title
  refreshTree()
  emits('renameNode', {clickedNodeData, editNodeData: editNodeData})
}
const addNode = (clickedNodeData: any, addNodeData: any) => {
  const children = clickedNodeData.children || []
  const node = JSON.parse(JSON.stringify(addNodeData))
  node.key = utils.gid('', 32)
  console.log('addNode:',node)
  children.push(node)
  clickedNodeData.children = children
  refreshTree()
  emits('addNode', {clickedNodeData, addNodeData: node})
}

const deleteNode = (clickedNodeData: any) => {
  emits('deleteNode', {clickedNodeData})
}

const reloadTreeData = () => {
  entityApi.query('platform_tree_node', 'id key,title,pid,iconType,type nodeType', {}, false).then((res) => {
    console.log('platform_tree_node:', res)
    const id = '1976169388038462609'
    treeData.value.push(...Utils.ConvertUtil.listToTree(res.data.result || res.data.data, id, 'key'))
    console.log('treeData', treeData)
  })
}
const refreshTree = () => {
  treeData.value = [...treeData.value]
}

const onContextMenuClick = (treeKey: string, menuKey: string | number) => {
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
};

const onSelect = () => {

}

const closeModal = () => {
  currentAction.value = {action: '', title: ''}
}

// 初始化加载
reloadTreeData()
// 对外提供方法
defineExpose(['refreshTree'])
</script>
<style>
.gl-entity-tree .arco-tree-node-drag-icon {
  display: none !important;
}

.gl-entity-tree .gl-more {
  /*display: none;*/
}

.gl-entity-tree:hover .gl-more {
  display: inline-block;
}

.gl-context-menu-item {
  line-height: 2em !important;
  /*padding: 0 !important;*/
  /*margin: 0 !important;*/
}
</style>
