<template>
<div class="gl-app-tree">
  <ATree blockNode :data="treeData" :draggable="true" :contextMenu="contextMenu" @select="onSelect">
        <template #extra="nodeData">
<!--          <IconPlus style="position: absolute; right: 8px; font-size: 12px; top: 10px; color: #3370ff;"-->
<!--              @click="() => onIconClick(nodeData)"-->
<!--          />-->
<!--          <IconPlus style="position: absolute; right: 8px; font-size: 12px; top: 10px; color: #3370ff;"-->
<!--                    @click="() => onIconClick(nodeData)"-->
<!--          />-->
          <span style="position: absolute; right: 16px; color: #3370ff;" @click="() => onIconClick(nodeData)">:</span>
        </template>

  </ATree></div>
</template>
<script lang="ts">
export default {
  name: "AppTree",
};
</script>
<script setup lang="ts">
import {useIdeStore,Page} from "@geelato/gl-ide";
const treeData = [
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

const contextMenu = [
  {key: '1', title: '新建目录', iconType: 'gl-folder', nodeType: '', useBy: ['folder'], action: 'addNode'},
  {key: '2', title: '新建自由页面', iconType: 'gl-file', nodeType: 'freePage', useBy: ['folder'], action: 'addNode'},
  {key: '3', title: '新建表单页面', iconType: 'gl-file', nodeType: 'freePage', useBy: ['folder'], action: 'addNode'},
  {key: '4', title: '新建列表页面', iconType: 'gl-file', nodeType: 'freePage', useBy: ['folder'], action: 'addNode'},
  {key: '5', title: '重命名', iconType: 'gl-file', nodeType: 'freePage', action: 'renameNode'},
  {key: '5', title: '删除', iconType: 'gl-file', nodeType: 'freePage', action: 'deleteNode'}
]

const dragRules = [{type: 'allow', from: '*', to: 'folder'}]


const ideStore = useIdeStore()
const onContextMenuClick = (treeKey: string, menuKey: string | number) => {
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
};
const onSelect = (selectedKeys:Array<string | number>,data:any)=>{
  console.log('selectedKeys,data:',selectedKeys,data)
  const dataRef = data.node
  ideStore.openPage(<Page>{
    type:dataRef.nodeType,
    id:dataRef.key,
    title:dataRef.title,
    iconType:dataRef.iconType
  })
}

const onIconClick = (nodeData:any) => {
  console.log('onIconClick:',nodeData)
  ideStore.openPage(<Page>{
    type:nodeData.nodeType,
    id:nodeData.key,
    title:nodeData.title,
    iconType:nodeData.iconType
  })
}

</script>
<style>
.gl-app-tree .arco-tree-node-drag-icon{
  display: none !important;
}
</style>
