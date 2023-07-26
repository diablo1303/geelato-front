import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const APPLICATION: AppRouteRecordRaw = {
  path: `/dev`,
  name: 'dev',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.application',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 99,
  },
  children: [{
    path: 'appList',
    name: 'appList',
    component: () => import('@/views/application/index.vue'),
    meta: {
      locale: 'menu.application.app.list',
      requiresAuth: true,
    },
  }, {
    path: 'dataList',
    name: 'dataList',
    component: () => import('@/views/model/index.vue'),
    meta: {
      locale: 'model.dataBase.index.menu.list',
      requiresAuth: true,
    },
  }
  ],
};

export default APPLICATION;