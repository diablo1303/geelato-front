<template>
  <div class="gl-app-tree">
    <GlEntityTree
      :treeId="appStore.currentApp.id"
      :treeName="appStore.currentApp.name"
      :draggable="true"
      :entityReader="entityReader"
      :contextMenuData="contextMenuData"
      :extendEntityField="{ entityName: 'platform_app_page', fieldName: 'extendId' }"
      @selectNode="onSelectNode"
      @deleteNode="onDeleteNode"
      @clickContextMenuItem="clickContextMenuItem"
    />
    <a-modal
      width="1200px"
      :body-style="{ height: '800px', padding: 0, margin: 0 }"
      v-model:visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title> 创建页面向导</template>
      <CreateFromTemplate />
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'AppTree'
}
</script>
<script setup lang="ts">
import { ref } from 'vue'
import { useIdeStore, useAppStore, Page, usePageStore } from '@geelato/gl-ide'
import { EntityReader, EntityReaderParam, FieldMeta } from '@geelato/gl-ui'
import CreateFromTemplate from './create-page/CreateFromTemplate.vue'

const ideStore = useIdeStore()
const appStore = useAppStore()
const pageStore = usePageStore()
pageStore.addPageTemplate('formPage', import('../stage/formPageTemplate.json'))
pageStore.addPageTemplate('freePage', import('../stage/freePageTemplate.json'))
pageStore.addPageTemplate('listPage', import('../stage/listPageTemplate.json'))

const visible = ref(false)
const handleOk = () => {
  visible.value = true
}
const handleCancel = () => {
  visible.value = false
}
const onSelectNode = (params: any) => {
  // console.log('onSelectNode() > params:', params)
  if (['root', 'folder'].indexOf(params._nodeType) >= 0) {
    // 根节点或目录节点
  } else {
    // 子节点
    const dataRef = params
    ideStore.openPage(<Page>{
      type: dataRef._nodeType,
      extendId: dataRef.key,
      title: dataRef.title,
      iconType: dataRef.iconType
    })
  }
}

/**
 *
 * @param params
 */
const clickContextMenuItem = (params: { clickedNodeData: any; contextMenuItemData: any }) => {
  console.log('clickContextMenuItem() > params:', params)
  if (params.contextMenuItemData._nodeType === 'templatePage') {
    visible.value = true
  }
}

const onDeleteNode = (params: any) => {
  if (['root'].indexOf(params._nodeType) >= 0) {
    // 根节点
  } else {
    // 子节点
    const dataRef = params
    ideStore.closePage(<Page>{
      type: dataRef._nodeType,
      extendId: dataRef.key,
      title: dataRef.title,
      iconType: dataRef.iconType
    })
  }
}

// const onIconClick = (nodeData: any) => {
//   console.log('onIconClick:', nodeData)
//   ideStore.openPage(<Page>{
//     type: nodeData._nodeType,
//     extendId: nodeData.key,
//     title: nodeData.title,
//     iconType: nodeData.iconType
//   })
// }

//
const entityReader = new EntityReader()
entityReader.entity = 'platform_tree_node'
entityReader.fields = []
entityReader.fields.push(new FieldMeta('treeId'))
entityReader.fields.push(new FieldMeta('id', 'key'))
entityReader.fields.push(new FieldMeta('text', 'title'))
entityReader.fields.push(new FieldMeta('pid'))
entityReader.fields.push(new FieldMeta('iconType'))
entityReader.fields.push(new FieldMeta('type', '_nodeType'))
entityReader.fields.push(new FieldMeta('flag'))
entityReader.fields.push(new FieldMeta('seqNo'))
entityReader.params = []
entityReader.params.push(new EntityReaderParam('treeId', 'eq', appStore.currentApp.id))
entityReader.pageSize = 1000
const contextMenuData = [
  {
    title: '新建目录',
    iconType: 'gl-folder',
    _nodeType: 'folder',
    useFor: ['root', 'folder'],
    action: 'addNode'
  },
  {
    title: '创建页面向导',
    iconType: 'gl-file',
    _nodeType: 'templatePage',
    useFor: ['folder'],
    action: 'createPageNav'
  },
  {
    title: '新建自由页面',
    iconType: 'gl-file',
    _nodeType: 'freePage',
    useFor: ['folder'],
    action: 'addNode'
  },
  {
    title: '新建表单页面',
    iconType: 'gl-form',
    _nodeType: 'formPage',
    useFor: ['folder'],
    action: 'addNode'
  },
  {
    title: '新建列表页面',
    iconType: 'gl-list',
    _nodeType: 'listPage',
    useFor: ['folder'],
    action: 'addNode'
  },
  {
    title: '设置为菜单',
    iconType: 'gl-menu',
    _nodeType: '*',
    useFor: ['folder', 'freePage', 'formPage', 'listPage'],
    action: 'updateNode',
    actionParams: { flag: 'menuItem' },
    show: '$gl.ctx.flag!=="menuItem"'
  },
  {
    title: '取消设置为菜单',
    iconType: 'gl-menu',
    _nodeType: '*',
    useFor: ['folder', 'freePage', 'formPage', 'listPage'],
    action: 'updateNode',
    actionParams: { flag: '' },
    show: '$gl.ctx.flag==="menuItem"'
  },
  {
    title: '设置图标',
    iconType: 'gl-edit-square',
    _nodeType: 'freePage',
    useFor: ['folder', 'freePage', 'formPage', 'listPage'],
    action: 'updateNodeIcon'
  },
  {
    title: '重命名',
    iconType: 'gl-edit-square',
    _nodeType: 'freePage',
    useFor: ['folder', 'freePage', 'formPage', 'listPage'],
    action: 'updateNodeName'
  },
  {
    title: '删除',
    iconType: 'gl-delete',
    iconColor: '#cc3636',
    _nodeType: 'freePage',
    useFor: ['folder', 'freePage', 'formPage', 'listPage', 'templatePage'],
    action: 'deleteNode'
  }
]
</script>
<style>
.gl-app-tree {
  margin: 8px 0 0 8px;
}
</style>
