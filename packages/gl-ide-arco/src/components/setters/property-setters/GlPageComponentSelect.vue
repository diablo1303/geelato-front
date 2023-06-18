<template>
  <a-tree-select :data="treeData"
                 v-model="selected"
                 placeholder="请选择"
                 :allow-search="true"
                 :allow-clear="true"
                 :filter-tree-node="filterTreeNode"
                 :fieldNames="{
                  key: 'id',
                  title: 'title',
                  children: 'children'}"
                 @click="loadPage"
                 @change="onChange"
  ></a-tree-select>
</template>
<script lang="ts">
export default {
  name: 'GlPageComponentSelect'
}
</script>
<script lang="ts" setup>
/**
 *  页面内的组件选择器
 *  获取页面结构，列出页面内的组件，便于选择组件
 */
import {inject, ref, watch} from "vue";
import ComponentSetterProvideProxy, {ComponentSetterProvideKey} from "../ComponentSetterProvideProxy";
import {entityApi} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {useComponentStore} from "@geelato/gl-ide";

const componentSetterProvideProxy: ComponentSetterProvideProxy = inject(ComponentSetterProvideKey)!

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
  /**
   *  配置的组件的props中，用于标识为页面extendId的字段
   *  本组件依赖于该extendId进行页面加载及解析
   */
  dependPropPageIdFieldName: {
    type: String,
    default() {
      return 'extendId'
    }
  },
  /**
   *  将选择的组件设置到变量中
   */
  exposeVarComponentInst: {
    type: String,
    default() {
      return 'componentInst'
    }
  },
  /**
   *  将选择的组件设置到变量中
   */
  exposeVarComponentMeta: {
    type: String,
    default() {
      return 'componentMeta'
    }
  }
})


const selected = ref(typeof props.modelValue === 'string' ? props.modelValue : '')

watch(selected, () => {
  console.log('update:modelValue:', selected.value)
  emits('update:modelValue', selected.value)
}, {immediate: true})

const filterTreeNode = (searchValue: string, nodeData: any) => {
  if (nodeData.title) {
    return nodeData.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  }
  return false
}

const treeData = ref<any>([])

const componentStore = useComponentStore()
const onChange = (value: any) => {
  console.log('.............', value)
  const findInst: any = (inst: any) => {
    if (inst.id === value) {
      return inst
    }
    for (let i in inst.children) {
      const findSubInst: any = findInst(inst.children[i])
      if (findSubInst) {
        return findSubInst
      }
    }
    return null
  }
  let foundInst = null
  if (treeData.value.length > 0) {
    foundInst = findInst(treeData.value[0])
  }
  if (foundInst) {
    // 设置实例
    componentSetterProvideProxy.setVarValue(props.exposeVarComponentInst, foundInst)
    // 设置元数据
    const componentMeta = componentStore.getComponentMeta(foundInst.componentName)
    componentSetterProvideProxy.setVarValue(props.exposeVarComponentMeta, componentMeta)
  }
}
const loadPage = () => {
  entityApi.queryPageByExtendId(componentSetterProvideProxy.getPropValue(props.dependPropPageIdFieldName)).then((resp: any) => {
    const pages = resp.data.result || resp.data.data
    if (pages && pages.length > 0) {
      const page = pages[0]
      // console.log('pageConfig', page)
      const pageConfig = page.releaseContent ? JSON.parse(page.releaseContent) : undefined
      treeData.value.length = 0
      convertTitle(pageConfig)
      pageConfig ? treeData.value.push(pageConfig) : null
      console.log('pageConfig', pageConfig)
      // 初始化时，触发change将实例数据、元数据设置到变量中
      onChange(props.modelValue)
    }
  })
}
const convertTitle = (componentInst: ComponentInstance, title?: string) => {
  componentInst.title = title || componentInst.title || componentInst.componentName


  if (componentInst.group === 'dataEntry') {
    componentInst.title = componentInst.props.label || componentInst.title || componentInst.componentName
    componentInst.title += "【表单字段】"
  }
  if (componentInst.children) {
    componentInst.children.forEach((childComponentInst: ComponentInstance, index: number) => {
      if (componentInst.componentName === 'GlTabs') {
        componentInst.title = 'GlTabs【标签页】'
        convertTitle(childComponentInst, componentInst.props?.items[index].title + '【标签项】')
      } else if (componentInst.componentName === 'GlRowColLayout') {
        convertTitle(childComponentInst, '单元格')
      } else {
        convertTitle(childComponentInst)
      }
    })
  }
}
loadPage()
// onUpdated(() => {
//   loadPage()
// })
</script>

<style scoped>

</style>