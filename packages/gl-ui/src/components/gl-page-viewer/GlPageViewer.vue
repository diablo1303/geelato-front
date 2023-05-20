<template>
  <div>
    <GlComponent v-if="glComponentInst" :key="glComponentInst.id" :glComponentInst="glComponentInst"
                 :glIsRuntime="true" v-bind="pageProps"></GlComponent>
  </div>
</template>

<script lang="ts">
export default {
  name: "GlPageViewer"
}
</script>
<script lang="ts" setup>
import {entityApi} from "../../m/datasource/EntityApi";
import GlComponent from "../gl-component/GlComponent.vue";
import {ref} from "vue";
import {ComponentInstance} from "@geelato/gl-ui-schema";
import {useGlobal} from "../../index";

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
  pageProps: {
    type: Object,
    default() {
      return {}
    }
  }
})
console.log('GlPageViewer > props.pageProps:', props.pageProps)
const glComponentInst = ref(new ComponentInstance())
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
    if (resp && resp.data && resp.data.data && resp.data.data[0]) {
      glComponentInst.value = JSON.parse(resp.data.data[0].releaseContent)
    } else {
      // console.error('GlPageViewer > loadedPage > resp?.data?.data:', resp?.data?.data)
      global.$notification.error({
        title: '加载页面失败',
        content: '可能页面不存在，或配置的页面加载参数不对。',
        duration: 6000,
        closable: true
      })
    }
  })
}

</script>

<style scoped>
</style>