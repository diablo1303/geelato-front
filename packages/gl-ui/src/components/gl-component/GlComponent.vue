<template>
  <component v-if="glComponentInst" :id="glComponentInst.id" :ref="glComponentInst.id"
             class="gl-component"
             :is="glComponentInst.componentName"
             v-model="glComponentInst.value"
             :userId="glComponentInst.componentName"
             v-bind="glComponentInst.propsWrapper?{[glComponentInst.propsWrapper]:glComponentInst.props}:glComponentInst.props"
             :style="glComponentInst.style"
             :parentId="glComponentInst.id"
             :glChildren="glComponentInst.children"
             @click="onClick"
             :glIsRuntime="glIsRuntime"
             :glRuntimeFlag="glRuntimeFlag"
             :glIndex="glIndex"
             :glComponentInst="glComponentInst"
  >
    <template v-for="(slotItem,slotName) in glComponentInst.slots">
      <component v-if="slotItem" :is="slotItem.componentName" v-bind="slotItem.props" :style="slotItem.style"
                 v-slot:[slotName]></component>
    </template>
    <GlComponent v-for="(childComponentInst,childIndex) in glComponentInst.children"
                 :glComponentInst="childComponentInst" :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag" :glIndex="childIndex"></GlComponent>
  </component>
</template>

<script lang="ts">
export default {
  name: "GlComponent"
}
</script>
<script lang="ts" setup>
import {getCurrentInstance, inject, onMounted, ref, watch} from 'vue'
import mixins from "../mixins";
import actionScriptExecutor from "../../m/actions/ActionScriptExecutor";
import type {Action} from "@geelato/gl-ui-schema";
import PageProvideProxy, {PageProvideKey} from "../PageProvideProxy";

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const props = defineProps({
  ...mixins.props
})

if (props.glComponentInst.componentName === 'GlUserSelect') {
  console.log('glComponentInst', props.glComponentInst)
}
const emits = defineEmits(['onComponentClick', 'onComponentMounted'])

/**
 *   执行propsExpress，计算出props的值，并合并到props中
 */
const executePropsExpress = () => {
  if (props.glComponentInst.propsExpress) {
    Object.keys(props.glComponentInst.propsExpress).forEach((key: string) => {
      // @ts-ignore
      const propExpress = props.glComponentInst.propsExpress[key]
      if (propExpress) {
        props.glComponentInst.props[key] = actionScriptExecutor.executeScript(propExpress, {})
        console.log('propExpress:', propExpress, actionScriptExecutor.executeScript(propExpress, {}))
      }
    })
  }
}

const onClick = (...args: any[]) => {
  // console.log('gl-component > onClick() > arguments:', args, props.glComponentInst)
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
 *  调用actionScriptExecutor.doAction
 *  @actionName 执行的动作名称
 */
const doAction = (actionName: string) => {
  if (props.glComponentInst.actions && props.glComponentInst.actions.length > 0) {
    console.log('doAction')
    props.glComponentInst.actions.forEach((action: Action) => {
      if (action.name === actionName) {
        console.log('GlComponent > doAction > action', action)
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
  /**
   *  将页面内的子组件通过map进行引用，便于后续基于页面进行组件事件调用
   */
  if (pageProvideProxy) {
    const inst = getCurrentInstance()
    pageProvideProxy.setVueInst(props.glComponentInst.id, inst)
  }

})

executePropsExpress()
defineExpose([onMouseLeave, onMouseOver])

</script>

<style>
.gl-component {
}
</style>
