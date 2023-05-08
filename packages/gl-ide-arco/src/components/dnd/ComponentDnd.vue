<template>
  <component v-if="glComponentInst"
             :id="glComponentInst.id"
             :ref="glComponentInst.id"
             :class="{'gl-hover':componentStore.currentHoverComponentId===glComponentInst.id,'gl-selected':componentStore.currentSelectedComponentId===glComponentInst.id}"
             class="gl-component"
             :is="glComponentInst.componentName"
             v-model="glComponentInst._value"
             v-bind="glComponentInst.propsWrapper?{[glComponentInst.propsWrapper]:glComponentInst.props}:glComponentInst.props"
             :style="glComponentInst.style"
             :glComponentInst="glComponentInst"
             :parentId="glComponentInst.id"
             :glChildren="glComponentInst.children"
             @click="onClick"
             @mouseover="onMouseOver"
             @mouseleave="onMouseLeave"
             @dragenter="onDragEnter"
             @dragleave="onDragLeave"
             @start="onStart($event,glComponentInst)"
             @end="onEnd($event,glComponentInst)"
  >
    <template v-for="(slotItem,slotName) in glComponentInst.slots" v-slot:[slotName]>
      <component v-if="slotItem.propsTarget==='v-bind'" :is="slotItem.componentName" v-bind="slotItem.props"
                 :style="slotItem.style"></component>
      <component v-else-if="slotItem.propsTarget==='v-model'" :is="slotItem.componentName" v-model="slotItem.props"
                 :style="slotItem.style"></component>
      <template v-else>不支持的slot props target：{{ slotItem.propsTarget }}</template>
    </template>
    <!--    <GlComponentDnd v-if="childElement" v-for="childElement in glComponentInst.children"-->
    <!--                          :glComponentInst="childElement" :componentStoreId="componentStoreId"></GlComponentDnd>-->
    <!--    <div>xxx</div>-->
    <!--    <GlInsts :items="glComponentInst.children" :componentStoreId="componentStoreId"></GlInsts>-->
    <GlInst v-if="glComponentInst" v-for="(inst, index) in glComponentInst.children"
            :id="inst.id"
            :key="inst.id"
            :text="inst.id"
            :index="index"
            :moveCard="moveCard"
            :addItem="addItem"
            :glComponentInst="inst"
            :componentStoreId="componentStoreId"
    />
  </component>
</template>
<script lang="ts">
export default {
  name: "GlComponentDnd"
}
</script>
<script setup lang="ts">
import {emitter, mixins} from "@geelato/gl-ui";
import {onMounted, PropType} from "vue";
import {Action} from "@geelato/gl-ui-schema";
import {componentStoreFactory} from "@geelato/gl-ide";
import GlInsts from "./GlInsts.vue";

const props = defineProps({
  moveCard: Function as PropType<(dragIndex: number, hoverIndex: number, sourceId: number, targetId: number) => void>,
  addItem: Function,
  componentStoreId: {
    type: String,
    default() {
      return 'useComponentStore'
    }
  },
  ...mixins.props
})
const emits = defineEmits(['onComponentClick', 'onComponentMounted'])

const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)

const onClick = (...args: any[]) => {
  console.log('gl-component-recursion > onClick() > arguments:', args, props.glComponentInst)
  // 对于一些组件，点击事件可能是优先触发了组件内的点击事件，第一个参数不一定是event，这里对所有参数做统一处理
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
  componentStore.setCurrentSelectedComponentById(props.glComponentInst.id || '')
  emitter.emit('onComponentClick', {arguments: args, glComponentInst: props.glComponentInst})
  // 组件配置的动态绑定事件，运行时Runtime
  if (props.glComponentInst.actions && props.glComponentInst.actions.length > 0) {
    console.log('click action')
    props.glComponentInst.actions.forEach((action: Action) => {
      console.log('click action', action)
    })
  }
}
const onMouseOver = (...args: any[]) => {
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
  componentStore.setCurrentHoverComponentId(props.glComponentInst.id || '')
  componentStore.currentHoverComponentName = props.glComponentInst.id || ''
}
const onMouseLeave = (...args: any[]) => {
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
  componentStore.currentHoverComponentId = ''
  // componentStore.currentHoverComponentName = ''
}
const onStart = (event: any, glComponentInst: any) => {
  console.log('onStart()')
}
const onEnd = (event: any, glComponentInst: any) => {
  console.log('onEnd()')
}
const onDragEnter = (event: any) => {
  if (event?.target?.classList.contains('gl-drag-enter')) {
    return
  }
  // console.log('onDragEnter() > event:', event)
  event.target.classList.add('gl-drag-enter')
}
const onDragLeave = (event: any) => {
  // console.log('onDragLeave() > event:', event)
  if (event.target.classList.contains('gl-drag-enter')) {
    event.target.classList.remove('gl-drag-enter')
  }
}

onMounted(() => {
  emitter.emit('onComponentMounted', {})
})

/**
 *  由于部分组件，如AStep，采用template两层嵌套迭代用component渲染时，样式名称渲染为undefined
 *  在这里改成取出最终的迭代元素组成一层数据组，直接在component上迭代
 */
// const getChildElements = (glComponentInst: IComponentInstance) => {
//   let result: Array<any> = []
//   result.push()
//   for (let key in glComponentInst.children) {
//     // console.log('getChildElements glComponentInst:', glComponentInst, 'key:', key)
//     // @ts-ignore
//     for (let childElement of glComponentInst.children[key]) {
//       result.push(childElement)
//     }
//   }
//
//
//   // console.log('getChildElements> result:', result)
//   return result
// }
</script>

<style>
.gl-component {
}

.gl-component.gl-hover, .gl-component.gl-selected {
  border: 1px solid #178df7;
}

.gl-component.gl-drag-enter {
  /*border: 1px solid red;*/
}

.gl-drag-start {
  border: #ff0014 2px solid;
}
</style>
