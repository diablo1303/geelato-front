<script lang="ts" setup>
import { type Ref, ref, watch } from 'vue'
import { ComponentInstance } from '@geelato/gl-ui-schema'
import {mixins, type PageCustomType, useGlobal, useLogger} from '../../index'
import { entityApi } from '../../m/datasource/EntityApi'
import { PagePermission } from '../PageProvideProxy'

const logger = useLogger('gl-query')

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

logger.debug('useGlobal', useGlobal())
logger.debug('GlPageViewer > props.pageProps:', props.pageProps)
logger.debug('GlPageViewer > props:', props)
const loading = ref(true)
const glComponentInst = ref(new ComponentInstance())
// 用户对于某页面的个性化配置
// @ts-ignore
let myPageCustom: Ref<PageCustomType> = ref({
  id: '',
  pageId: props.pageId,
  cfg: {}
})
let pagePermission: Ref<PagePermission> = ref(new PagePermission())
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
        // 页面自定义配置
        if (resp.data.pageCustom) {
          myPageCustom.value = resp.data.pageCustom
        }
        // 页面的权限控制
        if (resp.data.pagePerms) {
          pagePermission.value.setPermissions(resp.data.pagePerms)
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
      loading.value = false
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
    <div v-if="loading" style="display: flex; justify-content: center; align-items: center;padding-top: 2em">
      <GlLoader></GlLoader>
    </div>
    <!-- 正常情况该组件为： gl-page -->
    <GlComponent
      v-if="!loading && glComponentInst && glComponentInst.componentName"
      :key="glComponentInst.id"
      :glComponentInst="glComponentInst"
      :glIsRuntime="glIsRuntime"
      :glRuntimeFlag="glRuntimeFlag"
      :pageStatus="pageStatus"
      :pageCustom="myPageCustom"
      :pagePermission="pagePermission"
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
