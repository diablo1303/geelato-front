<script lang="ts">
export default {
  name: 'IdeMain',
};
</script>
<script lang="ts" setup>
import {onMounted, onUnmounted, provide, ref} from 'vue';
import {EventNames} from "@geelato/gl-ide";
import {emitter, authUtil} from "@geelato/gl-ui";
import {useUser, getPinia} from '@geelato/gl-ui-arco-admin';
import {handleUrlParams, validateIde, validateIdeUrl} from './utils';

provide('pinia', getPinia());
const {ideRedirect, ideLogout} = useUser();
// 获取url参数
const urlParams = ref<Record<string, string>>({});
// 页面显示状态, 0:错误，1：正常，2：待校验
const showPage = ref<Record<string, any>>({valid: 2, message: ''});

const handleLogout = () => {
  ideLogout();
};

onMounted(async () => {
  // 未登录重定向
  if (!authUtil.getToken()) ideRedirect();
  // 注册 登出 事件监听器的函数
  emitter.on(EventNames.GlIdeLogout, handleLogout);
  // 获取url参数
  urlParams.value = handleUrlParams();
  // 校验url参数
  showPage.value = validateIdeUrl(urlParams.value, 'ide');
  if (showPage.value.valid !== 1) return;
  // 数据校验
  const {valid, message} = await validateIde(urlParams.value);
  showPage.value = {valid, message};
  if (valid !== 1) return;
  // 更新标题
  document.title = `应用设计 | ${urlParams.value.appName}`;
});

onUnmounted(() => {
  emitter.off(EventNames.GlIdeLogout, handleLogout);
});
</script>
<template>
  <div v-if="showPage.valid===0">
    <a-alert>{{ showPage.message }}</a-alert>
  </div>
  <GlIdeArco v-else-if="showPage.valid===1"/>
</template>
<style scoped></style>