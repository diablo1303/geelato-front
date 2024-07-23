import {createRouter, createWebHistory} from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {APP_PAGE_MAIN, NOT_FOUND_ROUTE, REDIRECT_MAIN, RESET_PWD_MAIN} from "@/router/routes/base";
import {appLoginRoutes, appRoutes} from './routes';
import createRouteGuard from './guard';

NProgress.configure({showSpinner: false}); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...appRoutes,
    ...appLoginRoutes([]),
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
    APP_PAGE_MAIN,
    RESET_PWD_MAIN
  ],
  scrollBehavior() {
    return {top: 0};
  },
});

createRouteGuard(router);
console.log(router);

export default router;
