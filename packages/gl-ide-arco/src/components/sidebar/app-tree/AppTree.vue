<template>
  <div class="gl-app-tree">
    <!--    <a-alert :show-icon="false"> 加粗显示为菜单项</a-alert>-->
    <GlEntityTree
      v-model="selectedKeys"
      ref="glEntityTree"
      :treeId="appStore.currentApp.id"
      :treeName="appStore.currentApp.name"
      :draggable="true"
      :searchable="true"
      :entityReader="entityReader"
      :contextMenuData="contextMenuData"
      :extendEntityField="{ entityName: 'platform_app_page', fieldName: 'extendId' }"
      :expandedKeysCacheKey="'expandedKeys_' + appStore.currentApp.id"
      @selectNode="onSelectNode"
      @deleteNode="onDeleteNode"
      @updateNodeName="onUpdateNodeName"
      @clickContextMenuItem="clickContextMenuItem"
    />
    <a-modal draggable
      width="1200px"
      :body-style="{ height: '800px', padding: 0, margin: 0 }"
      v-model:visible="visible"
      :onBeforeOk="onBeforeOk"
      @cancel="handleCancel"
    >
      <template #title> 创建页面向导</template>
      <CreatePageNav v-if="visible" ref="createPageNav" :key="createPageNavKey" />
    </a-modal>
    <!-- 创建页面链接，内置弹窗 -->
    <LinkPageFormModal
      v-if="linkPageVisible"
      :key="currentClickLink.id"
      v-model="currentClickLink"
      v-model:visible="linkPageVisible"
      ref="linkPageFormModal"
      :treeId="appStore?.currentApp?.id"
      @saveNode="onSaveLinkNode"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'AppTree'
}
</script>
<script setup lang="ts">
import { onMounted, onUnmounted, type PropType, type Ref, ref } from 'vue'
import { useIdeStore, useAppStore, Page, usePageStore, EventNames } from '@geelato/gl-ide'
import {
  emitter,
  entityApi,
  EntityReader,
  EntitySaver,
  FieldMeta,
  useGlobal,
  utils
} from '@geelato/gl-ui'
import CreatePageNav from '../create-page/CreatePageNav.vue'
import type { PageInfo } from '../create-page/CreatePageNav'
import LinkPageFormModal from './LinkPageFormModal.vue'

const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})

// 不是页面的节点，如根节点、文件夹节点、外链节点，点击这些节点不需要在右边打开页面
const notPageNodeTypes = ['root', 'folder', 'link']
const selectedKeys = ref(props.modelValue)
const global = useGlobal()

const glEntityTree = ref()
const ideStore = useIdeStore()
const appStore = useAppStore()
const pageStore = usePageStore()
pageStore.addPageTemplate('formPage', import('../../stage/formPageTemplate.json'))
pageStore.addPageTemplate('freePage', import('../../stage/freePageTemplate.json'))
pageStore.addPageTemplate('listPage', import('../../stage/listPageTemplate.json'))
pageStore.addPageTemplate('flowPage', import('../../stage/flowPageTemplate.json'))

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
entityReader.pageSize = 3000
entityReader.addParam('treeId', 'eq', appStore.currentApp.id)
entityReader.addOrder('seqNo', '+')

type ClickContextMenuItemType = {
  clickedNodeData: Record<string, any>
  contextMenuItemData: Record<string, any>
}
// 当前右键菜单点击记录的内容
const currentClickContextMenuItem: Ref<ClickContextMenuItemType> = ref({
  clickedNodeData: {},
  contextMenuItemData: {}
})

// 当前右键菜单点击的链接信息内容
const currentClickLink = ref({ id: '', pid: '', title: '', url: '' })

const createPageNav = ref()
const createPageNavKey = ref(utils.gid('key'))

/**
 * 选择节点时，控制哪些需要打开页面
 * @param params
 */
