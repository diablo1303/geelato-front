<script lang="ts">
export default {
  name: 'GlInst'
}
</script>
<script lang="ts" setup>
// @ts-nocheck
import { computed, inject, onMounted, type PropType, ref, unref } from 'vue'
import { useDrag, useDrop } from 'vue3-dnd'
import { ItemTypes } from './DndItemTypes'
import type { Identifier } from 'dnd-core'
import { toRefs } from '@vueuse/core'
import { mixins, utils } from '@geelato/gl-ui'
import { componentStoreFactory } from '@geelato/gl-ide'
import { PageProvideProxy, PageProvideKey } from '@geelato/gl-ui'

const props = defineProps({
  id: [String],
  index: Number,
  moveItem: Function as PropType<
    (dragIndex: number, hoverIndex: number, dragItemId: string, dropItemId: string) => void
  >,
  addItem: Function,
  ...mixins.props
})

const pageProvideProxy: PageProvideProxy | null =
  props.glComponentInst.componentName === 'GlPage' ? null : inject(PageProvideKey)!
// console.log('GlInst > pageProvideProxy:', props.glComponentInst.componentName, PageProvideKey, pageProvideProxy)

const componentStoreId = props.componentStoreId || inject('componentStoreId')
if (!componentStoreId) {
  console.error('组件GlInst未设置componentStoreId')
}
// console.log('inject(\'componentStoreId\'):', inject('componentStoreId'))
// @ts-ignore
const componentStore = componentStoreFactory.getComponentStore(componentStoreId)()

interface DragItem {
  index: number
  id: string
  type: string
  __isTemplateInst?: boolean
}

const card = ref<HTMLDivElement>()
const [dropCollect, drop] = useDrop<
  DragItem,
  void,
  { handlerId: Identifier | null; isShallowOver: boolean }
