import {createRouter, createWebHistory} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import {APP_PAGE_MAIN, BASE_LOGO, NOT_FOUND_ROUTE, REDIRECT_MAIN} from "@/router/routes/base";
import {URL_PREFIX} from "@/router/constants";
import {appRoutes} from './routes';
import createRouteGuard from './guard';

NProgress.configure({showSpinner: false}); // NProgress Configuration


const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...BASE_LOGO([{
      path: `${URL_PREFIX}/login`,
      name: `login`,
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    }]),
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
    APP_PAGE_MAIN
  ],
  scrollBehavior() {
    return {top: 0};
  },
});

createRouteGuard(router);
console.log(router);

export default router;
