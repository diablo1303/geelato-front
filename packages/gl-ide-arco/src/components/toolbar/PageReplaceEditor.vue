<script lang="ts">
export default {
  name: 'PageReplaceEditor'
}
</script>
<script lang="ts" setup>
/**
 *  页面配置替换
 *  主要用于重构时，替换配置内容
 */
import { type Ref, ref, watch } from 'vue'
import { useAppStore, usePageStore, useThemeStore } from '@geelato/gl-ide'
import { entityApi, EntityReader, EntityReaderParam, FieldMeta, useGlobal } from '@geelato/gl-ui'

const global = useGlobal()
const appStore = useAppStore()
const pageStore = usePageStore()
const themeStore = useThemeStore()
const appId = appStore.currentApp.id
const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default() {
      return ''
    }
  }
})
const mv = ref(props.modelValue)
watch(mv, () => {
  emits('update:modelValue', mv.value)
})
const tabKey = ref('1')
const entityTreeRef = ref()
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
entityReader.params.push(new EntityReaderParam('treeId', 'eq', appId))
entityReader.pageSize = 2000

const currentPage: any = ref({})
const loadingPage = ref(false)
const json = ref('')

const loadPageByExtendId = (extendId: string, title: string = '') => {
  loadingPage.value = false
  pageStore.loadPage({ extendId }).then(
    (res) => {
      if (res.data && res.data.length > 0) {
        console.log('loadPageByExtendId() > res:', res)
        currentPage.value = res.data[0]
        json.value = currentPage.value.sourceContent
      }
      loadingPage.value = false
      global.$message.success('加载【' + title + '】成功。')
    },
    () => {
      loadingPage.value = false
    }
  )
}

const onSelectNode = (params: any) => {
  // console.log('onSelectNode() > params:', params)
  if (['root', 'folder'].indexOf(params._nodeType) >= 0) {
    // 根节点或目录节点
  } else {
    // 子节点
    loadPageByExtendId(params.key, params.title)
  }
}

const onClickPage = (extendId: string, title: string) => {
  loadPageByExtendId(extendId, title)
}

const openInTree = (extendId: string, title: string) => {
  tabKey.value = '1'
  entityTreeRef.value?.search(title)
}

const pageList = ref<{title:string,extendId:string}[]>([])
const searchPageContent = ref('')
const searchPage = (content: string) => {
  const searchEntityReader = new EntityReader()
  searchEntityReader.entity = 'v_platform_app_page_inner_tree'
  searchEntityReader.fields = []
  searchEntityReader.fields.push(new FieldMeta('id'))
  searchEntityReader.fields.push(new FieldMeta('extendId'))
  searchEntityReader.fields.push(new FieldMeta('text', 'title'))
  searchEntityReader.params = []
  searchEntityReader.params.push(new EntityReaderParam('appId', 'eq', appId))
  searchEntityReader.params.push(new EntityReaderParam('sourceContent', 'contains', content))
  searchEntityReader.pageSize = 50000
  entityApi.queryByEntityReader(searchEntityReader).then((res) => {
    pageList.value = res.data
    if (res.data && res.data.length === 0) {
      global.$message.info('未找到包含此内容的页面')
    } else {
    }
  })
}

const replaceItems: Ref<{ value: string; replaceValue: string }[]> = ref([])

const addReplaceItem = () => {
  replaceItems.value.push({ value: '', replaceValue: '' })
}

const deleteReplaceItem = (index: number) => {
  replaceItems.value.splice(index, 1)
}

const replaceAll = () => {
  const messages: string[] = []
  replaceItems.value.forEach((item) => {
    if (item.value.length > 0) {
      const matchAllItems = json.value.match(new RegExp(item.value, 'gm'))
      let count = matchAllItems ? matchAllItems.length : 0
      console.log('matchAllItems', count)
      messages.push(`替换"${item.value}"，${count}次`)
      json.value = json.value.replace(new RegExp(item.value, 'gm'), item.replaceValue)
    }
  })
  global.$notification.info({ content: messages.length === 0 ? '无替换' : messages.join(';') })
}

