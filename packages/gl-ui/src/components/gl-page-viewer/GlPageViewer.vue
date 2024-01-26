<script lang="ts" setup>
import { computed, type Ref, ref, watch } from 'vue'
import { ComponentInstance } from '@geelato/gl-ui-schema'
import {
  mixins,
  type PageCustomType,
  useGlobal
} from '../../index'
import { entityApi } from '../../m/datasource/EntityApi'

defineOptions({
  name: 'GlPageViewer'
})

const global = useGlobal()
const props = defineProps({
  /**
   *  页面ID
   */
  pageId: {
    type: String
  },
  /**
   *  应用页面树节点ID
   */
  extendId: {
    type: String
  },
  /**
   *  页面状态
   */
  pageStatus: String,
  /**
   *  页面模板组件名称
   *  默认为空
   */
  pageTemplateName: String,
  pageProps: {
    type: Object,
    default() {
      return {}
    }
  },
  ...mixins.props
})

// console.log('useGlobal', useGlobal())
// console.log('GlPageViewer > props.pageProps:', props.pageProps)
// console.log('GlPageViewer > props:', props)
const glComponentInst = ref(new ComponentInstance())
// 用户对于某页面的个性化配置
// @ts-ignore
let myPageCustom: Ref<PageCustomType> = ref({
  id: '',
  pageId: props.pageId,
  cfg: {}
})
const load = () => {
  let loadedPage = undefined
  if (props.pageId) {
    loadedPage = entityApi.queryPageAndCustomById('pageId', props.pageId)
  } else if (props.extendId) {
    loadedPage = entityApi.queryPageAndCustomById('extendId', props.extendId)
  } else {
    global.$notification.error({
      title: '配置缺失',
      content: '未配置pageId或extendId。',
      duration: 6000,
      closable: true
    })
  }
  if (loadedPage) {
    loadedPage.then((resp: any) => {
      if (resp && resp.data) {
        glComponentInst.value = JSON.parse(resp.data.releaseContent)
        if (resp.data.pageCustom) {
          myPageCustom.value = resp.data.pageCustom
        }
      } else {
        // console.error('GlPageViewer > loadedPage > resp?.data:', resp?.data)
        global.$notification.error({
          title: '加载页面失败',
          content: '可能页面不存在，或配置的页面加载参数不对。',
          duration: 6000,
          closable: true
        })
      }
    })
  }
}

watch(
  () => {
    return props.extendId + '' + props.pageId
  },
  () => {
    load()
  },
  { immediate: true }
)
</script>
<template>
  <div class="gl-page-viewer">
    <!-- render gl-page -->
    <GlComponent
      v-if="glComponentInst && glComponentInst.componentName"
      :key="glComponentInst.id"
      :glComponentInst="glComponentInst"
      :glIsRuntime="glIsRuntime"
      :glRuntimeFlag="glRuntimeFlag"
      :pageStatus="pageStatus"
      :pageCustom="myPageCustom"
      :pageTemplateName="pageTemplateName"
      v-bind="pageProps"
      :glIgnoreInjectPageProxy="true"
    />
    <GlPageHelp :pageHelpId="glComponentInst?.props?.pageHelp" />
  </div>
</template>
<style scoped>
.gl-page-viewer {
  height: 100%;
  position: relative;
}

.gl-page-viewer .gl-page-help {
  position: absolute;
  right: 12px;
  top: 8px;
  padding: 8px;
}

.gl-page-viewer .gl-page-help:hover {
  color: #165dff;
  cursor: pointer;
}
</style>
