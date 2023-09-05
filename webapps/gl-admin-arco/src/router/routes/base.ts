import type {RouteRecordRaw} from 'vue-router';
import {REDIRECT_ROUTE_NAME, URL_PREFIX} from '@/router/constants';

export const DEFAULT_LAYOUT = () => import('@/layout/default-layout.vue');

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
      component: () => import('@/views/redirect/index.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: () => import('@/views/not-found/index.vue'),
};

export const APP_PAGE_MAIN: RouteRecordRaw = {
  path: `${URL_PREFIX}/:tenantCode/:appId/page`,
  name: 'pageWrapper',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    hideInMenu: true,
  },
  children: [
    {
      path: ':pageId',
      name: 'page',
      component: () => import('@/views/page/PageRuntime.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export const RESET_PWD_MAIN: RouteRecordRaw = {
  path: `${URL_PREFIX}/forget`,
  name: `forget`,
  component: () => import('@/views/reset/index.vue'),
  meta: {
    requiresAuth: false,
  },
};

export const EXPORT_LIST_MAIN: RouteRecordRaw = {
  path: '/export/list',
  name: `export`,
  component: () => import('@/views/export/index.vue'),
  meta: {
    requiresAuth: false,
  },
}