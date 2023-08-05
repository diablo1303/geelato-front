<template>
  <component v-if="glComponentInst&&glComponentInst?.props.unRender!==true"
             :id="glComponentInst.id" :ref="glComponentInst.id"
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
import {getCurrentInstance, inject, nextTick, onMounted, onUpdated, ref, watch} from 'vue'
import mixins from "../mixins";
import jsScriptExecutor from "../../m/actions/JsScriptExecutor";
import type {Action} from "@geelato/gl-ui-schema";
import PageProvideProxy, {PageProvideKey} from "../PageProvideProxy";

const emits = defineEmits(['update:modelValue', 'update', 'onAction', 'onComponentClick', 'onValueChange', 'onComponentMounted'])
const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object]
  },
  ...mixins.props
})

pageProvideProxy?.setVueInst(props.glComponentInst.id, getCurrentInstance())

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
const doAction = (actionName: string, ...args: any) => {
  // console.log('GlComponent > doAction() > args:', actionName, args)
  if (props.glComponentInst.actions && props.glComponentInst.actions.length > 0) {
    props.glComponentInst.actions.forEach((action: Action) => {
      if (action.eventName === actionName) {
        // console.log('GlComponent > doAction > action', action)
        let ctx = inject('$ctx') as object || {}
        Object.assign(ctx, props.glCtx, {args: args}, {
          pageProxy: pageProvideProxy
        })
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

/**
 *   运行属性表达式
 *   依据propsExpression设置的各属值的值表达式，计算出值，并合设置到props中，覆盖props中相应属性的值
 */
const executePropsExpressions = () => {
  if (props.glComponentInst.propsExpressions) {
    Object.keys(props.glComponentInst.propsExpressions).forEach((key: string) => {
      // @ts-ignore
      const propsExpression = props.glComponentInst.propsExpressions[key]
      if (propsExpression) {
        if (key === '_valueExpression') {
          // 组件值
          props.glComponentInst.value = jsScriptExecutor.evalExpression(propsExpression, {
            pageProxy: pageProvideProxy
          })
        } else {
          // 属性计
          props.glComponentInst.props[key] = jsScriptExecutor.evalExpression(propsExpression, {
            pageProxy: pageProvideProxy
          })
        }
      }
    })
  }

  // 对于对象型属性进行转换，如GlEntityTable的{base:{xx:yy,xx2:yy2}}
  function executeObjectPropsExpressions(obj: any) {
    // @ts-ignore
    if (typeof obj === 'object') {
      if (obj.length !== undefined) {
        // array
        for (const objKey in obj) {
          executeObjectPropsExpressions(obj[objKey])
        }
      } else {
        // object
        if (obj._propsExpressions) {
          Object.keys(obj._propsExpressions).forEach((key: string) => {
            const expression = obj._propsExpressions[key]
            if (expression) {
              obj[key] = jsScriptExecutor.evalExpression(expression, {
                pageProxy: pageProvideProxy
              })
            }
          })
        }
        // 处理对象的子级
        for (const objKey in obj) {
          executeObjectPropsExpressions(obj[objKey])
        }
      }
    }
  }

  executeObjectPropsExpressions(props.glComponentInst.props)
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

// watch(() => {
//   return props.modelValue
// }, () => {
//   mv.value = props.modelValue
// })


// @ts-ignore
props.glComponentInst.value = mv.value
watch(mv, (value, oldValue) => {
  // @ts-ignore
  props.glComponentInst.value = value
  onValueChange(value)

  // 注意这两个事件的顺序不能调整，先更改modelValue的值，以便于父组件相关的值改变之后，再触发update事件
  emits('update:modelValue', value)
  emits('update', value)
}, {immediate: true})

watch(() => {
  return props.glComponentInst.props._hidden
}, (value, oldValue) => {
  console.log('_hidden', value, oldValue)
  refreshFlag.value = false
  nextTick(() => {
    refreshFlag.value = true
  })
})

let init = false
onMounted(() => {

  /**
   *  将页面内的子组件通过map进行引用，便于后续基于页面进行组件事件调用
   *  注意需在创建后即执行，以确保后续的运算可以用到该实例
   */
  if (!init) {

  }
  init = true
  //  触发组件配置的事件，只限运行时，GlPage的onMounted另行触发，在此不执行
  // if (props.glIsRuntime && props.glComponentInst.componentName !== 'GlPage') {
  //   props.glComponentInst.actions?.forEach((action: Action) => {
  //     if (action.name === 'onMounted') {
  //       jsScriptExecutor.doAction(action, {
  //         pageProxy: pageProvideProxy
  //       })
  //     }
  //   })
  // }

  emits('onComponentMounted', {})
})
executePropsExpressions()
defineExpose({onMouseLeave, onMouseOver})

</script>

<style>
.gl-component {
}
</style>
