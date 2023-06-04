<template>
  <component v-if="glComponentInst&&(glComponentInst.props.unRender!==true)"
             :id="glComponentInst.id" :ref="glComponentInst.id"
             class="gl-component"
             :is="glComponentInst.componentName"
             v-model="mv"
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
    <template v-for="(slotItem,slotName) in glComponentInst.slots" v-slot:[slotName]>
      <!--      <component v-if="slotItem" :is="slotItem.componentName" v-bind="slotItem.props" :style="slotItem.style"-->
      <!--                 v-slot:[slotName] :glRuntimeFlag="glRuntimeFlag" :glIsRuntime="glIsRuntime"></component>-->
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
    <GlComponent v-for="(childComponentInst,childIndex) in glComponentInst.children"
                 :glComponentInst="childComponentInst" :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag"
                 :glIndex="childIndex"></GlComponent>
  </component>
</template>

<script lang="ts">
export default {
  name: "GlComponent"
}
</script>
<script lang="ts" setup>
import {getCurrentInstance, inject, onMounted, onUnmounted, ref, watch} from 'vue'
import mixins from "../mixins";
import actionScriptExecutor from "../../m/actions/ActionScriptExecutor";
import type {Action} from "@geelato/gl-ui-schema";
import PageProvideProxy, {PageProvideKey} from "../PageProvideProxy";

const emits = defineEmits(['update:modelValue', 'update', 'onComponentClick', 'onComponentChange', 'onComponentMounted'])
const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object]
  },
  ...mixins.props
})


const stopPropagation = (...args: any[]) => {
  // 对于一些组件，点击事件可能是优先触发了组件内的点击事件，第一个参数不一定是event，这里对所有参数做统一处理
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
}
const onClick = (...args: any[]) => {
  // console.log('gl-component > onClick() > arguments:', args, props.glComponentInst)
  stopPropagation()
  emits('onComponentClick', {arguments: args, glComponentInst: props.glComponentInst, glCtx: props.glCtx})
  doAction('click')
}

const onChange = (...args: any[]) => {
  // console.log('gl-component > onChange() > arguments:', args, props.glComponentInst)
  // 对于一些组件，事件可能是优先触发了组件内的事件，第一个参数不一定是event，这里对所有参数做统一处理
  stopPropagation()
  emits('onComponentChange', {arguments: args, glComponentInst: props.glComponentInst, glCtx: props.glCtx})
  doAction('change')
}


// if (props.glComponentInst.componentName === 'GlUserSelect') {
//   console.log('glComponentInst', props.glComponentInst)
// }

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


/**
 *  组件配置的动态绑定事件，运行时Runtime
 *  调用actionScriptExecutor.doAction
 *  @actionName 执行的动作名称
 */
const doAction = (actionName: string) => {
  if (props.glComponentInst.actions && props.glComponentInst.actions.length > 0) {
    props.glComponentInst.actions.forEach((action: Action) => {
      if (action.eventName === actionName) {
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

const mv = ref(props.modelValue || props.glComponentInst.value)

watch(() => {
  return props.glComponentInst.value
}, () => {
  mv.value = props.glComponentInst.value
})

// @ts-ignore
props.glComponentInst.value = mv.value
watch(mv, () => {
  // @ts-ignore
  props.glComponentInst.value = mv.value
  // console.log('update mv', mv.value)
  onChange()
  // 注意这两个事件的顺序不能调整，先更改modelValue的值，以便于父组件相关的值改变之后，再触发update事件
  emits('update:modelValue', mv.value)
  emits('update', mv.value)
})

onMounted(() => {
  emits('onComponentMounted', {})
  /**
   *  将页面内的子组件通过map进行引用，便于后续基于页面进行组件事件调用
   */
  pageProvideProxy?.setVueInst(props.glComponentInst.id, getCurrentInstance())
})

executePropsExpress()
defineExpose([onMouseLeave, onMouseOver])

</script>

<style>
.gl-component {
}
</style>
