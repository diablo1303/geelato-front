<script lang="ts">
export default {
  name: 'IdeMain',
};
</script>
<script lang="ts" setup>
import {onMounted, onUnmounted, provide} from 'vue';
import {EventNames} from "@geelato/gl-ide";
import {emitter, useGlobal, authUtil, userApi} from "@geelato/gl-ui";
import {useUser, useUserStore, getPinia} from '@geelato/gl-ui-arco-admin';

provide('pinia', getPinia());
const userStore = useUserStore();
const global = useGlobal();
const {ideRedirect, ideLogout} = useUser();

const handleLogout = () => {
  ideLogout();
};

onMounted(() => {
  // 未登录重定向
  if (!authUtil.getToken()) ideRedirect();
  // 注册 登出 事件监听器的函数
  emitter.on(EventNames.GlIdeLogout, handleLogout);
  // 加载配置变量
  const urlParams = new URL(window.location.href).searchParams;
  userStore.info(() => {
    userApi.getSysConfig(global, userStore, {
      appId: urlParams.get('appId') || '', tenantCode: urlParams.get('tenantCode') || '',
    });
  });
  //
  const appName = urlParams.get('appName') || ''
  document.title = `Geelato IDE ${appName}`;
});

onUnmounted(() => {
  emitter.off(EventNames.GlIdeLogout, handleLogout);
});
</script>
<template>
  <GlIdeArco></GlIdeArco>
</template>
<style scoped></style>
