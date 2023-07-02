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

import {type PropType, getCurrentInstance, onMounted, onUnmounted, provide} from "vue";
import {
  type PageParamConfigType,
  type PageType,
  PageProvideProxy,
  jsScriptExecutor,
  mixins,
  PageProvideKey,
} from "@geelato/gl-ui";
import type {Action} from "@geelato/gl-ui-schema";
import {PageParam, PageParamsKey} from "@geelato/gl-ui/src/components/PageProvideProxy";

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
    type: Array as PropType<Array<PageParamConfigType | PageParam>>,
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
  padding: props.pagePadding || '12px'
}

const showSlot = () => {
  console.log('showSlot')
}

// console.log('GlPage > props.params:', props.params, 'id:', props.glComponentInst.id)
const pageProvideProxy = new PageProvideProxy(props.glComponentInst, getCurrentInstance())
pageProvideProxy.pageId = props.pageId
pageProvideProxy.setVueInst(props.glComponentInst.id, getCurrentInstance())
if (pageProvideProxy.isParamNeedConvert(props.params)) {
  // @ts-ignore
  pageProvideProxy.setParams(JSON.parse(pageProvideProxy.paramStringify(props.params)))
} else {
  pageProvideProxy.setParams(props.params)
}
jsScriptExecutor.addPageProxy(props.glComponentInst.id, pageProvideProxy)
// 整个页面组件级注入
provide(PageProvideKey, pageProvideProxy)
provide(PageParamsKey, props.params)
// console.log('GlPage > provide() > pageProvideProxy:', pageProvideProxy)
onUnmounted(() => {
  jsScriptExecutor.removePageProxy(props.glComponentInst.id)
  console.log('GlPage > onUnmounted() > pageInstId:', props.glComponentInst.id)
})

onMounted(() => {
  //  触发页面配置的事件，只限运行时
  if (props.glIsRuntime) {
    props.glComponentInst.actions.forEach((action: Action) => {
      if (action.name === 'onMounted') {
        jsScriptExecutor.doAction(action, {})
      }
    })
  }
})

</script>
<style lang="less">
.gl-page {
  width: 100%;
  //padding: 0 20px 20px 20px;
}

.gl-page-general-card > .arco-card-header {
  border-bottom: 0;
}
</style>
