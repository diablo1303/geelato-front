<template>
  <div class="gl-page-select" :style="{width:allowOpen?'':'100%'}">
    <a-tree-select
      :data="treeData"
      v-model="selected"
      placeholder="请选择"
      selectable="leaf"
      :allow-search="true"
      :allow-clear="true"
      :filter-tree-node="filterTreeNode"
      :dropdown-style="{ maxHeight: '50vh', overflow: 'auto' }"
      @click="onClick"
    >
    </a-tree-select>
    <!--    <a-switch  checked-text="包括菜单页面" unchecked-text="不含菜单页面" type="round"></a-switch>-->
    <a-popconfirm
      v-if="allowOpen"
      content="将关闭本窗口（不保存），并打开新页面?"
      position="lt"
      type="warning"
      @ok="openPage"
    >
      <a-button size="small" type="primary"> 打开</a-button>
    </a-popconfirm>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlPageSelect'
}
</script>
<script lang="ts" setup>
import { inject, onMounted, ref, watch } from 'vue'
import { emitter, entityApi, EntityReader, EntityReaderParam, Utils } from '@geelato/gl-ui'
import {
  useAppStore,
  ComponentSetterProvideKey,
  ComponentSetterProvideProxy,
  usePageStore,
  EventNames
} from '@geelato/gl-ide'

const emits = defineEmits(['update:modelValue'])

const props = defineProps({
  /**
   *  应用页面节点id
   */
  modelValue: {
    type: String,
    default() {
      return ''
    }
  },
  // 为空时，默认为当前应用
  appId: {
    type: String,
    default() {
      return useAppStore().currentApp.id
    }
  },
  /**
   *  依赖于inject进来的componentSetterProvideProxy中的变量
   *  一般不需要配置，当在同一个ComponentSetter中有多个appId时，需要明确依赖哪一个
   */
  dependVarAppId: {
    type: String,
    default() {
      return 'appId'
    }
  },
  /**
   * 允许基于选择的项打开页面，默认为true
   */
  allowOpen: {
    type: Boolean,
    default() {
      return true
    }
  }
})

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!
const pageStore = usePageStore()
const extendId = pageStore?.currentPage?.extendId
// 默认当前页面的extend id
const selected = ref((typeof props.modelValue === 'string' ? props.modelValue : '') || extendId)

watch(
  selected,
  () => {
    emits('update:modelValue', selected.value)
  },
  { immediate: true }
)
const treeData = ref<any>([])

const filterTreeNode = (searchValue: string, nodeData: any) => {
  return nodeData.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
}

/**
 * 基于应用id加载页面数据
 * @param treeId 即appId
 */
const fetchData = (treeId: string) => {
  const entityReader = new EntityReader()
  entityReader.entity = 'platform_tree_node'
  entityReader.setFields('treeId,id key,text title,pid,iconType,type nodeType,flag,seqNo')
  entityReader.params = [new EntityReaderParam('treeId', 'eq', treeId)]
  entityApi.queryByEntityReader(entityReader).then((res: any) => {
    // console.log('platform_tree_node:', res)
    treeData.value = []
    treeData.value.push(
      ...Utils.ConvertUtil.listToTree({
        data: res.data,
        pid: treeId,
        renameId: 'key',
        compareFn: (a: any, b: any) => {
          const aSeq = a.seqNo || 0
          const bSeq = b.seqNo || 0
          return aSeq - bSeq
        }
      })
    )
  })
}

// inject('appId')
// TODO 需改成基于上下文获取
const appId = ref(props.appId)
watch(
  () => {
    return props.appId
  },
  () => {
    appId.value = props.appId
    fetchData(appId.value)
  },
  { immediate: true }
)

const onClick = () => {
  setData()
}

const setData = () => {
  // 该组件用于非属性配置面板的环境时，无inject，componentSetterProvideProxy为空。
  appId.value = componentSetterProvideProxy?.getVarValue(props.dependVarAppId)
  // 默认为当前的应用id
  fetchData(appId.value || props.appId)
}

const openPage = () => {
  if (!selected.value) return
  console.log('openPage', selected.value)
  emitter.emit(EventNames.GlIdeOpenPage, { extendId: selected.value })
}

onMounted(() => {
  setData()
})
</script>

<style lang="less">
.gl-page-select {
  display: flex;

  .arco-tree-select-popup {
    .arco-tree-select-tree-wrapper {
      max-height: none;
    }
  }
}
</style>
