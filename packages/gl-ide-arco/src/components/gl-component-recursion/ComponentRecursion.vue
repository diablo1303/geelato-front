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
    <template v-for="(slotItem,slotName) in glComponentInst.slots">
      <component :is="slotItem.componentName" v-bind="slotItem.props" :style="slotItem.style"
                 v-slot:[slotName]></component>
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
    <GlComponentRecursion v-for="childElement in getChildElements(glComponentInst)"
                          :glComponentInst="childElement"></GlComponentRecursion>
  </component>
</template>
<script lang="ts">
export default {
  name: "GlComponentRecursion"
}
</script>
<script setup lang="ts">
import {mixins} from "@geelato/gl-ui";
import {useIdeStore} from "@geelato/gl-ide";
import {emitter} from "@geelato/gl-ui";
import {onMounted} from "vue";
import IComponentInstance from "@geelato/gl-ui/src/components/gl-component/IComponentInstance";

const props = defineProps(mixins.props)
const emits = defineEmits(['onComponentClick', 'onComponentMounted'])

const componentStore = useIdeStore().componentStore

const onClick = (...args: any[]) => {
  console.log('gl-component > onClick() > arguments:', args, props.glComponentInst)
  // 对于一些组件，点击事件可能是优先触发了组件内的点击事件，第一个参数不一定是event，这里对所有参数做统一处理
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
  componentStore.setCurrentSelectedComponentById(props.glComponentInst.id || '')
  emitter.emit('onComponentClick', {arguments: args, glComponentInst: props.glComponentInst})
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
}
const onEnd = (event: any, glComponentInst: any) => {
}
const onDragEnter = (event: any) => {
  console.log('onDragEnter() > event:', event)
  if (event?.target?.classList.contains('gl-drag-enter')) {
    return
  }
  event.target.classList.add('gl-drag-enter')
}
const onDragLeave = (event: any) => {
  console.log('onDragLeave() > event:', event)
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
const getChildElements = (glComponentInst: IComponentInstance) => {
  let result: Array<any> = []
  for (let key in glComponentInst.children) {
    // @ts-ignore
    for (let childElement of glComponentInst.children[key]) {
      result.push(childElement)
    }
  }
  // console.log('getChildElements> result:', result)
  return result
}
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
