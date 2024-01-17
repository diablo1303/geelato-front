<template>
  <div class="gl-page" v-if="visiblePage" :style="style" :key="key">
    <template v-if="glIsRuntime">
      <template v-if="pageTemplateName">
        <!-- render gl-page-template -->
        <component :is="pageTemplateName">
          <slot></slot>
        </component>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </template>
    <template v-else>
      <template v-if="pageTemplateName">
        <!-- render gl-page-template -->
        <component :is="pageTemplateName">
          <component :is="'GlInsts'" :glComponentInst="glComponentInst"></component>
        </component>
      </template>
      <template v-else>
        <component :is="'GlInsts'" :glComponentInst="glComponentInst"></component>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlPage'
}
</script>
<script lang="ts" setup>
import { type PropType, getCurrentInstance, onUnmounted, provide, ref, nextTick } from 'vue'
import {
  type PageType,
  PageProvideProxy,
  jsScriptExecutor,
  mixins,
  PageProvideKey,
  type Param,
  utils
} from '@geelato/gl-ui'
import type { Action } from '@geelato/gl-ui-schema'
import { PageParamsKey } from '@geelato/gl-ui'

const proxy = getCurrentInstance()?.proxy
const props = defineProps({
  breadcrumb: {
    type: Array,
    default() {
      return []
    }
  },
  /**
   *  数据库中的页面字段id
   *  注：不是前端的组件id
   */
  pageId: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  页面类型
   */
  pageType: {
    type: String as PropType<PageType>
  },
  pageTitle: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  页面状态默认为read
   *  注意在给页面添加类似pageStatus的属性时，为了确保打开页面时有传该值进来，需处理如下：
   *  1、需在JsScriptExecutor中增加相应信息，如loadPage时需传参数
   *  2、在脚本生成的blockHandler中传入相应的信息
   */
  pageStatus: {
    type: String,
    default() {
      return 'read'
    }
  },
  /**
   *  页面模板组件名称
   *  默认为空
   */
  pageTemplateName: String,
  pageMargin: {
    type: String,
    default() {
      return ''
    }
  },
  pagePadding: {
    type: String,
    default() {
      return ''
    }
  },
  /**
   *  支持转换前PageParamConfigType和转换后的参数类型PageParam
   */
  params: {
    type: Array as PropType<Array<Param>>,
    default() {
      return []
    }
  },
  /**
   *  自定义JS编码
   */
  script: {
    type: String,
    default() {
      return ''
    }
  },
  ...mixins.props
})

const visiblePage = ref(true)
const key = ref(utils.gid())

const style = {
  margin: props.pageMargin || '12px',
  padding: props.pagePadding || '0'
}

console.log('GlPage > props:', props)
const pageProvideProxy = new PageProvideProxy(props.glComponentInst, getCurrentInstance()!)
pageProvideProxy.pageId = props.pageId
pageProvideProxy.setVueRef(props.glComponentInst.id, getCurrentInstance())
pageProvideProxy.setPageStatus(props.pageStatus)
pageProvideProxy.setParams(props.params)
const onPageMounted = () => {
  //  触发页面配置的事件，只限运行时
  if (props.glIsRuntime) {
    props.glComponentInst.actions.forEach((action: Action) => {
      // console.log('onPageMounted() > action:', action)
      if (action.eventName === 'onMounted') {
        jsScriptExecutor.doAction(action, {
          pageProxy: pageProvideProxy
        })
      }
    })
  }
}
pageProvideProxy.addPageMountedEvent(onPageMounted)

jsScriptExecutor.addPageProxy(props.glComponentInst.id, pageProvideProxy)
// 在打开页面时，依据页面参数表达式，先进行运行，计算出值
// !!! 注意这里放在jsScriptExecutor.addPageProxy后面执行，是为了确保在计算参数时，可以用到当前页面proxy的相关内容
if (props.params && props.params.length > 0) {
  for (const index in props.params) {
    const param: Param = props.params[index]
    if (param.valueExpression) {
      if (typeof param.valueExpression === 'string') {
        param.value = jsScriptExecutor.evalExpression(param.valueExpression, {
          pageProxy: pageProvideProxy
        })
      } else {
        // 不需要解析
        param.value = param.valueExpression
      }
    }
  }
}
// console.log('GlPage > create() > pageInstId:', props.glComponentInst.id)
//
// onMounted(() => {
//   console.log('GlPage > onMounted() > pageInstId:', props.glComponentInst.id)
// })
// 整个页面组件级注入
provide(PageProvideKey, pageProvideProxy)
provide(PageParamsKey, props.params)
// console.log('GlPage > provide() > pageProvideProxy:', pageProvideProxy)
onUnmounted(() => {
  jsScriptExecutor.removePageProxy(props.glComponentInst.id)
  // console.log('GlPage > onUnmounted() > pageInstId:', props.glComponentInst.id)
})

/**
 *  以当前页面参数数据重新加载
 */
const refresh = () => {
  // console.log('page[' + props.glComponentInst.id + '] refresh.')
  key.value = utils.gid()
  visiblePage.value = false
  nextTick(() => {
    visiblePage.value = true
  })
}

defineExpose({ refresh })
</script>
<style lang="less">
.gl-page {
}

.gl-page-general-card > .arco-card-header {
  border-bottom: 0;
}
</style>
