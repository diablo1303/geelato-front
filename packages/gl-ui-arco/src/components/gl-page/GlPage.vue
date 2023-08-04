<template>
  <div class="gl-page" :style="style">
    <!--    <ABreadcrumb :items="breadcrumb"/>-->
    <template v-if="glIsRuntime">
      <slot></slot>
    </template>
    <template v-else>
      <GlInsts :glComponentInst="glComponentInst"></GlInsts>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlPage'
}
</script>
<script lang="ts" setup>
import {type PropType, getCurrentInstance, onUnmounted, provide, onMounted} from "vue";
import {
  type PageType,
  PageProvideProxy,
  jsScriptExecutor,
  mixins,
  PageProvideKey, type Param, utils,
} from "@geelato/gl-ui";
import type {Action} from "@geelato/gl-ui-schema";
import {PageParamsKey} from "@geelato/gl-ui";

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

const style = {
  margin: props.pageMargin || '12px',
  padding: props.pagePadding || '0'
}

// console.log('GlPage > props.params:', props.params, 'id:', props.glComponentInst.id)
const pageProvideProxy = new PageProvideProxy(props.glComponentInst, getCurrentInstance()!)
pageProvideProxy.pageId = props.pageId
pageProvideProxy.setVueInst(props.glComponentInst.id, getCurrentInstance())
pageProvideProxy.setParams(props.params)
const onPageMounted = () => {
  //  触发页面配置的事件，只限运行时
  if (props.glIsRuntime) {
    props.glComponentInst.actions.forEach((action: Action) => {
      if (action.name === 'onMounted') {
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
      param.value = jsScriptExecutor.evalExpression(param.valueExpression, {pageProxy: pageProvideProxy})
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

</script>
<style lang="less">
.gl-page {
  //width: 100%;
  //padding: 0 20px 20px 20px;
}

.gl-page-general-card > .arco-card-header {
  border-bottom: 0;
}
</style>
