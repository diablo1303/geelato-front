<template>
  <component v-if="glComponentInst" :id="glComponentInst.id" :ref="glComponentInst.id"
             :class="{'gl-hover':componentStore.currentHoverComponentId===glComponentInst.id,'gl-selected':componentStore.currentSelectedComponentId===glComponentInst.id}"
             class="gl-component"
             :is="glComponentInst.componentName"
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
    <!-- 通过加入空span 解决按钮组件动态slot时，按钮大小不随内容变化的问题-->
    <template v-for="(slotItem,slotName) in glComponentInst.slots" v-slot:[slotName]>

      <component v-if="slotItem.propsTarget==='v-bind'" :is="slotItem.componentName" v-bind="slotItem.props"
                 :style="slotItem.style"></component>
      <component v-else-if="slotItem.propsTarget==='v-model'" :is="slotItem.componentName" v-model="slotItem.props"
                 :style="slotItem.style"></component>
      <template v-else>不支持的slot props target：{{ slotItem.propsTarget }}</template>

      <!--<GlIconfont :type="slotItem.gl_font_class"></GlIconfont>  -->
      <!--      <template v-if="slotItem.handler==='ComponentHandler'">-->
      <!--        <component :is="slotItem.componentName" v-bind="slotItem.props" :style="slotItem.style"-->
      <!--                   v-slot:[slotName]></component>-->
      <!--        &lt;!&ndash; 用于按钮附加文本 &ndash;&gt;-->
      <!--        &lt;!&ndash; {{slotItem.props.gl_text}} &ndash;&gt;-->
      <!--      </template>-->
      <!--      <template v-else-if="slotItem.handler==='FunctionHandler'">-->
      <!--        TODO FunctionHandler-->
      <!--      </template>-->
      <!--      &lt;!&ndash;  在组件内直接插入html&ndash;&gt;-->
      <!--      <div v-else-if="slotItem.handler==='HtmlHandler'" v-html="slotItem.props.html">-->
      <!--      </div>-->
    </template>
    <!--    <GlComponentRecursion v-if="childElement" v-for="childElement in glComponentInst.children"-->
    <!--                          :glComponentInst="childElement" :componentStoreId="componentStoreId"></GlComponentRecursion>-->
    <template v-for="childElement in glComponentInst.children">
      <GlComponentRecursion v-if="childElement"
                            :glComponentInst="childElement" :componentStoreId="componentStoreId"></GlComponentRecursion>
    </template>
  </component>
</template>
<script lang="ts">
export default {
  name: "GlComponentRecursion"
}
</script>
<script setup lang="ts">
import {emitter, mixins} from "@geelato/gl-ui";
import {onMounted} from "vue";
import type {Action} from "@geelato/gl-ui-schema";
import {componentStoreFactory} from "@geelato/gl-ide";

const props = defineProps({
  ...mixins.props
})
const emits = defineEmits(['onComponentClick', 'onComponentMounted'])

const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)
// console.log('componentStore:',componentStore)
// const slots = computed(() => {
//   // @ts-ignore
//   props.glComponentInst.props.filter((propItem: any) => {
//
//   })
// })

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
  /*border: 1px solid #178df7;*/
}

.gl-component.gl-drag-enter {
  /*border: 1px solid red;*/
}

.gl-drag-start {
  border: #ff0014 2px solid;
}
</style>
