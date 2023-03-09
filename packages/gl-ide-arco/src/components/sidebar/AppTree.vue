<template>
  <div class="gl-app-tree">
    <ATree v-if="treeNodes&&treeNodes.length>0" blockNode :data="treeNodes" :draggable="true" :contextMenu="contextMenu" @select="onSelect">
      <template #extra="nodeData">
        <!--          <IconPlus style="position: absolute; right: 8px; font-size: 12px; top: 10px; color: #3370ff;"-->
        <!--              @click="() => onIconClick(nodeData)"-->
        <!--          />-->
        <!--          <IconPlus style="position: absolute; right: 8px; font-size: 12px; top: 10px; color: #3370ff;"-->
        <!--                    @click="() => onIconClick(nodeData)"-->
        <!--          />-->
        <a-trigger position="tl" auto-fit-position :unmount-on-close="false" :show-arrow="true">
            <span class="gl-more" style="position: absolute; right: 16px; color: #3370ff;"
                  @click="() => onIconClick(nodeData)">
            <GlIconfont type="gl-more"></GlIconfont>
            </span>
          <template #content>
            <div style="border:1px solid rgb(231,231,231)">
              <a-menu
                  :style="{ width: '180px', height: '100%' }"
                  :default-open-keys="['0']"
                  :default-selected-keys="['0_2']"
                  breakpoint="xl"
              >
                <a-menu-item v-for="item in contextMenu" :key="item.key">
                  <template #icon>
                    <GlIconfont :type="item.iconType"></GlIconfont>
                  </template>
                  {{ item.title }}
                </a-menu-item>
              </a-menu>
            </div>
          </template>
        </a-trigger>

      </template>

    </ATree>
  </div>
</template>
<script lang="ts">
export default {
  name: "AppTree",
};
</script>
<script setup lang="ts">
import {useIdeStore, Page} from "@geelato/gl-ide";
import {entityApi, Utils,} from "@geelato/gl-ui";
import {useAppStore} from "@geelato/gl-ide/src/stores/UseAppStore";
import {ref} from "vue";

const treeNodes = ref(new Array<any>())
const appStore = useAppStore()
entityApi.query('platform_tree_node', 'id key,text title,parent pid,icon iconType,type nodeType', {}, false).then((result) => {
  console.log('platform_tree_node:', result)
  const id = '1976169388038462609'
  treeNodes.value.push(Utils.ConvertUtil.listToTree(result.data.data, id))
  console.log('treeNodes', treeNodes)
})
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
  {key: '3', title: '新建表单页面', iconType: 'gl-form', nodeType: 'freePage', useBy: ['folder'], action: 'addNode'},
  {key: '4', title: '新建列表页面', iconType: 'gl-list', nodeType: 'freePage', useBy: ['folder'], action: 'addNode'},
  {key: '5', title: '重命名', iconType: 'gl-edit-square', nodeType: 'freePage', action: 'renameNode'},
  {key: '5', title: '删除', iconType: 'gl-delete', nodeType: 'freePage', action: 'deleteNode'}
]

const dragRules = [{type: 'allow', from: '*', to: 'folder'}]


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
</style>
