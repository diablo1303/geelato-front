<template>
  <div class="gl-page" :style="style">
    <Breadcrumb :items="breadcrumb"/>
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

import {getCurrentInstance, onUnmounted, PropType, provide, ref} from "vue";
import {PageParamType, PageProvideProxy, actionScriptExecutor, mixins} from "@geelato/gl-ui";

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
  params: {
    type: Array as PropType<Array<PageParamType>>,
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

const pageProvideProxy = new PageProvideProxy(props.glComponentInst, getCurrentInstance())
pageProvideProxy.pageId = props.pageId
pageProvideProxy.setVueInst(props.glComponentInst.id, getCurrentInstance())
pageProvideProxy.setParams(props.params)
actionScriptExecutor.addPageProxy(props.glComponentInst.id, pageProvideProxy)
// 整个页面组件级注入
provide('pageProvideProxy', pageProvideProxy)
console.log('GlPage > provide > pageProvideProxy:', pageProvideProxy)
onUnmounted(() => {
  actionScriptExecutor.removePageProxy(props.glComponentInst.id)
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
