import {createRouter, createWebHistory} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import {analyzeCurrentPath, appLoginRoutes, DEFAULT_ROUTE, URL_PREFIX} from "@geelato/gl-ui-arco-admin";

NProgress.configure({showSpinner: false}); // NProgress Configuration

const modules = import.meta.glob('./routes/modules/*.ts', {eager: true});
const externalModules = import.meta.glob('./routes/externalModules/*.ts', {eager: true});

URL_PREFIX.value = import.meta.env.VITE_WEB_PREFIX_URL;
// 默认路由
DEFAULT_ROUTE.value = {title: 'model.dataBase.index.menu.list', name: 'appList', fullPath: `/dev/appList`, params: {}};
// 解析地址
analyzeCurrentPath(modules);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...appLoginRoutes([], () => import('@/views/login/index.vue'))
  ],
  scrollBehavior() {
    return {top: 0};
  },
});

export {modules, externalModules, router}