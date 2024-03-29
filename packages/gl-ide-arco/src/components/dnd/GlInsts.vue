<script lang="ts">
export default {
  name: 'GlInsts'
}
</script>
<script lang="ts" setup>
import { inject, nextTick, ref} from 'vue'
import {mixins, utils,PageProvideKey, PageProvideProxy} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {componentStoreFactory, usePageStore} from "@geelato/gl-ide";

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
const emits = defineEmits(['update:items'])

const props = defineProps({
  ...mixins.props
})

const componentStoreId = props.componentStoreId || inject('componentStoreId')
if (!componentStoreId) {
  console.error('组件GlInsts未设置componentStoreId')
}
const pageStore = usePageStore()
// @ts-ignore
const componentStore = componentStoreFactory.useComponentStore(componentStoreId)

const freshFlag = ref(true)

/**
 * TODO 跨越GlInsts拖动对象时怎么处理
 * @param dragIndex
 * @param hoverIndex
 */
const moveItem = (dragIndex: number, hoverIndex: number, dragItemId: string, dropItemId: string) => {

  // console.log(`moveItem() > dragIndex:${dragIndex}, hoverIndex:${hoverIndex}, dragItemId:${dragItemId}, dropItemId:${dropItemId}`, props.glComponentInst.children)
  // 获取拖动项的上级组件
  const dragItemParentComponent = componentStore.findParentComponentFromTreeById(dragItemId)
  // console.log('findParentComponentFromTreeById，dragItemParentComponent:', dragItemParentComponent)
  // 获取放置目标项的上级组件
  const dropItemParentComponent = componentStore.findParentComponentFromTreeById(dropItemId)
  // console.log('findParentComponentFromTreeById，dropItemParentComponent:', dropItemParentComponent)

  if (!dragItemParentComponent || !dropItemParentComponent || !dragItemParentComponent.children || !dropItemParentComponent.children) {
    return
  }
  const isMoveInSameList = dragItemParentComponent.id === dropItemParentComponent.id
  let isMoveDownInSameList = undefined
  let isMoveUpInSameList = undefined
  if (isMoveInSameList) {
    const isValidMove = dragIndex !== hoverIndex && dragIndex - hoverIndex !== -1
    // console.log('moveItem() > ', isValidMove ? '有效拖放' : '无效拖放')
    if (!isValidMove) {
      return
    }

    if (dragIndex < hoverIndex) {
      isMoveDownInSameList = true
    } else {
      isMoveUpInSameList = true
    }
  }
  // console.log('moveItem() > isMoveInSameList:', isMoveInSameList)


  const dragItem = dragItemParentComponent.children![dragIndex]

  if (dragItem) {
    dragItemParentComponent.children!.splice(dragIndex, 1)
    tryAddDndPlaceholder(dragItemParentComponent.children)

    if (isMoveDownInSameList) {
      // 如果是从上向下移动，需要做个补偿，在拖动时，原有的被删除，此时放置的位置应-1
      dropItemParentComponent.children!.splice(hoverIndex - 1, 0, dragItem)
    } else {
      dropItemParentComponent.children!.splice(hoverIndex, 0, dragItem)
    }
    tryRemoveDndPlaceholder(dropItemParentComponent.children)

    componentStore.currentDragComponentId = ''
    componentStore.setCurrentSelectedComponentByIdFromItems(dragItem.id, dropItemParentComponent.children, pageProvideProxy.pageInst.id)
    refresh()
  }
  // 记录操作
  pageStore.operationLog('移组件', pageStore.currentPage.sourceContent, dragItem)
}

/**
 * 从组件库中拖动添加
 * @param hoverIndex
 * @param item
 */
const addItem = (hoverIndex: number, item: ComponentInstance) => {
  // console.log('GlInsts > addItem() > hoverIndex:', hoverIndex, 'item:', item)
  item.id = utils.gid(componentStore.getAlias(item.componentName) || 'id')
  item.group = componentStore.getComponentGroupName(item.componentName)
  props.glComponentInst.children!.splice(hoverIndex, 0, item)
  tryRemoveDndPlaceholder(props.glComponentInst.children)
  componentStore.currentDragComponentId = ''
  componentStore.setCurrentSelectedComponentByIdFromItems(item.id, props.glComponentInst.children, pageProvideProxy.pageInst.id)
  // 记录操作
  pageStore.operationLog('加组件', pageStore.currentPage.sourceContent, item)
  refresh()
}

const refresh = () => {
  freshFlag.value = false
  nextTick(() => {
    freshFlag.value = true
  })
}

const GlDndPlaceholderName = 'GlDndPlaceholder'
/**
 * 添加之后，自动清除占位组件
 * @param items
 */
const tryRemoveDndPlaceholder = (items?: Array<any>) => {
  // console.log('tryRemoveDndPlaceholder from items:', items)
  if (!items) return
  const foundIndex = items.findIndex((item) => {

    return item.componentName === GlDndPlaceholderName
  })
  // console.log('foundIndex', foundIndex)
  if (foundIndex >= 0) {
    items.splice(foundIndex, 1)
  }
}

/**
 * 清空之后，自动补上占位组件，items.length === 0表示清空
 * @param items
 * @param info
 */
const tryAddDndPlaceholder = (items?: Array<any>, info?: string) => {
  // console.log('tryAddDndPlaceholder to items:', items)
  if (!items) return
  let item = {
    componentName: GlDndPlaceholderName,
    id: utils.gid('ph'),
    props: {
      info: info
    }
  }
  if (items.length === 0) {
    items.push(item)
  }
  return
}

// console.log('GlInsts > create:', props.glComponentInst.id, props.glComponentInst.componentName)
// onMounted(() => {
//   console.log('GlInsts > onMounted:', props.glComponentInst.id, props.glComponentInst.componentName)
// })
//
// onBeforeUpdate(() => {
//   console.log('GlInsts > onBeforeUpdate:', props.glComponentInst.id, props.glComponentInst.componentName, getCurrentInstance())
//   return false
// })
// onUpdated(() => {
//   console.log('GlInsts > onUpdated:', props.glComponentInst.id, props.glComponentInst.componentName)
// })
</script>

<template>
  <template v-for="(inst, index) in glComponentInst?.children" >
    <GlInst v-if="freshFlag&&glComponentInst" :key="index"
            :parentId=glComponentInst.id
            :id="inst.id"
            :index="index"
            :moveItem="moveItem"
            :addItem="addItem"
            :glComponentInst="inst"
            :componentStoreId="componentStoreId"
    />
  </template>

</template>