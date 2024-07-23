<script lang="ts">
export default {
  name: "GlMain"
}
</script>
<script lang="ts" setup>
import {onMounted, provide} from "vue";
import {authUtil, userApi} from "@geelato/gl-ui";
import pinia from '../../store';

provide('pinia', pinia)

const menuItems = []
onMounted(async () => {
  if (!authUtil.getToken()) {
    const urlParams = new URL(window.location.href).searchParams;
    const tenantCode = urlParams.get("tenantCode") || "";
    const appId = urlParams.get("appId") || "";
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.assign(`${window.location.origin}/${tenantCode}/${appId}/login?redirect=${currentUrl}`);
  } else {
    // 加载菜单
    const {data} = await userApi.getMenuList();
    console.log('menu', data)
  }
});
</script>
<template>
  <gl-layout-site></gl-layout-site>
</template>
<style scoped>

</style>