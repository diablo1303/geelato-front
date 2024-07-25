import type {RouteRecordRaw} from 'vue-router';
import {NOT_FOUND_ROUTE_NAME, REDIRECT_ROUTE_NAME, URL_PREFIX} from '../constants';

/**
 * 默认布局
 * @constructor
 */
export const DEFAULT_LAYOUT = () => import('../../layout/default-layout.vue');
/**
 * 默认页面运行时
 * @constructor
 */
export const DEFAULT_PAGE_RUNTIME = () => import('../../views/page/PageRuntime.vue');
/**
 * 默认登录页面
 * @constructor
 */
// export const DEFAULT_LOGIN_PAGE = () => import('@/views/login/index.vue');

/**
 * 跳转页面
 */
export const REDIRECT_MAIN: RouteRecordRaw = {
  path: '/redirect',
  name: 'redirectWrapper',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    hideInMenu: true,
  },
  children: [
    {
      path: '/redirect/:path',
      name: REDIRECT_ROUTE_NAME,
      component: () => import('../../views/redirect/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};
/**
 * 404页面
 */
export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: NOT_FOUND_ROUTE_NAME,
  component: () => import('../../views/not-found/index.vue'),
};
/**
 * 低代码页面
 */
export const APP_PAGE_MAIN: RouteRecordRaw = {
  path: `${URL_PREFIX.value}/:tenantCode/:appId/page`,
  name: 'pageWrapper',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    hideInMenu: true,
  }
};
/**
 * 重置密码页面
 */
export const RESET_PWD_MAIN: RouteRecordRaw = {
  path: `${URL_PREFIX.value}/forget`,
  name: `forget`,
  component: () => import('../../views/reset/index.vue'),
  meta: {
    requiresAuth: false,
  },
};
/**
 * 导出列表页面
 */
export const EXPORT_LIST_MAIN: RouteRecordRaw = {
  path: `${URL_PREFIX.value}/export/list`,
  name: `export`,
  component: () => import('../../views/export/index.vue'),
  meta: {
    requiresAuth: false,
  },
}