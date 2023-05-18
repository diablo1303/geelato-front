import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

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
    {
      path: 'permissionList',
      name: 'permissionList',
      component: () => import('@/views/security/permission/index.vue'),
      meta: {
        locale: '权限管理',
        requiresAuth: true
      },
    },
    {
      path: 'dictList',
      name: 'dictList',
      component: () => import('@/views/security/dict/index.vue'),
      meta: {
        locale: '字典管理',
        requiresAuth: true
      },
    },
  ],
};

export default USER;
