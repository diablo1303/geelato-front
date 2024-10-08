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
import type {LoginData} from "@geelato/gl-ui";
import {authUtil, useGlobal} from "@geelato/gl-ui";
import {
  appDataBaseRoutes,
  DEFAULT_ROUTE,
  formatAppModules,
  IS_DATA_PAGE,
  pageParamsIsFull,
  useLoading,
  useTenantStore,
  useUserStore
} from '@geelato/gl-ui-arco-admin';

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
  if (!(appDataBaseRoutes.value && appDataBaseRoutes.value.length > 0)) {
    const dataBaseRoutes = await formatAppModules([]);
    if (dataBaseRoutes && dataBaseRoutes.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of dataBaseRoutes) {
        router.addRoute(item);
      }
    }
  }
}

const enterApp = async () => {
  if (IS_DATA_PAGE.value) await getDataBaseRouters();// 获取当前用户个人菜单（所有菜单、首页）
  const baseParams = {
    tenantCode: (route && route.params && route.params.tenantCode) as string || '',
    appId: (route && route.params && route.params.appId) as string || ''
  };
  const {redirect, ...othersQuery} = router.currentRoute.value.query;
  if (redirect) {// 重定向
    if (redirect.toString().toLowerCase().startsWith("http")) {// 用于将当前窗口的URL更改为指定的URL
      window.location.assign(redirect as string);
    } else if (router.hasRoute(redirect as string)) {
      window.open(router.resolve({name: redirect as string, params: {...othersQuery} as RouteParamsRaw}).href, "_self");
    } else if (DEFAULT_ROUTE.value.name) {// 不存在路由，指向默认首页
      window.open(router.resolve({name: DEFAULT_ROUTE.value.name, params: DEFAULT_ROUTE.value.params}).href, "_self");
    } else if (IS_DATA_PAGE.value && pageParamsIsFull(baseParams, 1)) {// 不存在路由，page功能
      window.open(router.resolve({name: 'pageWrapper', params: baseParams}).href, "_self");
    } else {
      Message.warning("无法进入页面，请检查路由是否正确！");
    }
  } else {
    Object.assign(DEFAULT_ROUTE.value.params, baseParams);// 个人菜单首页
    if (DEFAULT_ROUTE.value.name) {
      window.open(router.resolve({name: DEFAULT_ROUTE.value.name, params: DEFAULT_ROUTE.value.params}).href, "_self");
    } else if (IS_DATA_PAGE.value && pageParamsIsFull(baseParams, 1)) {
      window.open(router.resolve({name: 'pageWrapper', params: baseParams}).href, "_self");
    } else {
      Message.warning("无法进入页面，请检查路由是否正确！");
    }
  }
}
onMounted(() => {
  if (authUtil.getToken()) enterApp();
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
