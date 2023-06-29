import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/customer',
  name: 'customer',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '客户信息管理',
    icon: 'icon-user',
    requiresAuth: true,
    order: 1,
  },
  children: [
    {
      path: 'customerList',
      name: 'customerList',
      component: () => import('@/views/crm/customer/index.vue'),
      meta: {
        locale: '客户列表',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

// export default USER;
