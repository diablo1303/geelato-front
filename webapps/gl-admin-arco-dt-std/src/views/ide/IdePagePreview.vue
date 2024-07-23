<script lang="ts">
export default {
  name: "IdePagePreview"
}
</script>
<script setup lang="ts">
import {onMounted, onUnmounted, provide, ref} from "vue";
import {EventNames} from "@geelato/gl-ide";
import {emitter, useGlobal, authUtil, userApi} from "@geelato/gl-ui";
import {useUser, useUserStore} from '@geelato/gl-ui-arco-admin';
import pinia from '../../store';

const pageId = ref('')

pageId.value = new URL(window.location.href).searchParams.get("pageId") || "";

provide('pinia', pinia)
const userStore = useUserStore();
const global = useGlobal();
const {ideRedirect, ideLogout} = useUser();

const handleLogout = () => {
  ideLogout();
};

const showPage = ref(false)

onMounted(() => {
  // 未登录重定向
  if (!authUtil.getToken()) ideRedirect();
  // 注册 登出 事件监听器的函数
  emitter.on(EventNames.GlIdeLogout, handleLogout);
  // 加载配置变量
  const urlParams = new URL(window.location.href).searchParams;
  userStore.info(() => {
    userApi.getSysConfig(global, userStore, {
      appId: urlParams.get("appId") || '', tenantCode: urlParams.get("tenantCode") || '',
    });
  });
  showPage.value = true

  console.log('useGlobal()', useGlobal())
});

onUnmounted(() => {
  emitter.off(EventNames.GlIdeLogout, handleLogout);
})

</script>
<template>
  <div>
    <div v-if="!pageId">
      <a-alert>
        请在url中传入pageId参数，如：http://localhost:8000/idePagePreview.html?pageId=xxxxxxxxxxxxxxxxxxx.
      </a-alert>
    </div>
    <GlPageViewer v-if="pageId&&showPage" :pageId="pageId"></GlPageViewer>
  </div>
</template>
<style scoped>

</style>