const saveReplaceResult = () => {
  if (currentPage.value.id && currentPage.value.extendId && appId) {
    currentPage.value.sourceContent = JSON.parse(json.value)
    currentPage.value.appId = appId
    console.log('currentPage', currentPage)
    pageStore.savePage(currentPage.value)
  } else {
    console.log('未保存')
  }
}


</script>

<template>
  <div class="gl-page-replace-editor" style="display: flex">
    <div style="flex: 0 0 15%; max-width: 250px">
      <a-tabs v-model:active-key="tabKey">
        <a-tab-pane
          key="1"
          title="应用树结构"
          style="overflow-y: auto"
          :style="{ height: themeStore.modalBodyHeight - 97 + 'px' }"
        >
          <GlEntityTree
            ref="entityTreeRef"
            :treeId="appStore.currentApp.id"
            :treeName="appStore.currentApp.name"
            :draggable="true"
            :searchable="true"
            :entityReader="entityReader"
            :extendEntityField="{ entityName: 'platform_app_page', fieldName: 'extendId' }"
            @selectNode="onSelectNode"
          />
        </a-tab-pane>
        <a-tab-pane
          key="2"
          title="页面列表"
          style="overflow-y: auto"
          :style="{ height: themeStore.modalBodyHeight - 97 + 'px' }"
        >
          <a-list class="page-list" size="small">
            <template #header>
              <a-input-search
                style=""
                placeholder="搜索页面内容"
                v-model="searchPageContent"
                @search="searchPage(searchPageContent)"
                @keyup.enter="searchPage(searchPageContent)"
              ></a-input-search>
            </template>
            <a-list-item
              style="cursor: pointer"
              v-for="(page, pageIndex) in pageList"
              :key="pageIndex"
              @click="onClickPage(page.extendId, page.title)"
              :class="{ 'gl-active': page.extendId === currentPage?.extendId }"
            >
              <a-list-item-meta
                :title="page.title"
              >
              </a-list-item-meta>
              <template #actions>
                <GlIconfont type="gl-tree" @click="openInTree(page.extendId, page.title)" title="在树结构中打开" />
              </template>
            </a-list-item>
          </a-list>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div style="width: 100%">
      <GlMonacoEditor
        v-model="json"
        :height="themeStore.modalBodyHeight - 41"
        language="json"
      ></GlMonacoEditor>
    </div>
    <div style="flex: 0 0 15%; max-width: 250px">
      <a-card>
        <template #title>
          <a-button size="small" type="primary" @click="addReplaceItem" title="添加替换值，用于查询替换当前页面">添加</a-button>
        </template>
        <div style="overflow-y: auto"
             :style="{ height: themeStore.modalBodyHeight - 125 + 'px' }">
          <div class="gl-item" v-for="(item, index) in replaceItems">
            <div>
              <a-input v-model="item.value">
                <template #prepend> 原始值</template>
              </a-input>
              <a-input v-model="item.replaceValue">
                <template #prepend> 替换值</template>
              </a-input>
            </div>
            <div class="gl-action">
              <!--          <gl-iconfont type="gl-delete"></gl-iconfont>-->
              <a-button type="outline" status="danger" size="mini" @click="deleteReplaceItem(index)">
                <gl-iconfont type="gl-delete" text="删除"></gl-iconfont>
              </a-button>
            </div>
          </div>
          <div class="gl-item" v-if="replaceItems.length > 0">
            <a-button type="outline" long @click="replaceAll">替换所有值</a-button>
          </div>
          <div class="gl-item" v-if="replaceItems.length > 0">
            <a-button type="outline" long @click="saveReplaceResult">保存页面</a-button>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style>
.gl-page-replace-editor .page-list .arco-list-header {
  padding: 4px;
}

.gl-page-replace-editor .gl-item {
  padding-top: 1em;
}

.gl-page-replace-editor .gl-action {
  text-align: right;
  display: none;
}

.gl-page-replace-editor .gl-item:hover .gl-action {
  display: block;
}
</style>
