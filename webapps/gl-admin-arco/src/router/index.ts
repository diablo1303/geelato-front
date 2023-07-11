import {createRouter, createWebHistory} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import {APP_PAGE_MAIN, NOT_FOUND_ROUTE, REDIRECT_MAIN} from "@/router/routes/base";
import {appDataBaseRoutes, appLoginRoutes, appRoutes} from './routes';
import createRouteGuard from './guard';

NProgress.configure({showSpinner: false}); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...appDataBaseRoutes,
    ...appRoutes,
    ...appLoginRoutes([]),
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
