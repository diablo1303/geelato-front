<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title1') }}</div>
    <div class="login-form-sub-title">{{ tenantData.welcome }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
        ref="loginForm"
        :model="userInfo"
        class="login-form"
        layout="vertical"
        @submit="handleSubmit"
    >
      <a-form-item
          :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          field="username"
          hide-label
      >
        <a-input
            v-model="userInfo.username"
            :placeholder="$t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-user/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
          :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
          :validate-trigger="['change', 'blur']"
          field="password"
          hide-label
      >
        <a-input-password
            v-model="userInfo.password"
            :placeholder="$t('login.form.password.placeholder')"
            allow-clear
        >
          <template #prefix>
            <icon-lock/>
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
              :model-value="loginConfig.rememberPassword"
              checked="rememberPassword"
              @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <a-link @click="forgetPassword($event)">{{ $t('login.form.forgetPassword') }}</a-link>
        </div>
        <a-button :loading="loading" html-type="submit" long type="primary">
          {{ $t('login.form.login') }}
        </a-button>
        <a-button v-show="false" class="login-form-register-btn" long type="text">
          {{ $t('login.form.register') }}
        </a-button>
      </a-space>
    </a-form>
  </div>

</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue';
import {RouteParamsRaw, useRoute, useRouter} from 'vue-router';
import {Message, ValidatedError} from '@arco-design/web-vue';
import {useI18n} from 'vue-i18n';
import {useStorage} from '@vueuse/core';
import {useTenantStore, useUserStore} from '@/store';
import useLoading from '@/hooks/loading';
import type {LoginData} from '@/api/user';
import {getSysConfig} from "@/api/user";
import {DEFAULT_ROUTE} from "@/router/constants";
import {appDataBaseRoutes, formatAppModules, IS_ACCOUNT, pageBaseRoute, pageParamsIsFull} from "@/router/routes";
import {getToken} from "@/utils/auth";
import {queryAppsByUser} from "@/api/application";
import {useGlobal} from "@geelato/gl-ui";

const router = useRouter();
const route = useRoute();
const {t} = useI18n();
const errorMessage = ref('');
const {loading, setLoading} = useLoading();
const userStore = useUserStore();
const global = useGlobal();
const tenantStore = useTenantStore();
const tenantData = computed(() => {
  return {welcome: tenantStore.welcome};
});

const loginConfig = useStorage('login-config', {
  rememberPassword: false,
  username: '', // 演示默认值
  password: '', // demo default value
});
const userInfo = reactive({
  username: loginConfig.value.username,
  password: loginConfig.value.password,
});
const getDataBaseRouters = async () => {
  if (!(appDataBaseRoutes && appDataBaseRoutes.length > 0)) {
    const dataBaseRoutes = await formatAppModules([]);
    if (dataBaseRoutes && dataBaseRoutes.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of dataBaseRoutes) {
        router.addRoute(item);
      }
    }
  }
}

/**
 *
 */
const enterApp = async () => {
  // http://localhost:5173/:tenantCode/:appId/login
  if (route && route.params && route.params.tenantCode && route.params.appId) {// 路径完整
    await getDataBaseRouters();// 获取当前用户个人菜单（所有菜单、首页）
    const baseParams = {tenantCode: route.params.tenantCode, appId: route.params.appId};
    // ?redirect=3821943302748938008&tenantCode=geelato&appId=1976169388038462609&pageId=3821943418964713243
    const {redirect, ...othersQuery} = router.currentRoute.value.query;
    // 填充，tenantCode、appId
    Object.assign(othersQuery, baseParams);// 重定向
    Object.assign(DEFAULT_ROUTE.params, baseParams);// 个人菜单首页
    if (redirect) {// 重定向
      if (redirect.toString().toLowerCase().startsWith("http")) {// 用于将当前窗口的URL更改为指定的URL
        window.location.assign(redirect as string);
      } else if (router.hasRoute(redirect as string) && pageParamsIsFull(othersQuery)) {// 存在路由，且参数完整
        window.open(router.resolve({name: redirect as string, params: {...othersQuery} as RouteParamsRaw}).href, "_self");
      } else {// page功能页面
        pageBaseRoute(router, baseParams);
      }
    } else {// page功能页面
      pageBaseRoute(router, baseParams);
    }
  } else if (IS_ACCOUNT.value) {
    const {redirect, ...othersQuery} = router.currentRoute.value.query;
    if (router.hasRoute(redirect as string)) {
      window.open(router.resolve({name: redirect as string, params: {...othersQuery} as RouteParamsRaw}).href, "_self");
    }
  } else {
    // http://localhost:5173/login => http://localhost:5173/:tenantCode/:appId/page
    const {tenantCode} = userStore;
    if (tenantCode) {
      const {data} = await queryAppsByUser(userStore.tenantCode || '', userStore.id);
      if (data && data.length > 0) {
        const appIds = [...new Set(data.map((item) => item.id).filter((id) => !!id))];
        console.log(appIds);
        pageBaseRoute(router, {'tenantCode': tenantCode, 'appId': appIds[0]});
      } else {
        Message.warning('租户下当前用户没有应用权限，请先添加！');
      }
    } else {
      Message.warning('当前用户缺失租户编码，请联系管理员！');
    }
  }
}
onMounted(() => {
  getSysConfig(global, userStore, {
    tenantCode: (route && route.params && route.params.tenantCode) as string || (userStore && userStore.tenantCode) || '',
    appId: (route && route.params && route.params.appId) as string || ''
  });
  if (getToken()) enterApp();
});

const handleSubmit = async ({errors, values,}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      await userStore.login(values as LoginData);
      await userStore.info();
      await enterApp();
      Message.success(t('login.form.login.success'));
      const {rememberPassword} = loginConfig.value;
      const {username, password} = values;
      // 实际生产环境需要进行加密存储。
      // The actual production environment requires encrypted storage.
      loginConfig.value.username = rememberPassword ? username : '';
      loginConfig.value.password = rememberPassword ? password : '';
    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {
      setLoading(false);
    }
  }
};
const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};
const forgetPassword = (ev?: MouseEvent) => {
  const currentUrl = encodeURIComponent(window.location.href);
  window.open(`${window.location.origin}/forget?redirect=${currentUrl}`, "_blank");
}
</script>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 320px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}
</style>
