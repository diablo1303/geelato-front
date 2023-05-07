<template>
  <component v-if="glComponentInst" :id="glComponentInst.id" :ref="glComponentInst.id"
             class="gl-component"
             :is="glComponentInst.componentName"
             v-bind="glComponentInst.propsWrapper?{[glComponentInst.propsWrapper]:glComponentInst.props}:glComponentInst.props"
             :style="glComponentInst.style"
             :parentId="glComponentInst.id"
             :glChildren="glComponentInst.children"
             @click="onClick"
             :glIsRuntime="glIsRuntime"
             :glIndex="glIndex"
             :glComponentInst="glComponentInst"
  >
    <!-- 通过加入空span 解决按钮组件动态slot时，按钮大小不随内容变化的问题-->
    <template v-for="(slotItem,slotName) in glComponentInst.slots">
      <component v-if="slotItem" :is="slotItem.componentName" v-bind="slotItem.props" :style="slotItem.style"
                 v-slot:[slotName]></component>
    </template>
    <GlComponent v-for="(childComponentInst,childIndex) in glComponentInst.children"
                 :glComponentInst="childComponentInst" :glIsRuntime="glIsRuntime" :glIndex="childIndex"></GlComponent>
  </component>
</template>

<script lang="ts">
export default {
  name: "GlComponent"
}
</script>
<script lang="ts" setup>
import {inject, onMounted} from 'vue'
import mixins from "../mixins";
import actionScriptExecutor from "../../m/actions/ActionScriptExecutor";
import type {Action} from "@geelato/gl-ui-schema";

const props = defineProps({
  ...mixins.props
})
const emits = defineEmits(['onComponentClick', 'onComponentMounted'])

const onClick = (...args: any[]) => {
  console.log('gl-component > onClick() > arguments:', args, props.glComponentInst)
  // 对于一些组件，点击事件可能是优先触发了组件内的点击事件，第一个参数不一定是event，这里对所有参数做统一处理
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
  emits('onComponentClick', {arguments: args, glComponentInst: props.glComponentInst, glCtx: props.glCtx})

  doAction('click')
}

/**
 *  组件配置的动态绑定事件，运行时Runtime
 *  @actionName 执行的动作名称
 */
const doAction = (actionName: string) => {
  if (props.glComponentInst.actions && props.glComponentInst.actions.length > 0) {
    console.log('doAction')
    props.glComponentInst.actions.forEach((action: Action) => {
      if (action.name === actionName) {
        console.log('click action', action)
        let ctx = inject('$ctx') as object || {}
        Object.assign(ctx, props.glCtx)
        actionScriptExecutor.doAction(action, ctx)
      }
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

}
const onMouseLeave = (...args: any[]) => {
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


</script>

<style>
.gl-component {
}
</style>
