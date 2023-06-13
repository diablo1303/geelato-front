<script lang="ts" setup>
import {ref} from "vue";

const pageId = ref('')
// e.g. http://localhost:8000/showcase/preview.html?pageId=xxxxxxxxxxxxxxxxxxx
const url = window.location.href
const qIndex = url.indexOf('?')
if (qIndex !== -1) {
  const params = new URLSearchParams(url.substring(qIndex))
  pageId.value = params.get('pageId') || ''
}

</script>
<script lang="ts">
export default {
  name: "PageRuntime"
}
</script>
<template>
  <div>
    <div v-if="!pageId">
      <a-alert>
        请在url中传入pageId参数，如：http://localhost:8000/showcase/preview.html?pageId=xxxxxxxxxxxxxxxxxxx.
      </a-alert>
    </div>
    <GlPageViewer v-if="pageId" :pageId="pageId"></GlPageViewer>
  </div>
</template>
<style scoped>

</style>