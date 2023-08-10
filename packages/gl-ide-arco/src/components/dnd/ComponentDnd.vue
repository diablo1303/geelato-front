<template>
  <component v-if="glComponentInst"
             :id="glComponentInst.id"
             :ref="glComponentInst.id"
             :class="{'gl-hover':componentStore.currentHoverComponentId===glComponentInst.id,'gl-selected':componentStore.currentSelectedComponentId===glComponentInst.id}"
             class="gl-component"
             :is="glComponentInst.componentName"
             v-model="glComponentInst.value"
             v-bind="glComponentInst.propsWrapper?{[glComponentInst.propsWrapper]:glComponentInst.props}:glComponentInst.props"
             :style="glComponentInst.style"
             :glComponentInst="glComponentInst"
             :parentId="glComponentInst.id"
             :glChildren="glComponentInst.children"
             :glIsRuntime="glIsRuntime"
             :glRuntimeFlag="glRuntimeFlag"
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
                 :style="slotItem.style" :glRuntimeFlag="glRuntimeFlag" :glIsRuntime="glIsRuntime"></component>
      <component v-else-if="slotItem.propsTarget==='v-model'&&slotItem.propsName" :is="slotItem.componentName"
                 v-model:[slotItem.propsName]="slotItem.props"
                 :style="slotItem.style" :glRuntimeFlag="glRuntimeFlag" :glIsRuntime="glIsRuntime"></component>
      <component v-else-if="slotItem.propsTarget==='v-model'&&!slotItem.propsName" :is="slotItem.componentName"
                 v-model="slotItem.props"
                 :style="slotItem.style" :glRuntimeFlag="glRuntimeFlag" :glIsRuntime="glIsRuntime"></component>
      <template v-else>不支持的slot props target：{{ slotItem.propsTarget }}，请检查组件定义配置。</template>
    </template>
    <!--    <GlComponentDnd v-if="childElement" v-for="childElement in glComponentInst.children"-->
    <!--                          :glComponentInst="childElement" :componentStoreId="componentStoreId"></GlComponentDnd>-->
    <!--    <div>xxx</div>-->
    <!--    <GlInsts :items="glComponentInst.children" :componentStoreId="componentStoreId"></GlInsts>-->
<!--    :key="inst.id"-->
    <GlInst v-if="glComponentInst" v-for="(inst, index) in glComponentInst.children"
            :id="inst.id"
            :index="index"
            :moveItem="moveItem"
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
import {emitter, mixins, PageProvideKey, PageProvideProxy} from "@geelato/gl-ui";
import {getCurrentInstance, inject, onMounted, type PropType} from "vue";
import {componentStoreFactory} from "@geelato/gl-ide";

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const props = defineProps({
  moveItem: Function as PropType<(dragIndex: number, hoverIndex: number, sourceId: number, targetId: number) => void>,
  addItem: Function,
  ...mixins.props
})
const emits = defineEmits(['onComponentClick'])

// console.log('ComponentDnD > props.componentStoreId:',props.componentStoreId)
const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)

const onClick = (...args: any[]) => {
  // console.log('gl-component-dnd > onClick() > arguments:', args, props.glComponentInst)
  // 特殊处理，点击组件GlDndPlaceholder，不做响应
  // if (props.glComponentInst.componentName === 'GlDndPlaceholder') {
  //   return
  // }
  // 对于一些组件，点击事件可能是优先触发了组件内的点击事件，第一个参数不一定是event，这里对所有参数做统一处理
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
  const fromPageId = pageProvideProxy?.pageInst.id || props.glComponentInst.id
  componentStore.setCurrentSelectedComponentById(props.glComponentInst.id || '', fromPageId)
  emitter.emit('onComponentClick', {arguments: args, glComponentInst: props.glComponentInst})
  // 组件配置的动态绑定事件，运行时Runtime
  // if (props.glComponentInst.actions && props.glComponentInst.actions.length > 0) {
  //   console.log('click action')
  //   props.glComponentInst.actions.forEach((action: Action) => {
  //     console.log('click action', action)
  //   })
  // }
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

/**
 *  将页面内的子组件通过map进行引用，便于后续基于页面进行组件事件调用
 */
pageProvideProxy?.setVueInst(props.glComponentInst.id, getCurrentInstance())

</script>

<style>
.gl-component {
}

.gl-component.gl-hover, .gl-component.gl-selected {
  border: 1px solid #165DFF;
}

.gl-entity-form.gl-component.gl-hover, .gl-entity-form.gl-component.gl-selected {
  border: 1px solid #D91AD9;
}

.gl-component.gl-drag-enter {
  /*border: 1px solid red;*/
}

.gl-drag-start {
  border: #ff0014 2px solid;
}
</style>
