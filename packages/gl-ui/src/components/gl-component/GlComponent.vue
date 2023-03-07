<template>
  <component v-if="glComponentInst" :id="glComponentInst.id" :ref="glComponentInst.id"
             class="gl-component"
             :is="glComponentInst.componentName"
             v-bind="glComponentInst.propsWrapper?{[glComponentInst.propsWrapper]:glComponentInst.props}:glComponentInst.props"
             :style="glComponentInst.style"
             :glComponentInst="glComponentInst"
             :parentId="glComponentInst.id"
             :glChildren="glComponentInst.children"
             @click="onClick"
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
    <GlComponent v-for="childComponentInst in glComponentInst.children"
                 :glComponentInst="childComponentInst"></GlComponent>
  </component>
</template>

<script lang="ts">
export default {
  name: "GlComponent"
}
</script>
<script lang="ts" setup>
import {onMounted} from 'vue'
import mixins from "../mixins";
import type IComponentInstance from "./IComponentInstance";

const props = defineProps(mixins.props)
const emits = defineEmits(['onComponentClick', 'onComponentMounted'])

const onClick = (...args:any[]) => {
  console.log('gl-component > onClick() > arguments:', args, props.glComponentInst)
  // 对于一些组件，点击事件可能是优先触发了组件内的点击事件，第一个参数不一定是event，这里对所有参数做统一处理
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
  emits('onComponentClick', {arguments: args, glComponentInst: props.glComponentInst})
}
const onMouseOver = (...args:any[]) => {
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }

}
const onMouseLeave = (...args:any[]) => {
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
}

onMounted(() => {
  emits('onComponentMounted', {})

})


/**
 *  由于部分组件，如AStep，采用template两层嵌套迭代用component渲染时，样式名称渲染为undefined
 *  在这里改成取出最终的迭代元素组成一层数据组，直接在component上迭代
 */
const getChildComponentInsts = (glComponentInst: IComponentInstance) => {
  let result: Array<any> = []
  for (let key in glComponentInst.children) {
    // @ts-ignore
    for (let childElement of glComponentInst.children[key]) {
      result.push(childElement)
    }
  }
  return result
}
</script>

<style>
.gl-component {
}
</style>
