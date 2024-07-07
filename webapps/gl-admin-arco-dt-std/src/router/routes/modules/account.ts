import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const ACCOUNT: AppRouteRecordRaw = {
  path: `/account`,
  name: 'account',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.account',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 100,
  },
  children: [{
    path: 'user',
    name: 'userAccount',
    component: () => import('@/views/account/user/index.vue'),
    meta: {
      locale: 'menu.account.user',
      requiresAuth: true,
    },
  }, {
    path: 'manage',
    name: 'manageAccount',
    component: () => import('@/views/account/manage/index.vue'),
    meta: {
      locale: 'menu.account.manage',
      requiresAuth: true,
    },
  }
  ],
};

export default ACCOUNT;