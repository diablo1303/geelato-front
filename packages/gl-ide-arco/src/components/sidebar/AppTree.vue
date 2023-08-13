<template>
  <div class="gl-app-tree">
    <GlEntityTree :treeId="appStore.currentApp.id"
                  :treeName="appStore.currentApp.name"
                  :draggable="true"
                  :entityReader="entityReader"
                  :contextMenuData="contextMenuData"
                  :extendEntityField="{entityName:'platform_app_page',fieldName:'extendId'}"
                  @selectNode="onSelectNode"
                  @deleteNode="onDeleteNode"
    >
    </GlEntityTree>
  </div>
</template>
<script lang="ts">
export default {
  name: "AppTree",
};
</script>
<script setup lang="ts">
import {useIdeStore, useAppStore, Page, usePageStore} from "@geelato/gl-ide";
import {EntityReader, EntityReaderParam, FieldMeta} from "@geelato/gl-ui";

const ideStore = useIdeStore()
const appStore = useAppStore()
const pageStore = usePageStore()
pageStore.addPageTemplate("formPage", import("../stage/formPageTemplate.json"))
pageStore.addPageTemplate("freePage", import("../stage/freePageTemplate.json"))
pageStore.addPageTemplate("listPage", import("../stage/listPageTemplate.json"))

const onSelectNode = (params: any) => {
  // console.log('onSelectNode() > params:', params)
  if (['root', 'folder'].indexOf(params.nodeType) >= 0) {
    // 根节点或目录节点
  } else {
    // 子节点
    const dataRef = params
    ideStore.openPage(<Page>{
      type: dataRef.nodeType,
      extendId: dataRef.key,
      title: dataRef.title,
      iconType: dataRef.iconType
    })
  }
}

const onDeleteNode = (params: any) => {
  if (['root'].indexOf(params.nodeType) >= 0) {
    // 根节点
  } else {
    // 子节点
    const dataRef = params
    ideStore.closePage(<Page>{
      type: dataRef.nodeType,
      extendId: dataRef.key,
      title: dataRef.title,
      iconType: dataRef.iconType
    })
  }
}

const onIconClick = (nodeData: any) => {
  console.log('onIconClick:', nodeData)
  ideStore.openPage(<Page>{
    type: nodeData.nodeType,
    extendId: nodeData.key,
    title: nodeData.title,
    iconType: nodeData.iconType
  })
}

//
const entityReader = new EntityReader()
entityReader.entity = 'platform_tree_node'
entityReader.fields = []
entityReader.fields.push(new FieldMeta('treeId',))
entityReader.fields.push(new FieldMeta('id', 'key'))
entityReader.fields.push(new FieldMeta('text', 'title'))
entityReader.fields.push(new FieldMeta('pid',))
entityReader.fields.push(new FieldMeta('iconType',))
entityReader.fields.push(new FieldMeta('type', 'nodeType'))
entityReader.fields.push(new FieldMeta('flag',))
entityReader.fields.push(new FieldMeta('seqNo',))
entityReader.params = []
entityReader.params.push(new EntityReaderParam('treeId', 'eq', appStore.currentApp.id))
entityReader.pageSize = 1000
const contextMenuData = [
  {title: '新建目录', iconType: 'gl-folder', nodeType: 'folder', useFor: ['root', 'folder'], action: 'addNode'},
  {title: '新建自由页面', iconType: 'gl-file', nodeType: 'freePage', useFor: ['folder'], action: 'addNode'},
  {title: '新建表单页面', iconType: 'gl-form', nodeType: 'formPage', useFor: ['folder'], action: 'addNode'},
  {title: '新建列表页面', iconType: 'gl-list', nodeType: 'listPage', useFor: ['folder'], action: 'addNode'},
  {
    title: '设置为菜单',
    iconType: 'gl-menu',
    nodeType: '*',
    useFor: ['folder', 'freePage', 'formPage', 'listPage'],
    action: 'updateNode',
    actionParams: {flag: 'menuItem'},
    show: '$gl.ctx.flag!=="menuItem"'
  },
  {
    title: '取消设置为菜单',
    iconType: 'gl-menu',
    nodeType: '*',
    useFor: ['folder', 'freePage', 'formPage', 'listPage'],
    action: 'updateNode',
    actionParams: {flag: ''},
    show: '$gl.ctx.flag==="menuItem"'
  },
  {
    title: '重命名',
    iconType: 'gl-edit-square',
    nodeType: 'freePage',
    useFor: ['folder', 'freePage', 'formPage', 'listPage'],
    action: 'updateNodeName'
  },
  {
    title: '删除',
    iconType: 'gl-delete',
    iconColor: '#cc3636',
    nodeType: 'freePage',
    useFor: ['folder', 'freePage', 'formPage', 'listPage'],
    action: 'deleteNode'
  }
]
</script>
<style>
.gl-app-tree {
  margin: 8px 0 0 8px;
}
</style>
