<script lang="ts">
/**
 *  引用页面，包括第三方、平台内部配置的页面
 *  支持iframe引用或直接打开、或链接式打开
 */
export default {
  name: 'GlRefPage'
}
</script>
<script lang="ts" setup>

import {jsScriptExecutor, mixins} from "@geelato/gl-ui";
import {inject} from "vue";
import {PageParamsKey} from "@geelato/gl-ui/src/components/PageProvideProxy";

const emits = defineEmits(['update:modelValue'])
const props = defineProps({
  ...mixins.props,
  // 标题
  label: String,
  // 页面类型，默认为第三方页面
  pageType: {
    type: String,
    default() {
      // lowcode 平台低代码配置页面 | code 平台轻应用编码页面 | third 第三方页面，需配置href属性
      return 'lowcode'
    }
  },
  // 引用的页面地址
  pageSrc: String,
  //
  // 引用平台的页面所属的应用Id
  appId: String,
  // 引用平台的页面，页面的extendId
  extendId: String,
})

const params = inject(PageParamsKey)

const click = () => {

}

</script>

<template>
  <div>
    <div class="gl-ref-page-drag-handler" v-if="!glIsRuntime">
      <a-button type="primary" title="拖动页面">
        <GlIconfont type="gl-drag" text="这是引用页面"></GlIconfont>
      </a-button>
    </div>
    <template v-if="pageType==='third'">
      <iframe :src="pageSrc"></iframe>
    </template>
    <template v-else-if="pageType==='code'">
      平台编码轻应用页面Coming Soon ...
    </template>
    <template v-else>
      <div v-if="!extendId">
        <a-alert type="error">
          未配置页面
        </a-alert>
      </div>
      <GlPageViewer v-if="extendId" :extendId="extendId" :pageProps="{params}"></GlPageViewer>
    </template>
  </div>
</template>

<style scoped>
.gl-ref-page-drag-handler {
  position: absolute;
  z-index: 1;
}
</style>
