import {useRouter} from 'vue-router';
import {Message} from '@arco-design/web-vue';

import {useUserStore} from '@/store';

export default function useUser() {
  const router = useRouter();
  const userStore = useUserStore();
  const logout = async (logoutTo?: string) => {
    await userStore.logout();
    const currentRoute = router.currentRoute.value;
    Message.success('登出成功');
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
