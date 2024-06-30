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
import { useIdeStore, useAppStore, Page, usePageStore, useThemeStore } from '@geelato/gl-ide'
import { entityApi, EntityReader, EntityReaderParam, FieldMeta, useGlobal } from '@geelato/gl-ui'

const gloabl = useGlobal()
const ideStore = useIdeStore()
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
const json = ref('')

const onSelectNode = (params: any) => {
  // console.log('onSelectNode() > params:', params)
  if (['root', 'folder'].indexOf(params._nodeType) >= 0) {
    // 根节点或目录节点
  } else {
    // 子节点
    pageStore.loadPage({ extendId: params.key }).then((res) => {
      if (res.data && res.data.length > 0) {
        currentPage.value = res.data[0]
        json.value = currentPage.value.sourceContent
      }
    })
  }
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
  gloabl.$notification.info({ content: messages.length === 0 ? '无替换' : messages.join(';') })
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
  <div style="display: flex">
    <div style="flex: 0 0 15%; max-width: 250px">
      <GlEntityTree
        :treeId="appStore.currentApp.id"
        :treeName="appStore.currentApp.name"
        :draggable="true"
        :entityReader="entityReader"
        :extendEntityField="{ entityName: 'platform_app_page', fieldName: 'extendId' }"
        @selectNode="onSelectNode"
      />
    </div>
    <div style="width: 100%">
      <GlMonacoEditor
        v-model="json"
        :height="themeStore.modalBodyHeight - 41"
        language="json"
      ></GlMonacoEditor>
    </div>
    <div style="flex: 0 0 15%; max-width: 250px">
      <div>
        <a-alert :show-icon="false">
          <template #action>
            <a-button size="small" type="primary" @click="addReplaceItem">添加替换值</a-button>
          </template>
        </a-alert>
      </div>
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
        <a-button type="outline" long @click="saveReplaceResult">保存</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gl-item {
  padding-top: 1em;
}

.gl-action {
  text-align: right;
  display: none;
}

.gl-item:hover .gl-action {
  display: block;
}
</style>
