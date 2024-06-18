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
import {
  mixins,
  PageProvideKey,
  PageProvideProxy,
  type Param,
  utils,
  type PageStatus,
  PageParamsKey
} from '@geelato/gl-ui'
import { inject, nextTick, type PropType, ref } from 'vue'

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
  /**
   *  页面状态默认为none
   */
  pageStatus: {
    type: String as PropType<PageStatus>
  },
  // 引用平台的页面所属的应用Id
  appId: String,
  // 引用平台的页面，页面的extendId
  extendId: String,
  /**
   *  支持转换前PageParamConfigType和转换后的参数类型PageParam
   */
  params: {
    type: Array as PropType<Array<Param>>,
    default() {
      return []
    }
  }
})

const pageProvideProxy: PageProvideProxy = inject(PageProvideKey)!
// 如果props中未指定页面状态，则取当前引用页面所在页面的状态
const _pageStatus = props.pageStatus || pageProvideProxy.pageStatus

const lastInjectParams:Param[] = []
/**
 *  参数合并
 *  RefPage设置的参数props.params优先于外部页面inject的参数
 */
const getParams = () => {
  const allParams = props.params || []
  const copyParams = JSON.parse(JSON.stringify(allParams))
  const injectParams: Array<Param> = inject(PageParamsKey) || []
  // 在调用刷新时，inject(PageParamsKey)不会重新计算，即拿不到inject的参数，这里从lastInjectParams中获取
  if (injectParams.length > 0) {
    lastInjectParams.length = 0
    lastInjectParams.push(...injectParams)
  }else{
    injectParams.push(...lastInjectParams)
  }

  injectParams.forEach((param: Param) => {
    const foundParam = allParams.find((p: Param) => {
      return p.name === param.name
    })
    if (!foundParam) {
      copyParams.push(param)
    }
  })

  console.log('ref-page getParams() > copyParams:', copyParams, props)
  return copyParams
}

let params: Array<Param> = getParams()

const visiblePage = ref(true)
const key = ref(utils.gid('id'))

/**
 *  以最新的页面参数数据重新加载
 */
const refresh = () => {
  params = getParams()
  console.log('ref-page refresh() > params:', params)

  key.value = utils.gid('id')
  // visiblePage.value = false
  // nextTick(() => {
  //   visiblePage.value = true
  // })
}
defineExpose({ refresh })
</script>

<template>
  <div class="gl-ref-page" :key="key">
    <div class="gl-ref-page-drag-handler" v-if="!glIsRuntime">
      <a-button type="primary" title="拖动页面">
        <GlIconfont type="gl-drag" text="这是引用页面"></GlIconfont>
      </a-button>
    </div>
    <template v-if="pageType === 'third'">
      <iframe class="gl-iframe" :src="pageSrc"></iframe>
    </template>
    <template v-else-if="pageType === 'code'"> 平台编码轻应用页面Coming Soon ...</template>
    <template v-else>
      <div v-if="!extendId">
        <a-alert type="error"> 未配置页面</a-alert>
      </div>
      <GlPageViewer
        v-if="extendId"
        :pageProps="{ params }"
        v-bind="props"
        :pageStatus="_pageStatus"
      ></GlPageViewer>
    </template>
  </div>
</template>

<style scoped>
.gl-ref-page-drag-handler {
  position: absolute;
  z-index: 1;
}

.gl-iframe {
  border: 0;
  width: 100%;
  height: 100%;
}
</style>