const onSelectNode = (params: any) => {
  if (notPageNodeTypes.indexOf(params._nodeType) >= 0) {
    // 点击不加载页面的节点，如根节点或目录节点、外链节点
  } else {
    // 点击加载页面的子节点
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
 * 点击右键菜单时，根据菜单类型，打开相应的页面
 * @param params
 */
const clickContextMenuItem = (params: ClickContextMenuItemType) => {
  // console.log('clickContextMenuItem() > params:', params)
  currentClickContextMenuItem.value = params
  if (params.contextMenuItemData._nodeType === 'templatePage') {
    createPageNavKey.value = utils.gid('key')
    visible.value = true
  } else if (params.contextMenuItemData._nodeType === 'link') {
    currentClickLink.value = {
      id: '',
      pid: '',
      url: '',
      title: ''
    }
    if (params.contextMenuItemData.action === 'createLinkPage') {
      currentClickLink.value.pid = params.clickedNodeData.key
      linkPageVisible.value = true
    } else if (params.contextMenuItemData.action === 'updateLinkPage') {
      currentClickLink.value.id = params.clickedNodeData.key
      // 新创建或修改
      const reader = new EntityReader()
      reader.entity = 'platform_tree_node'
      reader.setFields('id,text,pid,url')
      reader.addParam('id', 'eq', currentClickLink.value.id)
      entityApi.queryByEntityReader(reader).then(
        (res: any) => {
          if (res.data?.length > 0) {
            currentClickLink.value = {
              id: res.data[0].id,
              pid: res.data[0].pid,
              url: res.data[0].url,
              title: res.data[0].text
            }
          }
          linkPageVisible.value = true
        },
        (res: any) => {
          global.$message.error('查询节点数据失败')
          console.error('查询节点数据失败', res)
        }
      )
    }
  }
}

/**
 * 删除节点操作
 * 如果不是根节点时，需要同步状态相应的页面
 * @param params
 */
const onDeleteNode = (params: any) => {
  if (notPageNodeTypes.indexOf(params._nodeType) >= 0) {
    // 根节点等
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

const onUpdateNodeName = (params: any) => {
  pageStore.updatePageTitleByExtendId(params.editNodeData.key, params.editNodeData.title)
}

// 右键菜单数据，每一项依据useFor属性，判断是否显示
const contextMenuData = [
  {
    title: '新建目录',
    iconType: 'gl-folder',
    iconColor: '#0467c2',
    _nodeType: 'folder',
    useFor: ['root', 'folder'],
    action: 'addNode'
  },
  {
    title: '从模板新建页面',
    iconType: 'gl-file',
    iconColor: '#0467c2',
    _nodeType: 'templatePage',
    useFor: ['folder'],
    action: 'createPageNav'
  },
  {
    title: '新建空白页面',
    iconType: 'gl-file',
    iconColor: '#0467c2',
    _nodeType: 'freePage',
    useFor: ['folder'],
    action: 'addNode'
  },
  {
    title: '新建外部链接',
    iconType: 'gl-link',
    iconColor: '#0467c2',
    _nodeType: 'link',
    useFor: ['folder'],
    action: 'createLinkPage'
  },
  {
    title: '编辑外部链接',
    iconType: 'gl-link',
    iconColor: '#0467c2',
    _nodeType: 'link',
    useFor: ['link'],
    action: 'updateLinkPage'
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
    useFor: ['folder', 'link', 'freePage', 'formPage', 'listPage', 'templatePage', 'flowPage'],
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
const linkPageVisible = ref(false)
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
        glEntityTree.value.reRender()
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
  linkPageVisible.value = false
}

const onSaveLinkNode = (node: any) => {
  glEntityTree.value.fetchData()
}

// { extendId: string }
const openPage = (params: any) => {
  console.log('openPage', params, selectedKeys.value)
  if (params.extendId) {
    if (selectedKeys.value.includes(params.extendId)) {
      global.$notification.info('拟打开的页面和当前页面是同一个')
    } else {
      glEntityTree.value.selectNodeByKey(params.extendId)
    }
  }
}

onMounted(() => {
  emitter.on(EventNames.GlIdeOpenPage, openPage)
})
onUnmounted(() => {
  emitter.off(EventNames.GlIdeOpenPage, openPage)
})
</script>
<style>
.gl-app-tree {
  margin: 8px 0 0 8px;
}
</style>
