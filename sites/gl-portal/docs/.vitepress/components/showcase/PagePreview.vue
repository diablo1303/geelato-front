<script lang="ts">
export default {
  name: "PagePreview"
}
</script>
<script setup lang="ts">
import {ref} from "vue";

const pageId = ref('')

const url = window.location.href
let paramInfo = url.split('?')[1]
let params = new URLSearchParams('?'+paramInfo)
pageId.value = params.get('pageId') || ''
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