<template>
  <component
    :key="reRenderKey"
    v-if="glComponentInst && glComponentInst.componentName && unRender !== true && hasPermission()"
    v-show="hidden !== true && glComponentInst.componentName !== 'GlHiddenArea'"
    :id="glComponentInst.id"
    :ref="glComponentInst.id"
    class="gl-component"
    :is="glComponentInst.componentName"
    :modelValue="mv"
    @update:modelValue="onUpdateModelValue"
    :userId="glComponentInst.componentName"
    v-bind="
      glComponentInst.propsWrapper
        ? { [glComponentInst.propsWrapper]: glComponentInst.props }
        : glComponentInst.props
    "
    :style="glComponentInst.style"
    :parentId="glComponentInst.id"
    :glChildren="glComponentInst.children"
    :glIsRuntime="glIsRuntime"
    :glRuntimeFlag="glRuntimeFlag"
    :glIndex="glIndex"
    :glLoopItem="glLoopItem"
    :glLoopIndex="glLoopIndex"
    :glComponentInst="glComponentInst"
    :pageCustom="pageCustom"
    :pagePermission="pagePermission"
    v-on="onActionsHandler"
    :title="glComponentInst.props.description"
  >
    <template v-for="(slotItem, slotName) in glComponentInst.slots" v-slot:[slotName]>
      <component
        v-if="slotItem.propsTarget === 'v-bind'"
        :is="slotItem.componentName"
        v-bind="slotItem.props"
        :style="slotItem.style"
        :glRuntimeFlag="glRuntimeFlag"
        :glIsRuntime="glIsRuntime"
        :pageCustom="pageCustom"
        :pagePermission="pagePermission"
      ></component>
      <component
        v-else-if="slotItem.propsTarget === 'v-model' && slotItem.propsName"
        :is="slotItem.componentName"
        v-model:[slotItem.propsName]="slotItem.props"
        :style="slotItem.style"
        :glRuntimeFlag="glRuntimeFlag"
        :glIsRuntime="glIsRuntime"
        :pageCustom="pageCustom"
        :pagePermission="pagePermission"
      ></component>
      <component
        v-else-if="slotItem.propsTarget === 'v-model' && !slotItem.propsName"
        :is="slotItem.componentName"
        v-model="slotItem.props"
        :style="slotItem.style"
        :glRuntimeFlag="glRuntimeFlag"
        :glIsRuntime="glIsRuntime"
        :pageCustom="pageCustom"
        :pagePermission="pagePermission"
      ></component>
      <template v-else
        >不支持的slot props target：{{ slotItem.propsTarget }}，请检查组件定义配置。
      </template>
    </template>
    <GlComponent
      v-for="(childComponentInst, childIndex) in glComponentInst.children"
      :glComponentInst="childComponentInst"
      :glIsRuntime="glIsRuntime"
      :glRuntimeFlag="glRuntimeFlag"
      :glIndex="childIndex"
      :pageCustom="pageCustom"
      :pagePermission="pagePermission"
    ></GlComponent>
  </component>
</template>

<script lang="ts" setup>
import { getCurrentInstance, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import mixins from '../mixins'
import jsScriptExecutor from '../../m/actions/JsScriptExecutor'
import type { Action } from '@geelato/gl-ui-schema'
import PageProvideProxy, { PageProvideKey } from '../PageProvideProxy'
import { executePropsExpressions } from './GlComponentSupport'
import useLogger from '../../m/hooks/useLogger'
import utils from '../../m/utils/Utils'

const detachedElementRef = ref(null)
let logger = useLogger('gl-component')
defineOptions({ name: 'GlComponent' })

const emits = defineEmits([
  'update:modelValue',
  'update',
  'onAction',
  'onComponentClick',
  'onValueChange'
])

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Array, Object]
  },
  ...mixins.props
})

/**
 * 组件实例变量
 * 用于外部通过脚本调用组件的setVar、getVar方法，设置和获取变量值
 * 这样在脚本编排中，可以存储中间值，不需要去创建一个组件来存储值
 * 可以替换隐藏表单域的一些功能
 */
const vars: Record<string, any> = ref({})
const _setVar = (params:{name: string, value: any}) => {
  console.log('_setVar', params, 'instId',props.glComponentInst.id)
  vars.value[params.name] = params.value
}
const _getVar = (params:{name: string}) => {
  console.log('_getVar', params,'instId', props.glComponentInst.id)
  return vars.value[params.name]
}

const _getVars = () => {
  return vars.value
}
/**
 * 获取组件实例变量响应式引用
 */
const _getVarsRef = () => {
  return vars
}

