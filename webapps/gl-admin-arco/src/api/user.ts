import axios from 'axios';
import {UserState} from '@/store/modules/user/types';
import {RouteRecordNormalized} from "vue-router";
import {DEFAULT_LAYOUT} from "@/router/routes/base";
import qs from "query-string";

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

export interface QueryMenuForm {
  id: string;
  pid: string;
  appId: string;
  pageId: string;// 页面id
  flag: string;// menuItem
  icon: string;
  type: string;// folder formPage listPage freePage
  meta: string;// 路径
  entity: string;
  text: string;
  seqNo: number;
  tenantCode: string;
  children?: QueryMenuForm[];
}

// export function login(data: LoginData) {
//   return axios.post<LoginRes>('/api/user/login', data);
// }
export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

export function getMenuList1(params: QueryMenuForm) {
  return axios.get<QueryMenuForm[]>('https://localhost:8080/api/user/getMenuList', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

const getAppId = () => {
  let appId = '';
  const url = window.location.href;
  const qIndex = url.indexOf('?');
  if (qIndex !== -1) {
    const params = new URLSearchParams(url.substring(qIndex));
    appId = params.get('appId') || '';
  }

  return appId;
}
const currentAppId = getAppId();

const buildOrgOptions = (defaultData: RouteRecordNormalized[], totalData: QueryMenuForm[]): RouteRecordNormalized[] => {
  // eslint-disable-next-line no-restricted-syntax
  for (const data of defaultData) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of totalData) {
      // @ts-ignore
      if (item.id === data.props?.id) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // @ts-ignore
      if (item.pid === data.props?.id) {
        // folder formPage listPage freePage
        if (["folder"].includes(item.type)) {
          data.children?.push({
            path: `${item.entity || item.id}`,
            name: `${item.id}`,
            component: DEFAULT_LAYOUT,
            meta: {locale: item.text, icon: item.icon, requiresAuth: true, order: item.seqNo},
            children: [],
            props: item
          });
        } else if (["formPage", "listPage", "freePage"].includes(item.type)) {
          data.children?.push({
            path: `?appId=${currentAppId}&pageId=${item.pageId}`,
            name: `${item.id}`,
            component: () => import('@/views/page/PageRuntime.vue'),
            meta: {locale: item.text, icon: item.icon, requiresAuth: true, order: item.seqNo},
            children: [],
            props: item
          });
        }
      }
    }
    // @ts-ignore
    delete data.props;
    if (data.children && data.children.length > 0) {
      // @ts-ignore
      buildOrgOptions(data.children, totalData);
    } else {
      // @ts-ignore
      delete data.children;
    }
  }

  return defaultData;
}

export const formatModules = async (_modules: any, result: RouteRecordNormalized[]) => {
  try {
    const {data} = await getMenuList1({appId: currentAppId} as unknown as QueryMenuForm);
    // @ts-ignore
    const menuForms = data.data;
    const folderOptions: RouteRecordNormalized[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of menuForms) {
      if (item.type === 'folder') {
        const option = {
          path: `/page`,
          name: `${item.id}`,
          component: DEFAULT_LAYOUT,
          meta: {locale: item.text, icon: item.icon, requiresAuth: true, order: item.seqNo},
          children: [],
          props: item
        };
        // @ts-ignore
        folderOptions.push(option);
      }
    }
    result = buildOrgOptions(folderOptions, menuForms);
  } catch (err) {
    console.log(err);
    result = [];
  }
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}