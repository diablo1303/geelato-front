<script lang="ts">
export default {
  name: "IdeMain"
}
</script>
<script setup lang="ts">
import {onMounted, provide} from "vue";
import {getToken} from "@/utils/auth";
import {getSysConfig} from "@/api/user";
import {useGlobal} from "@geelato/gl-ui";
import pinia from '../../store';

provide('pinia', pinia)
const global = useGlobal();

onMounted(() => {
  const urlParams = new URL(window.location.href).searchParams;
  if (!getToken()) {
    const tenantCode = urlParams.get("tenantCode") || "";
    const appId = urlParams.get("appId") || "";
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.assign(`${window.location.origin}/${tenantCode}/${appId}/login?redirect=${currentUrl}`);
  }
  getSysConfig(global, {tenantCode: urlParams.get("tenantCode") || '', appId: urlParams.get("appId") || ''});
});
</script>
<template>
  <GlIdeArco></GlIdeArco>
</template>
<style scoped>

</style>