// logger.debug(props.glComponentInst.componentName,props.glComponentInst.id,props.glComponentInst.value,'modelValue:',props.modelValue)

// 由于在一些场景下更新props.glComponentInst.props._hidden的值，不能响应式更新UI,这里增加一个值来控制
const hidden = ref(!!props.glComponentInst.props?._hidden)
const unRender = ref(!!props.glComponentInst.props?.unRender)
let pageProvideProxy: PageProvideProxy | undefined = props.glIgnoreInjectPageProxy
  ? undefined
  : inject(PageProvideKey)!

// logger.debug('GlComponent > setVueRef >', props.glComponentInst.componentName, props.glComponentInst.id, getCurrentInstance(), pageProvideProxy)
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
  // logger.debug('GlComponent > doAction() > args:', actionName, args)
  const promises: Promise<any>[] = []
  if (props.glComponentInst.actions && props.glComponentInst.actions.length > 0) {
    props.glComponentInst.actions.forEach((action: Action) => {
      if (action.eventName === actionName) {
        // logger.debug('GlComponent > doAction > action', action)
        // let ctx = inject('$ctx') as object || {}
        let ctx = {}
        Object.assign(
          ctx,
          props.glCtx,
          { args },
          {
            pageProxy: pageProvideProxy
          }
        )
        logger.debug(
          `GlComponent(${props.glComponentInst.componentName},${props.glComponentInst.id}) > doAction() > ctx:`,
          actionName,
          ctx
        )
        promises.push(jsScriptExecutor.doAction(action, ctx))
      }
    })
  }
  return Promise.all(promises)
}

const createActionHandler = (actionName: string) => {
  return (...args: any) => {
    stopPropagation(args)
    emits('onAction', {
      arguments: args,
      glComponentInst: props.glComponentInst,
      glCtx: props.glCtx
    })
    if (args.length > 0 && typeof args[0]?.$resolve === 'function') {
      // 表示侦听的事件需要同步执行
      return doAction(actionName, args).then(() => {
        return args[0].$resolve()
      })
    } else {
      // 否则正常异步调用
      return doAction(actionName, args)
    }
  }
}

const defaultSyncActionHandler = (...args: any) => {
  stopPropagation(args)
  emits('onAction', {
    arguments: args,
    glComponentInst: props.glComponentInst,
    glCtx: props.glCtx
  })
  if (args.length > 0 && typeof args[0]?.$resolve === 'function') {
    return args[0].$resolve()
  }
}

// 所有的action处理器，依据组件实体配置的action形成action事件响应对象，匹配不同的事件
let onActionsHandler: { [key: string]: any } = {}
props.glComponentInst?.actions?.forEach((action: Action) => {
  onActionsHandler[action.eventName] = createActionHandler(action.eventName)
})

// TODO defaultSyncEvents需要在外部注册进来
// 默认需要同步执行的事件，如果组件没有配置该事件，则会默认会侦听该事件，以实现回调
const defaultSyncEvents: Record<string, Array<string>> = {}
defaultSyncEvents['GlEntityForm'] = ['onCreatedEntitySavers']
// 注册默认的事件
defaultSyncEvents[props.glComponentInst.componentName]?.forEach((eventName: string) => {
  // 如果没有配置该事件，则默认加上
  if (!onActionsHandler[eventName]) {
    onActionsHandler[eventName] = defaultSyncActionHandler
  }
})

