<template>
  <div class="gl-app-tree">
    <ATree v-if="treeData&&treeData.length>0" blockNode :data="treeData" :draggable="true"
           @select="onSelect" show-line>
      <template #switcher-icon="node, { isLeaf }">
        <GlIconfont :type="node.iconType"></GlIconfont>
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
                    <GlIconfont :type="contextMenuItem.iconType"></GlIconfont>
                  </template>
                  {{ contextMenuItem.title }}
                </a-menu-item>
              </a-menu>
            </div>
          </template>
        </a-trigger>
      </template>

    </ATree>
    <a-modal :visible="currentAction&&['addNode','renameNode'].includes(currentAction.action)" @ok="saveNode">
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
  name: "AppTree",
};
</script>
<script setup lang="ts">
import {useIdeStore, Page} from "@geelato/gl-ide";
import {entityApi, utils, Utils,} from "@geelato/gl-ui";
import {useAppStore} from "@geelato/gl-ide/src/stores/UseAppStore";
import {computed, ref} from "vue";
import GlIconfontSetter from "@/components/setters/property-setters/GlIconfontSetter.vue";

const treeData = ref(new Array<any>())
const contextMenu = ref()
const currentClickedNodeData = ref({})
const currentEditNodeData = ref({})
const currentAction = ref({action: '', title: ''})
// const currentContextMenuItemData = ref({} as ContextMenuDataType)
const appStore = useAppStore()

type ContextMenuDataType = { title: String, iconType: String, nodeType: String, useFor: Array<String>, action: String }

entityApi.query('platform_tree_node', 'id key,text title,parent pid,icon iconType,type nodeType', {}, false).then((res) => {
  console.log('platform_tree_node:', res)
  const id = '1976169388038462609'
  treeData.value.push(...Utils.ConvertUtil.listToTree(res.data.result || res.data.data, id))
  console.log('treeData', treeData)
})
const treeDataX = [
  {
    title: '模块A',
    key: '0-0',
    nodeType: 'folder',
    children: [
      {title: '自由页面', key: '0-0-0', iconType: 'gl-file', nodeType: 'freePage'},
      {title: '表单页面', key: '0-0-1', iconType: 'gl-file', nodeType: 'formPage'},
      {title: '列表页面', key: '0-0-2', iconType: 'gl-file', nodeType: 'listPage'},
      {title: '动作指令', key: '0-0-3', iconType: 'gl-thunderbolt', nodeType: 'commandPage'},
      {title: '数据模型', key: '0-0-4', iconType: 'gl-database', nodeType: 'dbmPage'}
    ],
  },
  {
    title: '模块B',
    key: '0-1',
    nodeType: 'folder',
    children: [
      {title: '自由页面', key: '0-1-0', iconType: 'gl-file', nodeType: 'freePage'},
      {title: '表单页面', key: '0-1-1', iconType: 'gl-file', nodeType: 'formPage'},
      {title: '列表页面', key: '0-1-2', iconType: 'gl-file', nodeType: 'listPage'},
      {title: '动作指令', key: '0-1-3', iconType: 'gl-thunderbolt', nodeType: 'commandPage'},
      {title: '数据模型', key: '0-1-4', iconType: 'gl-database', nodeType: 'dbmPage'}
    ],
  },
];

const allContextMenuData: Array<ContextMenuDataType> = [
  {title: '新建目录', iconType: 'gl-folder', nodeType: 'folder', useFor: ['gl-folder'], action: 'addNode'},
  {title: '新建自由页面', iconType: 'gl-file', nodeType: 'freePage', useFor: ['gl-folder'], action: 'addNode'},
  {title: '新建表单页面', iconType: 'gl-form', nodeType: 'formPage', useFor: ['gl-folder'], action: 'addNode'},
  {title: '新建列表页面', iconType: 'gl-list', nodeType: 'listPage', useFor: ['gl-folder'], action: 'addNode'},
  {title: '重命名', iconType: 'gl-edit-square', nodeType: 'freePage', useFor: ['gl-folder', 'gl-file'], action: 'renameNode'},
  {title: '删除', iconType: 'gl-delete', nodeType: 'freePage', useFor: ['gl-folder', 'gl-file'], action: 'deleteNode'}
]

const filterContextMenuData = ref(new Array<ContextMenuDataType>())

const dragRules = [{type: 'allow', from: '*', to: 'folder'}]

const onShowContextMenu = (clickedNodeData: any) => {
  filterContextMenuData.value = allContextMenuData.filter((item) => {
    return item.useFor.includes(clickedNodeData.iconType)
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
  }
}

const saveNode = () => {
  console.log('saveNode', currentEditNodeData)
  if (currentEditNodeData.value.key) {
    // 修改
    updateNode(currentClickedNodeData.value, currentEditNodeData.value)
  } else {
    // 新增
    addNode(currentClickedNodeData.value, currentEditNodeData.value)
  }
  currentAction.value = {action: '', title: ''}
}

const updateNode = (clickNodeData: any, editingNodeData: any) => {
  clickNodeData.title = editingNodeData.title
  treeData.value = [...treeData.value]
}
const addNode = (clickNodeData: any, newNodeData: any) => {

  const children = clickNodeData.children || []
  const node = JSON.parse(JSON.stringify(newNodeData))
  node.key = utils.gid('', 32)
  children.push(node)
  clickNodeData.children = children

  treeData.value = [...treeData.value]
}


const ideStore = useIdeStore()
const onContextMenuClick = (treeKey: string, menuKey: string | number) => {
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
};
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
.gl-app-tree .arco-tree-node-drag-icon {
  display: none !important;
}

.gl-app-tree .gl-more {
  /*display: none;*/
}

.gl-app-tree:hover .gl-more {
  display: inline-block;
}

.gl-context-menu-item {
  line-height: 2em !important;
  /*padding: 0 !important;*/
  /*margin: 0 !important;*/
}
</style>
