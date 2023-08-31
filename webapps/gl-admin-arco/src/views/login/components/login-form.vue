<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.title') }}</div>
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
        <a-button class="login-form-register-btn" long type="text" v-show="false">
          {{ $t('login.form.register') }}
        </a-button>
      </a-space>
    </a-form>
  </div>

</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue';
import {RouteParamsRaw, useRoute, useRouter} from 'vue-router';
import {Message} from '@arco-design/web-vue';
import {ValidatedError} from '@arco-design/web-vue/es/form/interface';
import {useI18n} from 'vue-i18n';
import {useStorage} from '@vueuse/core';
import {useUserStore} from '@/store';
import useLoading from '@/hooks/loading';
import type {LoginData} from '@/api/user';
import {DEFAULT_ROUTE} from "@/router/constants";
import {appDataBaseRoutes, formatAppModules} from "@/router/routes";

const router = useRouter();
const route = useRoute();
const {t} = useI18n();
const errorMessage = ref('');
const {loading, setLoading} = useLoading();
const userStore = useUserStore();

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

const handleSubmit = async ({errors, values,}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      await userStore.login(values as LoginData);
      // getDataBaseRouters();
      const {redirect, ...othersQuery} = router.currentRoute.value.query;
      if (redirect) {
        router.push({name: redirect as string, params: {...othersQuery} as RouteParamsRaw});
      } else {
        router.push({name: DEFAULT_ROUTE.name, params: DEFAULT_ROUTE.params});
      }
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
  window.open(router.resolve({name: "forget"}).href, "_blank");
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