const onValueChange = (...args: any) => {
  // logger.debug('gl-component > onValueChange() > arguments:', args, props.glComponentInst)
  // 对于一些组件，事件可能是优先触发了组件内的事件，第一个参数不一定是event，这里对所有参数做统一处理
  stopPropagation(args)
  emits('onValueChange', {
    arguments: args,
    glComponentInst: props.glComponentInst,
    glCtx: props.glCtx
  })
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

// logger.debug('set mv as props.modelValue || props.glComponentInst.value:',props.modelValue || props.glComponentInst.value)
const mv = ref(props.modelValue || props.glComponentInst.value)

watch(
  () => {
    return props.glComponentInst.value
  },
  () => {
    // logger.debug('watch props.glComponentInst.value,and set mv.value:',props.glComponentInst.value)
    mv.value = props.glComponentInst.value
  }
)

// 开启监控，待观察是否有副作用 8.8
watch(
  () => {
    return props.modelValue
  },
  () => {
    // logger.debug('watch props.modelValue,and set mv.value:',props.modelValue)
    mv.value = props.modelValue
  }
)

/**
 * 值为object格式时，值改变没有被watch(mv)检测到，这里改用，事件来处理值改变
 * @param value
 */
const onUpdateModelValue = (value: any) => {
  // logger.debug('onUpdateModelValue and set mv.value:',props.modelValue)
  mv.value = value
  if (typeof mv.value === 'object') {
    // 如果组件值为对象时，触发值改变操作
    props.glComponentInst.value = value
    // 注意这两个事件的顺序不能调整，先更改modelValue的值，以便于父组件相关的值改变之后，再触发update事件
    emits('update:modelValue', value)
    emits('update', value)
    // 这个需放在 'update:modelValue' 事件之后，确保组件的值已更新
    onValueChange(value)
  }
}

props.glComponentInst.value = mv.value
watch(
  mv,
  (value, oldValue) => {
    // 过滤掉一些无效的值改变undefined null
    if ((value === undefined || value === null) && oldValue === undefined) {
      return
    }
    props.glComponentInst.value = value
    // logger.debug('watch mv update > ',props.glComponentInst.componentName,value,oldValue)
    // 注意这两个事件的顺序不能调整，先更改modelValue的值，以便于父组件相关的值改变之后，再触发update事件
    emits('update:modelValue', value)
    emits('update', value)
    // 这个需放在 'update:modelValue' 事件之后，确保组件的值已更新
    onValueChange(value)
    // 由于考虑到多层组件嵌套，watch的mv可能是个组合的组件，不是最原子级的组件，这里没有用deep属性
  },
  { immediate: true }
)

const reRenderKey = ref(utils.gid())
const _reRender = (updatedProps?: object) => {
  // logger.debug('_reRender updatedProps',updatedProps)
  // logger.debug('_reRender props.glComponentInst', props.glComponentInst)
  console.log('_reRender() > vars:', vars.value,'instId:',props.glComponentInst?.id)
  reRenderKey.value = utils.gid()
  // refreshFlag.value = false
  // nextTick(() => {
  //   refreshFlag.value = true
  //   // logger.debug('nextTick call back ...')
  // })
  // logger.debug('nextTick end')
}

const hasPermission = () => {
  // 是否需要检查查看权限
  if (props.glComponentInst?.perms?.r) {
    // 检查是否分配了权限
    return props.pagePermission?.hasReadPermission(props.glComponentInst.id)
  }
  return true
}

watch(
  () => {
    return props.glComponentInst.props._hidden
  },
  (value, oldValue) => {
    hidden.value = value || false
  }
)

watch(
  () => {
    return props.glComponentInst.props.unRender
  },
  (value, oldValue) => {
    unRender.value = value || false
  }
)

onMounted(() => {
  // 在此再调用setVueRef，确保pageProvideProxy的onMounted事件在各组件的加载完成之后触发
  pageProvideProxy?.setVueRef(props.glComponentInst.id, getCurrentInstance())
  // 由于在executePropsExpressions中计算更新_hidden属性时，UI没更新，这里记录一下初始值，用于后续比较有变化时，强行更新
  const lastHiddenValue = props.glComponentInst.props._hidden
  const lastUnRenderValue = props.glComponentInst.props.unRender
  // 将脚本执行移到onMounted事件中，确保此时vueRef已存在
  // 此时会带来一个问题，更新的属性可能不会及时更新到UI中，需要用$nextTick()强行刷新，会有一定的性能问题
  executePropsExpressions(props.glComponentInst, {
    pageProxy: pageProvideProxy,
    ...props.glCtx
  })

  // 解决列表组件，操作列中的按钮等组件的_hidden属性没有生效的问题
  // 调用_reRender也无效，未来更新UI,需要在component动态组件页面之后增加其它元素，如<template></template>一起使用才能刷新
  if (lastHiddenValue != props.glComponentInst.props._hidden) {
    hidden.value = props.glComponentInst.props._hidden || false
  }
  if (lastUnRenderValue != props.glComponentInst.props.unRender) {
    unRender.value = props.glComponentInst.props.unRender || false
  }
  // logger.debug('onMounted', props.glComponentInst.props.label, props.glComponentInst.props._hidden)
})

onUnmounted(() => {
  /**
   * 释放资源
   */
  // @ts-ignore
  logger = null
  pageProvideProxy?.removeVueInst(props.glComponentInst.id)
  if (typeof onActionsHandler === 'object') {
    Object.keys(onActionsHandler).forEach((key) => {
      delete onActionsHandler[key]
    })
  }
  // @ts-ignore
  onActionsHandler = null
  if (detachedElementRef.value) {
    detachedElementRef.value = null
  }
})
defineExpose({ onMouseLeave, onMouseOver, _reRender, _setVar, _getVar, _getVars, _getVarsRef })
</script>

<style>
.gl-component {
}
</style>
