import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const MODEL: AppRouteRecordRaw = {
  path: '/model',
  name: 'model',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'model.connect.index.menu.list',
    icon: 'icon-settings',
    requiresAuth: true,
    order: 7,
  },
  children: [{
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

export default MODEL;