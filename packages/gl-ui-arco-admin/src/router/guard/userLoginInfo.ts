import type {LocationQueryRaw, Router} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import {authUtil} from '@geelato/gl-ui';
import {useUserStore} from '../../store';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (authUtil.isLogin()) {
      if (userStore.role) {
        next();
      } else {
        try {
          await userStore.info();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            params: to.params,
            query: {
              redirect: to.name,
              ...to.query,
              ...to.params
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      if (['login', 'forget'].includes(to.name as string)) {
        next();
        return;
      }
      next({
        name: 'login',
        params: to.params,
        query: {
          redirect: to.name,
          ...to.query,
          ...to.params
        } as LocationQueryRaw,
      });
    }
  });
}
