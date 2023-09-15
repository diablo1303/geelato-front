import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const USER: AppRouteRecordRaw = {
  path: '/manage',
  name: 'manage',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'security.org.index.menu.list',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 98,
  },
  children: [
    {
      path: 'orgList',
      name: 'orgList',
      component: () => import('@/views/security/org/index.vue'),
      meta: {
        locale: 'security.org.index.menu.list.searchTable',
        requiresAuth: true,
      },
    },
    {
      path: 'userList',
      name: 'userList',
      component: () => import('@/views/security/user/index.vue'),
      meta: {
        locale: 'security.user.index.menu.list.searchTable',
        requiresAuth: true,
      },
    },
    {
      path: 'roleList',
      name: 'roleList',
      component: () => import('@/views/security/role/index.vue'),
      meta: {
        locale: 'security.role.index.menu.list.searchTable',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'permissionList',
      name: 'permissionList',
      component: () => import('@/views/security/permission/index.vue'),
      meta: {
        locale: 'security.permission.index.menu.list.searchTable',
        requiresAuth: true
      },
    },
    {
      path: 'dictList',
      name: 'dictList',
      component: () => import('@/views/security/dict/index.vue'),
      meta: {
        locale: 'security.dict.index.menu.list.searchTable',
        requiresAuth: true
      },
    },
    {
      path: 'codeList',
      name: 'codeList',
      component: () => import('@/views/security/encoding/index.vue'),
      meta: {
        locale: 'security.encoding.index.menu.list.searchTable',
        requiresAuth: true
      },
    },
    {
      path: 'fileList',
      name: 'fileList',
      component: () => import('@/views/security/file/index.vue'),
      meta: {
        locale: 'security.file.index.menu.list.searchTable',
        requiresAuth: true
      },
    },
    {
      path: 'configList',
      name: 'configList',
      component: () => import('@/views/security/sysconfig/index.vue'),
      meta: {
        locale: 'security.sysConfig.index.menu.list.searchTable',
        requiresAuth: true
      },
    },
  ],
};

export default USER;
