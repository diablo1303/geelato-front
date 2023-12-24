import {useRouter} from 'vue-router';
import {Message} from '@arco-design/web-vue';
import {useUserStore} from '@/store';
import {useI18n} from "vue-i18n";

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
  return {
    logout,
  };
}
