import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/role',
  name: 'role',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '系统管理',
    icon: 'icon-user',
    requiresAuth: true,
    order: 7,
  },
  children: [
    {
      path: 'roleList',
      name: 'roleList',
      component: () => import('@/views/security/role/index.vue'),
      meta: {
        locale: '角色列表',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default USER;
