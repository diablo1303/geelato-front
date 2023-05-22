import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const USER: AppRouteRecordRaw = {
  path: '/role',
  name: 'role',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'sercurity.org.index.menu.list',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 7,
  },
  children: [
    {
      path: 'orgList',
      name: 'orgList',
      component: () => import('@/views/security/org/index.vue'),
      meta: {
        locale: 'sercurity.org.index.menu.list.searchTable',
        requiresAuth: true,
      },
    },
    {
      path: 'userList',
      name: 'userList',
      component: () => import('@/views/security/user/index.vue'),
      meta: {
        locale: 'sercurity.user.index.menu.list.searchTable',
        requiresAuth: true,
      },
    },
    {
      path: 'roleList',
      name: 'roleList',
      component: () => import('@/views/security/role/index.vue'),
      meta: {
        locale: 'sercurity.role.index.menu.list.searchTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'permissionList',
      name: 'permissionList',
      component: () => import('@/views/security/permission/index.vue'),
      meta: {
        locale: 'sercurity.permission.index.menu.list.searchTable',
        requiresAuth: true
      },
    },
    {
      path: 'dictList',
      name: 'dictList',
      component: () => import('@/views/security/dict/index.vue'),
      meta: {
        locale: 'sercurity.dict.index.menu.list.searchTable',
        requiresAuth: true
      },
    },
  ],
};

export default USER;
