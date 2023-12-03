<script lang="ts" setup>
import {ref, watch} from "vue";
import {ComponentInstance} from "@geelato/gl-ui-schema";
import {mixins, useGlobal} from "../../index";
import {entityApi} from "../../m/datasource/EntityApi";

defineOptions({
  name: "GlPageViewer"
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
  pageProps: {
    type: Object,
    default() {
      return {}
    }
  },
  ...mixins.props
})
// console.log('GlPageViewer > props.pageProps:', props.pageProps)
const glComponentInst = ref(new ComponentInstance())

const load = () => {
  let loadedPage = undefined
  if (props.pageId) {
    loadedPage = entityApi.queryPageById(props.pageId)
  } else if (props.extendId) {
    loadedPage = entityApi.queryPageByExtendId(props.extendId)
  } else {
    global.$notification.error({
      title: '配置缺失', content: '未配置pageId或extendId。', duration: 6000,
      closable: true
    })
  }
  if (loadedPage) {
    loadedPage.then((resp: any) => {
      if (resp && resp.data && resp.data && resp.data[0]) {
        glComponentInst.value = JSON.parse(resp.data[0].releaseContent)
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

watch(() => {
  return props.extendId + '' + props.pageId
}, () => {
  load()
}, {immediate: true})

</script>
<template>
  <div class="gl-page-viewer">
    <GlComponent v-if="glComponentInst&&glComponentInst.componentName" :key="glComponentInst.id"
                 :glComponentInst="glComponentInst"
                 :glIsRuntime="glIsRuntime" :glRuntimeFlag="glRuntimeFlag" :pageStatus="pageStatus" v-bind="pageProps"
                 :glIgnoreInjectPageProxy="true"/>
  </div>
</template>
<style scoped>
.gl-page-viewer{
  height: 100%;
}
</style>