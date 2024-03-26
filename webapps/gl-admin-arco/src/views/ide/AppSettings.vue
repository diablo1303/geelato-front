<script lang="ts">
  export default {
    name: 'AppSettings',
  };
</script>
<script setup lang="ts">
  import { onMounted, onUnmounted, provide, ref } from 'vue';
  import { getToken } from '@/utils/auth';
  import { getSysConfig } from '@/api/user';
  import { EventNames } from '@geelato/gl-ide';
  import { emitter, useGlobal } from '@geelato/gl-ui';
  import useUser from '@/hooks/user';
  import pinia, { useUserStore } from '../../store';

  const appId = ref('');
  const appName = ref('');

  appId.value = new URL(window.location.href).searchParams.get('appId') || '';
  appName.value =
    new URL(window.location.href).searchParams.get('appName') || '';

  provide('pinia', pinia);
  const userStore = useUserStore();
  const global = useGlobal();
  const { ideRedirect, ideLogout } = useUser();

  const handleLogout = () => {
    ideLogout();
  };

  const showPage = ref(false);

  onMounted(() => {
    // 未登录重定向
    if (!getToken()) ideRedirect();
    // 注册 登出 事件监听器的函数
    emitter.on(EventNames.GlIdeLogout, handleLogout);
    // 加载配置变量
    const urlParams = new URL(window.location.href).searchParams;
    userStore.info(() => {
      getSysConfig(global, userStore && userStore.userInfo, {
        tenantCode: urlParams.get('tenantCode') || '',
        appId: urlParams.get('appId') || '',
      });
    });
    showPage.value = true;
  });

  onUnmounted(() => {
    emitter.off(EventNames.GlIdeLogout, handleLogout);
  });
</script>
<template>
  <div class="gl-app-settings">
    <div v-if="!appId">
      <a-alert>
        请在url中传入appId参数，如：https://域名:端口/appSettings.html?appId=xxxxxxxxxxxxxxxxxxx.
      </a-alert>
    </div>
    <div v-else>
      <div :style="{ padding: '4px 14px' }" class="gl-page-header">
      <a-page-header
        title="应用设置"
        :subtitle="appName"
        :show-back="false"
      >
        <template #extra>
          <!--            <a-radio-group type="button" default-value="large">-->
          <!--              <a-radio value="mini">Mini</a-radio>-->
          <!--              <a-radio value="small">Small</a-radio>-->
          <!--              <a-radio value="large">Large</a-radio>-->
          <!--            </a-radio-group>-->
        </template>
      </a-page-header>
      </div>
      <div :style="{ padding: '14px' }">
        <a-card>
          <a-tabs direction="vertical">
            <a-tab-pane key="1">
              <template #title>
                <icon-calendar />
                基本信息
              </template>
              这里可以修改应用基本信息
            </a-tab-pane>
            <a-tab-pane key="2">
              <template #title>
                <icon-clock-circle />
                应用字典
              </template>
              Content of Tab Panel 2
            </a-tab-pane>
            <a-tab-pane key="3">
              <template #title>
                <icon-user />
                应用角色
              </template>
              Content of Tab Panel 3
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </div>
    </div>
  </div>
</template>
<style>
  .gl-app-settings .gl-page-header {
    //border-bottom: 1px #04559f solid;
    background-image: url('@/assets/images/bg/page-header-bg-layered-peaks.png');
    background-size: cover;
  }
  .gl-app-settings .arco-page-header-title{
    color: white;
  }
  .gl-app-settings .arco-page-header-subtitle{
    color: white;
    font-size: 16px;
  }
</style>
