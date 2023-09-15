<!--glComponentInst.componentName!=='GlHiddenArea'提高安全性，降低通过修改组件的_hidden属性来显示内容的风险-->
<template>
  <component
      v-if="glComponentInst&&glComponentInst.componentName&&glComponentInst.props.unRender!==true"
      v-show="glComponentInst.props?._hidden !== true&&glComponentInst.componentName!=='GlHiddenArea'"
      :id="glComponentInst.id"
      :ref="glComponentInst.id"
      class="gl-component"
      :is="glComponentInst.componentName"
      v-model="mv"
      :userId="glComponentInst.componentName"
      v-bind="glComponentInst.propsWrapper?{[glComponentInst.propsWrapper]:glComponentInst.props}:glComponentInst.props"
      :style="glComponentInst.style"
      :parentId="glComponentInst.id"
      :glChildren="glComponentInst.children"
      :glIsRuntime="glIsRuntime"
      :glRuntimeFlag="glRuntimeFlag"
      :glIndex="glIndex"
      :glComponentInst="glComponentInst"
      v-on="onActionsHandler"
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
import {computed, getCurrentInstance, inject, nextTick, onMounted, ref, watch} from 'vue'
import mixins from "../mixins";
import jsScriptExecutor from "../../m/actions/JsScriptExecutor";
import type {Action} from "@geelato/gl-ui-schema";
import PageProvideProxy, {PageProvideKey} from "../PageProvideProxy";
import {executePropsExpressions} from "./GlComponentSupport";


const emits = defineEmits(['update:modelValue', 'update', 'onAction', 'onComponentClick', 'onValueChange'])

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object]
  },
  ...mixins.props
})

const pageProvideProxy: PageProvideProxy | undefined = props.glIgnoreInjectPageProxy ? undefined : inject(PageProvideKey)!

// console.log('GlComponent > setVueRef >', props.glComponentInst.componentName, props.glComponentInst.id, getCurrentInstance(), pageProvideProxy)
// 在setup阶段先setVueRef，对于有些组件如GlTable
pageProvideProxy?.setVueRef(props.glComponentInst.id, getCurrentInstance())

const refreshFlag = ref(true)

/**
 * 对于一些组件，点击事件可能是优先触发了组件内的点击事件，第一个参数不一定是event，这里对所有参数做统一处理
 * @param args
 */
const stopPropagation = (...args: any) => {
  for (let i in args) {
    let event = args[i]
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation()
    }
  }
}

/**
 *  组件配置的动态绑定事件，运行时Runtime
 *  调用actionScriptExecutor.doAction
 *  @actionName 执行的动作名称
 */
const doAction = (actionName: string, args: any) => {
  // console.log('GlComponent > doAction() > args:', actionName, args)
  if (props.glComponentInst.actions && props.glComponentInst.actions.length > 0) {
    props.glComponentInst.actions.forEach((action: Action) => {
      if (action.eventName === actionName) {
        // console.log('GlComponent > doAction > action', action)
        // let ctx = inject('$ctx') as object || {}
        let ctx = {}
        Object.assign(ctx, props.glCtx, {args}, {
          pageProxy: pageProvideProxy
        })
        // console.log('GlComponent > doAction() > ctx:', actionName, ctx)
        jsScriptExecutor.doAction(action, ctx)
      }
    })
  }
}

const createActionHandler = (actionName: string) => {
  return (...args: any) => {
    stopPropagation(args)
    emits('onAction', {arguments: args, glComponentInst: props.glComponentInst, glCtx: props.glCtx})
    doAction(actionName, args)
  }
}

// 所有的action处理器，依据组件实体配置的action形成action事件响应对象，匹配不同的事件
const onActionsHandler: { [key: string]: any } = {}
props.glComponentInst?.actions?.forEach((action: Action) => {
  onActionsHandler[action.eventName] = createActionHandler(action.eventName)
})

const onValueChange = (...args: any) => {
  // console.log('gl-component > onValueChange() > arguments:', args, props.glComponentInst)
  // 对于一些组件，事件可能是优先触发了组件内的事件，第一个参数不一定是event，这里对所有参数做统一处理
  stopPropagation(args)
  emits('onValueChange', {arguments: args, glComponentInst: props.glComponentInst, glCtx: props.glCtx})
  doAction('onValueChange', args)
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

const mv = <any>ref(props.modelValue || props.glComponentInst.value)

watch(() => {
  return props.glComponentInst.value
}, () => {
  mv.value = props.glComponentInst.value
})

// 开启监控，待观察是否有副作用 8.8
watch(() => {
  return props.modelValue
}, () => {
  mv.value = props.modelValue
})

props.glComponentInst.value = mv.value
watch(mv, (value, oldValue) => {
  props.glComponentInst.value = value

  // 注意这两个事件的顺序不能调整，先更改modelValue的值，以便于父组件相关的值改变之后，再触发update事件
  emits('update:modelValue', value)
  emits('update', value)
  // 这个需放在 'update:modelValue' 事件之后，确保组件的值已更新
  onValueChange(value)

}, {immediate: true})

watch(() => {
  return props.glComponentInst.props._hidden + '_' + props.glComponentInst.props.unRender
}, (value, oldValue) => {
  // console.log('_hidden_unRender', props.glComponentInst.props.label, value, oldValue)
  refreshFlag.value = false
  nextTick(() => {
    refreshFlag.value = true
  })
})
// console.log('props.glCtx', props.glCtx, props.glComponentInst.props?.label, '_hidden', props.glComponentInst.props?._hidden)
const isShow = computed(() => {
  return props.glComponentInst.props?._hidden
})

// const onSubMounted = (args: any) => {
//   console.log('......onSubMounted', args)
// }
onMounted(() => {
  // 在此再调用setVueRef，确保pageProvideProxy的onMounted事件在各组件的加载完成之后触发
  pageProvideProxy?.setVueRef(props.glComponentInst.id, getCurrentInstance())

  // console.log('executePropsExpressions ctx', props.glComponentInst.componentName, {
  //   pageProxy: pageProvideProxy,
  //   ...props.glCtx
  // })
  // 2023-9-13 将脚本执行移到onMounted事件中，确保此时vueRef已存在
  executePropsExpressions(props.glComponentInst, {
    pageProxy: pageProvideProxy,
    ...props.glCtx
  })
})
defineExpose({onMouseLeave, onMouseOver})

</script>

<style>
.gl-component {
}
</style>
