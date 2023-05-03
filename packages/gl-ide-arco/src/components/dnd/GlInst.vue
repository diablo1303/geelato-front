<script lang="ts">
export default {
  name: 'GlInst'
}
</script>
<script lang="ts" setup>
import {computed, PropType, ref, unref} from 'vue'
import {useDrag, useDrop} from 'vue3-dnd'
import {ItemTypes} from './DndItemTypes'
import type {XYCoord, Identifier} from 'dnd-core'
import {toRefs} from '@vueuse/core'
import {mixins} from "@geelato/gl-ui";

const props = defineProps({
  id: [String],
  text: String,
  index: Number,
  moveCard: Function as PropType<(dragIndex: number, hoverIndex: number, dragItemId: string, dropItemId: string) => void>,
  addItem: Function,
  componentStoreId: {
    type: String,
    default() {
      return 'useComponentStore'
    }
  },
  ...mixins.props
})

interface DragItem {
  index: number
  id: string
  type: string
  _isTemplateInst?: boolean
}

const card = ref<HTMLDivElement>()
const [dropCollect, drop] = useDrop<DragItem,
    void,
    { handlerId: Identifier | null, isShallowOver: boolean }>({
  accept: ItemTypes.Item,
  collect(monitor) {
    return {
      handlerId: monitor.getHandlerId(),
      isShallowOver: monitor.isOver({shallow: true})
    }
  },
  /**
   * 放置时触发
   * @param dragItem
   * @param dropTargetMonitor
   */
  drop(dragItem: DragItem, dropTargetMonitor) {

    // 解决嵌套拖放的问题
    const didDrop = dropTargetMonitor.didDrop()
    if (didDrop) {
      return
    }
    console.log('drop(),dragItem:', dragItem, ',dropTargetMonitor:', dropTargetMonitor)
    const dropItemId = props.id!
    const dragIndex = dragItem.index
    const hoverIndex = props.index

    // 从组件库新增时,item是模板实例对象
    // 可通过_isTemplateInst来进行检测
    if (dragItem._isTemplateInst) {
      delete dragItem._isTemplateInst
      props.addItem!(hoverIndex, JSON.parse(JSON.stringify(dragItem)))
    } else {
      // 移动时
      props.moveCard!(dragIndex, hoverIndex!, dragItem.id, dropItemId)
    }
    // TODO 改成依据鼠标的位置来区分是需要放置到上方还是下方
    dragItem.index = hoverIndex!
  }
})

const [collect, drag] = useDrag({
  type: ItemTypes.Item,
  item: () => {
    return {id: props.id, index: props.index}
  },
  collect: (monitor: any) => ({
    isDragging: monitor.isDragging(),
  }),
})

const {handlerId, isShallowOver} = toRefs(dropCollect)
const {isDragging} = toRefs(collect)
const opacity = computed(() => (unref(isDragging) ? 0 : 1))

const setRef = (el: HTMLDivElement) => {
  card.value = drag(drop(el)) as HTMLDivElement
}

const blocks = ['GlEntityForm', 'GlFormRow', 'GlFormCol', 'GlDndPlaceholder', 'GlCard', 'GlTabs', 'GlRowColLayout']
const style = ref({
  display: function () {
    if (blocks.findIndex((block) => {
      return block === props.glComponentInst.componentName
    }) > -1) {
      return false
    } else {
      return 'inline-block'
    }
  }()
})

const isFormItem = computed(() => {
  return blocks.findIndex((block) => {
    return block === props.glComponentInst.componentName
  }) === -1
})
</script>

<template>
  <div class="gl-dnd-wrapper" :style="style">
    <div :ref="setRef"
         class="gl-component-wrapper"
         :style="{ opacity }"
         :data-handler-id="handlerId"
    >
      <template v-if="isFormItem">
        {{ glComponentInst?.props?.bindFiled }}
        <a-form-item class="gl-form-item" :field="glComponentInst?.props?.bindField?.fieldName"
                     :tooltip="glComponentInst?.props?.tooltip" :label="glComponentInst?.props?.label"
                     :rules="glComponentInst?.rules"
                     :validate-trigger="['change','input']">
          <GlComponentDnd class="gl-dnd-item gl-x-item"
                          :glComponentInst="glComponentInst"
                          :componentStoreId="componentStoreId">
          </GlComponentDnd>
          <template v-if="glComponentInst?.props?.extra" #extra>
            <div>{{ glComponentInst?.props?.extra }}</div>
          </template>
          <template v-if="glComponentInst?.props?.help" #help>
            <div>{{ glComponentInst?.props?.help }}</div>
          </template>
        </a-form-item>
      </template>
      <template v-else>
        <GlComponentDnd class="gl-dnd-item gl-x-item"
                        :glComponentInst="glComponentInst"
                        :componentStoreId="componentStoreId">
        </GlComponentDnd>
      </template>
    </div>
    <div v-if="isShallowOver && !isDragging" :class="['indicator', { first: props.index === 0 }]"></div>
  </div>

</template>

<style lang="less" scoped>
.gl-dnd-wrapper {
  width: 100%;
  position: relative;
  vertical-align: top;
  //padding: .5rem 0;
}

.indicator {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #cc3636;

  &.first {
    top: 0;
    bottom: unset;
  }
}

.gl-component-wrapper {
  //width: 100%;
  padding: 1px;
  //background-color: white;
  //border: 1px dashed gray;
  //cursor: move;
}

.gl-dnd-placeholder {
  //width: 100%;
}
</style>