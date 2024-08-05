<template>
  <a-tree-select
    class="gl-page-component-select"
    title="该组件树为当前后台服务中已保存的组件树"
    :data="treeData"
    v-model="selected"
    placeholder="请选择"
    :allow-search="true"
    :allow-clear="true"
    :filter-tree-node="filterTreeNode"
    :fieldNames="{
      key: 'id',
      title: 'title',
      children: 'children'
    }"
    @click="loadPage"
    @change="onChange"
    dropdownClassName="gl-page-component-select-dropdown"
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
import { inject, ref, watch } from 'vue'
import {
  ComponentSetterProvideKey,
  ComponentSetterProvideProxy,
  useComponentStore
} from '@geelato/gl-ide'
import { entityApi } from '@geelato/gl-ui'
import type { ComponentInstance } from '@geelato/gl-ui-schema'
import { useParseInnerComponent } from '../../../m/hooks/useAddInnerComponentToInstTree'

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

watch(
  selected,
  () => {
    // console.log('update:modelValue:', selected.value)
    emits('update:modelValue', selected.value)
  },
  { immediate: true }
)

const filterTreeNode = (searchValue: string, nodeData: any) => {
  if (nodeData.title) {
    return nodeData.title.toLowerCase().indexOf(searchValue.toLowerCase()) > -1
  }
  return false
}

const treeData = ref<any>([])

const currentComponentMeta = ref()

const componentStore = useComponentStore()
/**
 * @param instId 更换选择的组件ID
 */
const onChange = (instId: any) => {
  // 递归查询方法
  const findInst: any = (inst: any) => {
    if (inst.id === instId) {
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

  // 开始查找
  let foundInst = null
  if (treeData.value.length > 0) {
    foundInst = findInst(treeData.value[0])
  }
  if (foundInst) {
    // 如果当前组件页面存在该组件，则以当前页面的组件为准，确保为最新的状态，如组件新配置的动作
    const isEditingComponent = componentStore.findComponentFromTreeById(foundInst.id)
    // console.log('foundInst:', foundInst, 'isEditingComponent:', isEditingComponent)
    if (isEditingComponent && isEditingComponent.componentName) {
      foundInst = isEditingComponent
    }
    // 设置实例
    componentSetterProvideProxy.setVarValue(props.exposeVarComponentInst, foundInst)
    // 设置元数据
    currentComponentMeta.value = componentStore.getComponentMeta(foundInst.componentName)

    componentSetterProvideProxy.setVarValue(
      props.exposeVarComponentMeta,
      currentComponentMeta.value
    )
  }
}

const loadPage = () => {
  entityApi
    .queryPageByExtendId(componentSetterProvideProxy.getPropValue(props.dependPropPageIdFieldName))
    .then((resp: any) => {
      const pages = resp.data
      if (pages && pages.length > 0) {
        const page = pages[0]
        // console.log('pageConfig', page)
        const pageConfig = page.releaseContent ? JSON.parse(page.releaseContent) : undefined
        treeData.value.length = 0
        if (pageConfig) {
          console.log('pageConfig', pageConfig)
          // 处理组件的内置组件，解析出来加到组件树中
          useParseInnerComponent(pageConfig)
          convertTitle(pageConfig)
          treeData.value.push(pageConfig)
        }

        // console.log('pageConfig', pageConfig)
        // 初始化时，触发change将实例数据、元数据设置到变量中
        onChange(props.modelValue)
      }
    })
}

const convertTitle = (componentInst: ComponentInstance, title?: string) => {
  componentInst.title =
    title || componentInst.props?.label || componentInst.title || componentInst.componentName

  if (componentInst.group === 'dataEntry') {
    // componentInst.title = componentInst.props.label || componentInst.title || componentInst.componentName
    if (componentInst.componentName === 'GlEntityForm') {
      componentInst.title += '【表单】'
    } else if (componentInst.componentName === 'GlEntityTableSub') {
      componentInst.title = componentInst.props.base?.label + '【列表】'
    } else {
      componentInst.title += '【表单字段】'
    }
  } else {
    if (componentInst.componentName === 'GlEntityTablePlus') {
      componentInst.title = componentInst.props.base?.label + '【列表】'
    }else if (componentInst.componentName === 'GlAlert' && componentInst.title=== 'GlAlert') {
      componentInst.title = '警告提示'
    }
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

<style>
.gl-page-component-select-dropdown .arco-select-dropdown-list-wrapper,
.gl-page-component-select-dropdown .arco-tree-select-tree-wrapper {
  /** 取消默认的200px最大高度限制，方便选择 **/
  max-height: 600px;
}
</style>
