<template>
  <div>
    <GlComponent :glComponentInst="glComponentInst"></GlComponent>
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

const props = defineProps({
  pageId: {
    type: String,
    required: true
  },
  pageProps: {
    type: Object
  }
})
const glComponentInst = ref(new ComponentInstance())
const loadedPage = entityApi.queryPageById(props.pageId)
loadedPage.then((resp: any) => {
  console.log('loadedPage', resp?.data?.data)
  glComponentInst.value = JSON.parse(resp.data.data[0].releaseContent)
})
</script>

<style scoped>

</style>