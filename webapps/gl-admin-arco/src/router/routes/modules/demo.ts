import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/demo',
  name: 'demo',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '示例',
    icon: 'icon-user',
    requiresAuth: true,
    order: 1,
  },
  children: [
    {
      path: 'demoEntityList',
      name: 'demoEntityList',
      component: () => import('@/views/demo/demo/index.vue'),
      meta: {
        locale: '示例实体列表',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

// export default USER;
