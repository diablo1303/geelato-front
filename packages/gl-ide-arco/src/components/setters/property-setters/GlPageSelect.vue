<template>
  <a-tree-select
    :data="treeData"
    v-model="selected"
    placeholder="请选择"
    :allow-search="true"
    :allow-clear="true"
    :filter-tree-node="filterTreeNode"
    @click="onClick"
  ></a-tree-select>
</template>

<script lang="ts">
export default {
  name: 'GlPageSelect'
}
</script>
<script lang="ts" setup>
import { inject, onMounted, ref, watch } from 'vue'
import { entityApi, EntityReader, EntityReaderParam, Utils } from '@geelato/gl-ui'
import {
  useAppStore,
  ComponentSetterProvideKey,
  ComponentSetterProvideProxy
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
  }
})

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!

const selected = ref(typeof props.modelValue === 'string' ? props.modelValue : '')

watch(
  selected,
  () => {
    // console.log('update:modelValue:', selected.value)
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
  appId.value = componentSetterProvideProxy.getVarValue(props.dependVarAppId)
  fetchData(appId.value)
}
onMounted(() => {
  setData()
})
</script>

<style scoped></style>
