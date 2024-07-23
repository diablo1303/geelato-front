<script lang="ts">
export default {
  name: "PageRuntime"
}
</script>

<script lang="ts" setup>
import {ref} from "vue";
import {useRoute} from 'vue-router';

const route = useRoute();
const pageId = ref('');
// http://localhost:5173/:tenantCode/:appId/page/:pageId
pageId.value = (route && route.params && route.params.pageId as string) || "";

// http://localhost:8000/page?pageId=xxxxxxxxxxxxxxxxxxx
if (!pageId.value) {
  pageId.value = new URL(window.location.href).searchParams.get("pageId") || "";
}
if (pageId.value) {
  pageId.value = pageId.value.trim();
  pageId.value = (pageId.value === null || pageId.value.toUpperCase() === 'null'.toUpperCase()) ? '' : pageId.value;
}
</script>

<template>
  <div>
    <div v-if="!pageId">
      <a-alert>
        请在url中传入pageId参数，如：【http://localhost:8000/:tenantCode/:appId/page/:pageId】。
      </a-alert>
    </div>
    <GlPageViewer v-if="pageId" :pageId="pageId" :glIsRuntime="true" glRuntimeFlag="Runtime"></GlPageViewer>
  </div>
</template>

<style scoped></style>