<script lang="ts">
export default {
  name: 'GlInsts'
}
</script>
<script lang="ts" setup>
import {computed, nextTick, PropType, ref, unref} from 'vue'
import {mixins, utils} from "@geelato/gl-ui";
import {ComponentInstance} from "@geelato/gl-ui-schema";
import {componentStoreFactory} from "@geelato/gl-ide";

const emits = defineEmits(['update:items'])

const props = defineProps({
  // glComponentInst:Object as PropType<ComponentInstance>,
  // items: Array as PropType<Array<ComponentInstance>>,
  componentStoreId: {
    type: String,
    default() {
      return 'useComponentStore'
    }
  },
  ...mixins.props
})
const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)

const freshFlag = ref(true)

/**
 * TODO 跨越GlInsts拖动对象时怎么处理
 * @param dragIndex
 * @param hoverIndex
 */
const moveCard = (dragIndex: number, hoverIndex: number, dragItemId: string, dropItemId: string) => {
  console.log(`moveCard,dragIndex:${dragIndex}, hoverIndex:${hoverIndex}, dragItemId:${dragItemId}, dropItemId:${dropItemId}`, props.glComponentInst.children)
  // 获取拖动项的上级组件
  const dragItemParentComponent = componentStore.findParentComponentFromTreeById(dragItemId)
  console.log('findParentComponentFromTreeById，dragItemParentComponent:', dragItemParentComponent)
  // 获取放置目标项的上级组件
  const dropItemParentComponent = componentStore.findParentComponentFromTreeById(dropItemId)
  console.log('findParentComponentFromTreeById，dropItemParentComponent:', dropItemParentComponent)

  if (!dragItemParentComponent || !dropItemParentComponent || !dragItemParentComponent.children||!dropItemParentComponent.children) {
    return
  }
  const dragItem = dragItemParentComponent.children![dragIndex]

  if (dragItem) {
    dragItemParentComponent.children!.splice(dragIndex, 1)
    tryAddDndPlaceholder(dragItemParentComponent.children)

    dropItemParentComponent.children!.splice(hoverIndex, 0, dragItem)
    tryRemoveDndPlaceholder(dropItemParentComponent.children)

    componentStore.currentDragComponentId = ''
    componentStore.setCurrentSelectedComponentByIdFromItems(dragItem.id, dropItemParentComponent.children)
    refresh()
  }
}

const addItem = (hoverIndex: number, item: ComponentInstance) => {
  console.log('addItem', hoverIndex, item)
  item.id = utils.gid('id', 16)
  props.glComponentInst.children!.splice(hoverIndex, 0, item)
  tryRemoveDndPlaceholder(props.glComponentInst.children)
  componentStore.currentDragComponentId = ''
  componentStore.setCurrentSelectedComponentByIdFromItems(item.id, props.glComponentInst.children)
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
  console.log('foundIndex', foundIndex)
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

</script>

<template>
  <GlInst v-if="freshFlag&&glComponentInst" v-for="(inst, index) in glComponentInst.children"
          :id="inst.id"
          :key="inst.id"
          :text="inst.id"
          :index="index"
          :moveCard="moveCard"
          :addItem="addItem"
          :glComponentInst="inst"
          :componentStoreId="componentStoreId"
  />
</template>

<style lang="less" scoped>
</style>