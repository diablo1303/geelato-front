<script lang="ts">
export default {
  name: "IdeMain"
}
</script>
<script setup lang="ts">
import {onMounted, provide} from "vue";
import {getToken} from "@/utils/auth";
import pinia from '../../store';
import {} from "vue/dist/vue";

provide('pinia', pinia)

onMounted(() => {
  if (!getToken()) {
    const urlParams = new URL(window.location.href).searchParams;
    const tenantCode = urlParams.get("tenantCode") || "";
    const appId = urlParams.get("appId") || "";
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.assign(`${window.location.origin}/${tenantCode}/${appId}/login?redirect=${currentUrl}`);
  }
});
</script>
<template>
  <GlIdeArco></GlIdeArco>
</template>
<style scoped>

</style>