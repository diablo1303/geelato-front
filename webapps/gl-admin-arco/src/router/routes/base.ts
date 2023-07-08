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
  path: `${URL_PREFIX}/page`,
  name: 'pageWrapper',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
    hideInMenu: true,
  },
  children: [
    {
      path: 'preview/:tenantCode/:appId/:pageId',
      name: 'page',
      component: () => import('@/views/page/PageRuntime.vue'),
      meta: {
        requiresAuth: true,
        hideInMenu: true,
      },
    },
  ],
};

export const BASE_LOGO = (result: any[]) => {
  // 基础版
  result.push({path: '/', redirect: `${URL_PREFIX}/login`})
  if (URL_PREFIX) {
    const ta = URL_PREFIX.split('');
    const positions = new Set();
    for (let i = 0; i < ta.length; i += 1) {
      if (ta[i] === '/') {
        const position = URL_PREFIX.substring(0, i);
        if (position) positions.add(position);
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const position of positions) {
      result.push({path: position, redirect: `${URL_PREFIX}/login`})
    }
    // 前缀完全版
    result.push({path: `${URL_PREFIX}`, redirect: `${URL_PREFIX}/login`})
  }
  return result;
}