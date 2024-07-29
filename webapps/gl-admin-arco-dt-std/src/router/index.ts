import {createRouter, createWebHistory} from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

NProgress.configure({showSpinner: false}); // NProgress Configuration

// 内部路由
const modules = import.meta.glob('./routes/modules/*.ts', {eager: true});
// 外部链接路由
const externalModules = import.meta.glob('./routes/externalModules/*.ts', {eager: true});

// 路由前缀, 默认值: ''，如果需要设置路由前缀，请在.env.development 中设置 VITE_WEB_PREFIX_URL
const prefixUrl = import.meta.env.VITE_WEB_PREFIX_URL;
// 默认路由，格式是 {title: 'model.dataBase.index.menu.list', name: 'appList', fullPath: `/dev/appList`, params: {}};
const defaultRoute = {title: 'model.dataBase.index.menu.list', name: 'appList', fullPath: '/dev/appList', params: {}};
// 登录路由页面
const loginComponent = () => import('@/views/login/index.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [],
  scrollBehavior() {
    return {top: 0};
  },
});

export {modules, externalModules, prefixUrl, defaultRoute, loginComponent, router}