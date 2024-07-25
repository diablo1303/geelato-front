import {type Ref, ref} from "vue";
import type {RouteRecordNormalized} from "vue-router";
import type {CurrentParameter} from "./routes/types";

export const URL_PREFIX = ref<string>('');

export const DEFAULT_ROUTE = ref<Record<string, any>>({title: '', name: '', fullPath: '', params: {}});

export const IS_ACCOUNT = ref<boolean>(false);

export const IS_DATA_PAGE = ref<boolean>(false);

export const currentParams = ref<CurrentParameter>({appId: "", path: "", pathValue: "", tenantCode: ""});

export const appDataBaseRoutes: Ref<RouteRecordNormalized[]> = ref<RouteRecordNormalized[]>([]);

export const appRoutes: Ref<RouteRecordNormalized[]> = ref<RouteRecordNormalized[]>([]);

export const appExternalRoutes: Ref<RouteRecordNormalized[]> = ref<RouteRecordNormalized[]>([]);

/* 常量 */
export const WHITE_LIST = [{name: 'notFound', children: []}, {name: 'login', children: []}];

export const NOT_FOUND_ROUTE_NAME = 'notFound';

export const REDIRECT_ROUTE_NAME = 'Redirect';

export const ACCOUNT_ROUTE_PATH = '/account/user';

export const EXPORT_ROUTE_PATH = '/export/list';

export const DEFAULT_ROUTE_ACCOUNT = {title: 'model.application.index.menu.list', name: 'userAccount', fullPath: ACCOUNT_ROUTE_PATH, params: {}};
