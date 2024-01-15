<template>
  <div class="gl-app-tree">
    <GlEntityTree
      ref="glEntityTree"
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
      :onBeforeOk="onBeforeOk"
      @cancel="handleCancel"
    >
      <template #title> 创建页面向导</template>
      <CreatePageNav v-if="visible" ref="createPageNav" />
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: 'AppTree'
}
</script>
<script setup lang="ts">
import { type Ref, ref } from 'vue'
import { useIdeStore, useAppStore, Page, usePageStore } from '@geelato/gl-ide'
import {
  entityApi,
  EntityReader,
  EntityReaderParam,
  EntitySaver,
  FieldMeta
} from '@geelato/gl-ui'
import CreatePageNav from './create-page/CreatePageNav.vue'
import type { PageInfo } from './create-page/CreatePageNav'

const glEntityTree = ref()
const ideStore = useIdeStore()
const appStore = useAppStore()
const pageStore = usePageStore()
pageStore.addPageTemplate('formPage', import('../stage/formPageTemplate.json'))
pageStore.addPageTemplate('freePage', import('../stage/freePageTemplate.json'))
pageStore.addPageTemplate('listPage', import('../stage/listPageTemplate.json'))
pageStore.addPageTemplate('flowPage', import('../stage/flowPageTemplate.json'))

type ClickContextMenuItemType = {
  clickedNodeData: Record<string, any>
  contextMenuItemData: Record<string, any>
}
// 当前右键菜单点击记录的内容
const currentClickContextMenuItem: Ref<ClickContextMenuItemType> = ref({
  clickedNodeData: {},
  contextMenuItemData: {}
})
const createPageNav = ref()

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
const clickContextMenuItem = (params: ClickContextMenuItemType) => {
  console.log('clickContextMenuItem() > params:', params)
  if (params.contextMenuItemData._nodeType === 'templatePage') {
    currentClickContextMenuItem.value = params
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

// 树实体查询
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
    title: '从模板新建页面',
    iconType: 'gl-file',
    _nodeType: 'templatePage',
    useFor: ['folder'],
    action: 'createPageNav'
  },
  {
    title: '新建空白页面',
    iconType: 'gl-file',
    _nodeType: 'freePage',
    useFor: ['folder'],
    action: 'addNode'
  },
  {
    title: '新建工作流程',
    iconType: 'gl-flow',
    _nodeType: 'flowPage',
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
    useFor: ['folder', 'freePage', 'formPage', 'listPage', 'flowPage'],
    action: 'updateNodeName'
  },
  {
    title: '删除',
    iconType: 'gl-delete',
    iconColor: '#cc3636',
    _nodeType: 'freePage',
    useFor: ['folder', 'freePage', 'formPage', 'listPage', 'templatePage', 'flowPage'],
    action: 'deleteNode'
  }
]

const createAddNodeEntitySaver = (page: PageInfo) => {
  const es: EntitySaver = new EntitySaver()
  es.entity = 'platform_tree_node'
  es.record = {
    flag: page.isMenuitem ? 'menuItem' : '',
    iconType: page.iconType,
    type: page.type,
    treeId: appStore.currentApp.id,
    text: page.label,
    pid: currentClickContextMenuItem.value.clickedNodeData.key
  }
  return es
}

const visible = ref(false)
const onBeforeOk = async () => {
  const pageInfos: PageInfo[] = await createPageNav.value?.getPages()
  if (pageInfos.length === 0) {
    return false
  }
  try {
    pageInfos.forEach((pageInfo: PageInfo) => {
      // 保存菜单、页面
      const page = new Page()
      page.appId = appStore.currentApp.id
      page.extendId = '$parent.id'
      page.title = pageInfo.label
      page.type = pageInfo.type
      page.iconType = pageInfo.iconType
      page.code = ''
      page.sourceContent = pageInfo.content
      const pageSaver = pageStore.getPageEntitySaver(page)

      const nodeSaver = createAddNodeEntitySaver(pageInfo)
      nodeSaver.children = [pageSaver]
      entityApi.saveEntity(nodeSaver).then((res) => {
        // 构建前端的节点
        const node = {
          title: page.title,
          iconType: page.iconType,
          _nodeType: page.type,
          treeId: page.appId,
          key: res.data
        }
        if (!currentClickContextMenuItem.value.clickedNodeData.children) {
          currentClickContextMenuItem.value.clickedNodeData.children = []
        }
        currentClickContextMenuItem.value.clickedNodeData.children.push(node)
        glEntityTree.value.refresh()
        glEntityTree.value.selectNode(node)
      })
    })
  } catch (e) {
    console.error(e)
    return false
  }
}
const handleCancel = () => {
  visible.value = false
}
</script>
<style>
.gl-app-tree {
  margin: 8px 0 0 8px;
}
</style>
