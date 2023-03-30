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
      path: 'orgList',
      name: 'orgList',
      component: () => import('@/views/security/org/index.vue'),
      meta: {
        locale: '部门管理',
        requiresAuth: true,
      },
    },
    {
      path: 'userList',
      name: 'userList',
      component: () => import('@/views/security/user/index.vue'),
      meta: {
        locale: '用户管理',
        requiresAuth: true,
      },
    },
    {
      path: 'roleList',
      name: 'roleList',
      component: () => import('@/views/security/role/index.vue'),
      meta: {
        locale: '角色管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default USER;
