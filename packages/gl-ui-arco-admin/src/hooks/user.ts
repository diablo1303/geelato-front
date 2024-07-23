import {useRouter} from 'vue-router';
import {useI18n} from "vue-i18n";
import {Message} from '@arco-design/web-vue';
import {useUserStore} from '../store';

export default function useUser() {
  const router = useRouter();
  const i18 = useI18n();
  const userStore = useUserStore();

  const logout = async (logoutTo?: string) => {
    await userStore.logout();
    const currentRoute = router.currentRoute.value;
    Message.success(i18.t('user.logout'));
    router.push({
      name: logoutTo && typeof logoutTo === 'string' ? logoutTo : 'login',
      params: currentRoute.params,
      query: {redirect: currentRoute.name as string, ...router.currentRoute.value.params},
    });
  };

  const ideRedirect = () => {
    const urlParams = new URL(window.location.href).searchParams;
    const tenantCode = urlParams.get("tenantCode") || "";
    const appId = urlParams.get("appId") || "";
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.assign(`${window.location.origin}/${tenantCode}/${appId}/login?redirect=${currentUrl}`);
  }

  const ideLogout = async (logoutTo?: string) => {
    await userStore.logout();
    Message.success(i18.t('user.logout'));
    ideRedirect();
  };

  return {
    logout, ideRedirect, ideLogout
  };
}