>({
  accept: ItemTypes.Item,
  collect(monitor) {
    return {
      handlerId: monitor.getHandlerId(),
      isShallowOver: monitor.isOver({ shallow: true })
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
    const dropItemId = props.id!
    const dragIndex = dragItem.index
    const hoverIndex = props.index || 0
    // console.log('drop() > dragIndex:', dragIndex, 'hoverIndex:', hoverIndex, 'dragItem:', dragItem, 'dropTargetMonitor:', dropTargetMonitor)
    // 从组件库新增时,item是模板实例对象
    // 可通过__isTemplateInst来进行检测
    if (dragItem.__isTemplateInst) {
      delete dragItem.__isTemplateInst
      // 添加时
      if (props.addItem) {
        props.addItem!(hoverIndex, JSON.parse(JSON.stringify(dragItem)))
      } else {
        // 未绑定addItem方法，可能目前拖入的目标是根，根节点不可以施入平级的组件
        console.log('未添加组件', props.parentId, props.glComponentInst)
      }
    } else {
      // 尝试移动时(不一定会移动，如在同一位置拖、放)
      if (typeof props.moveItem === 'function') {
        props.moveItem!(dragIndex, hoverIndex!, dragItem.id, dropItemId)
      }
    }
    // TODO 改成依据鼠标的位置来区分是需要放置到上方还是下方
    dragItem.index = hoverIndex!
    // 拖动标识，通过监控该标识的变化，可以判断整个页面是否有变化
    // 注册，在拖动的过程中存在currentSelectedComponentInstance为undefined的情况
    if (componentStore.currentSelectedComponentInstance) {
      componentStore.currentSelectedComponentInstance.__dragFlag = utils.gid('dragFlag', 20)
    } else {
      console.warn('currentSelectedComponentInstance为undefined')
    }
  }
})

const [collect, drag] = useDrag({
  type: ItemTypes.Item,
  item: () => {
    return { id: props.id, index: props.index }
  },
  collect: (monitor: any) => ({
    isDragging: monitor.isDragging()
  })
})

const { handlerId, isShallowOver } = toRefs(dropCollect)
const { isDragging } = toRefs(collect)
const opacity = computed(() => (unref(isDragging) ? 0 : 1))

// TODO  error TS2322: Type '(el: HTMLDivElement) => void' is not assignable to type 'VNodeRef | undefined'.
const setRef = (el: HTMLDivElement) => {
  if (props.glComponentInst.disabledDnd) {
  } else {
    card.value = drag(drop(el)) as HTMLDivElement
  }
}

/**
 *  数据输入组件作为表单项，除了表单组件本身
 */
const showFormItem = computed(() => {
  // 排除特定的组件，如表单组件
  const ignoreComponentNames = ['GlEntityForm', 'GlEntityTableSub']
  if (ignoreComponentNames.indexOf(props.glComponentInst.componentName) >= 0) {
    return false
  }
  if (
    props.glComponentInst.componentName === 'GlRowColLayout' &&
    props.glComponentInst.props.showLabel === true
  ) {
    return true
  }
  return componentStore.isDataEntryComponent(props.glComponentInst.componentName)
})

const styleDisplay = ref(
  (function () {
    if (componentStore.isDataEntryComponent(props.glComponentInst.componentName)) {
      return 'inline-block'
    }
    return false
  })()
)

// 示例
// "i18n":
// [
//   {
//     "zh-CN":
//         "公司全称",
//     "en-US":
//         "FullName"
//   }
// ]
const defaultLocal = 'zh-CN'
const i18n = props.glComponentInst.i18n
const i18nConvert = (value?: string) => {
  const currentLocaleValue = localStorage.getItem('gl-locale') || defaultLocal
  // 如果是默认语言（zh-CN），则直接返回
  if (currentLocaleValue === defaultLocal) {
    return value
  }
  if (i18n) {
    for (let i18nKey in i18n) {
      if (i18n[i18nKey]['zh-CN'] === value) {
        return i18n[i18nKey][currentLocaleValue]
      }
    }
  }
  // 如果没有匹配的字典信息，则直接返回
  return value
}

const onClick = (...args: any[]) => {
  // 对于一些组件，点击事件可能是优先触发了组件内的点击事件，第一个参数不一定是event，这里对所有参数做统一处理
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
  const fromPageId = pageProvideProxy?.pageInst.id || props.glComponentInst.id
  componentStore.setCurrentSelectedComponentById(props.glComponentInst.id || '', fromPageId)
}

// console.log('GlInst > create()', props.glComponentInst.id)
// onMounted(() => {
//   console.log('GlInst > onMounted()', props.glComponentInst.id)
// })
</script>

<template>
  <div class="gl-dnd-wrapper" :style="{ display: styleDisplay }" v-if="glComponentInst?.id">
    <div
      :ref="setRef"
      class="gl-component-wrapper"
      :style="{ opacity }"
      :data-handler-id="handlerId"
    >
      <template v-if="showFormItem">
        <a-form-item
          class="gl-form-item"
          :field="glComponentInst?.props?.bindField?.fieldName"
          :class="{ 'gl-hidden': glComponentInst?.props?.hideLabel === true }"
          :label-col-flex="glComponentInst?.props._labelColFlex"
          :tooltip="i18nConvert(glComponentInst?.props?.tooltip)"
          :label="i18nConvert(glComponentInst?.props?.label)"
          :rules="glComponentInst?.props?.rules"
          :validate-trigger="[]"
          @click="onClick"
        >
          <GlComponentDnd
            class="gl-dnd-item gl-x-item"
            :glComponentInst="glComponentInst"
            :glIsRuntime="false"
            glRuntimeFlag=""
            :componentStoreId="componentStoreId"
          >
          </GlComponentDnd>
          <template v-if="glComponentInst?.props?.description" #extra>
            <div>{{ i18nConvert(glComponentInst?.props?.description) }}</div>
          </template>
          <template v-if="glComponentInst?.props?.help" #help>
            <div>{{ i18nConvert(glComponentInst?.props?.help) }}</div>
          </template>
        </a-form-item>
      </template>
      <template v-else
        >
        <GlComponentDnd
          :modelValue="utils.gid('id')"
          class="gl-dnd-item gl-x-item"
          style="flex: auto"
          :glIsRuntime="false"
          glRuntimeFlag=""
          :glComponentInst="glComponentInst"
          :componentStoreId="componentStoreId"
        >
        </GlComponentDnd>
      </template>
    </div>
    <div
      v-if="isShallowOver && !isDragging"
      :class="['indicator', { first: props.index === 0 }]"
    ></div>
  </div>
</template>

<style lang="less">
.gl-form-item .gl-hidden .arco-form-item-label-col {
  display: none;
}

.gl-form-item .gl-hidden .arco-form-item-wrapper-col {
  flex: auto;
}

.gl-dnd-wrapper {
  width: 100%;
  position: relative;
  vertical-align: top;
  //padding: .5rem 0;
}

.indicator {
  position: absolute;
  top: 0;
  width: 100%;
  height: 2px;
  background: #cc3636;

  //&.first {
  //  top: 0;
  //  bottom: unset;
  //}
}

.gl-component-wrapper {
  //width: 100%;
  padding: 1px;
  //background-color: white;
  //border: 1px dashed gray;
  //cursor: move;
}
</style>