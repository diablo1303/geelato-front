import {DEFAULT_LAYOUT} from '../base';
import {AppRouteRecordRaw} from '../types';

const USER: AppRouteRecordRaw = {
    path: '/page',
    name: 'page',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'XX模块(配置的)',
        icon: 'icon-user',
        requiresAuth: true,
        order: 1,
    },
    children: [
        {
            path: 'pageList',
            name: 'pageList',
            component: () => import('@/views/page/PageRuntime.vue'),
            meta: {
                locale: '客户列表',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};

export default USER;
