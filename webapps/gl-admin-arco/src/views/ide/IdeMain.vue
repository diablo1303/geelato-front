<script lang="ts">
export default {
  name: "IdeMain"
}
</script>
<script setup lang="ts">
import {onMounted, onUnmounted, provide} from "vue";
import {getToken} from "@/utils/auth";
import {getSysConfig} from "@/api/user";
import {EventNames} from "@geelato/gl-ide";
import {emitter, useGlobal} from "@geelato/gl-ui";
import useUser from '@/hooks/user';
import pinia from '../../store';

provide('pinia', pinia)
const global = useGlobal();
const {ideRedirect, ideLogout} = useUser();

const handleLogout = () => {
  ideLogout();
};

onMounted(() => {
  // 未登录重定向
  if (!getToken()) ideRedirect();
  // 注册 登出 事件监听器的函数
  emitter.on(EventNames.GlIdeLogout, handleLogout);
  // 加载配置变量
  const urlParams = new URL(window.location.href).searchParams;
  getSysConfig(global, {tenantCode: urlParams.get("tenantCode") || '', appId: urlParams.get("appId") || ''});
});

onUnmounted(() => {
  emitter.off(EventNames.GlIdeLogout, handleLogout);
})
</script>
<template>
  <GlIdeArco></GlIdeArco>
</template>
<style scoped>

</style>