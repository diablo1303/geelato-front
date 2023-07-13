import type {RouteRecordNormalized} from 'vue-router';
import {DEFAULT_LAYOUT} from "@/router/routes/base";
import {getMenus, QueryMenuForm} from "@/api/user";
import globalConfig from '@/config/globalConfig.json';
import {DEFAULT_ROUTE, URL_PREFIX} from "@/router/constants";

const modules = import.meta.glob('./modules/*.ts', {eager: true});
const externalModules = import.meta.glob('./externalModules/*.ts', {eager: true,});

const getRouter = (_modules: any, result: string[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    if (defaultModule.children && defaultModule.children.length > 0) {
      defaultModule.children.forEach((value: any, index: number) => {
        result.push(`${defaultModule.path}/${value.path}`);
      });
    } else {
      result.push(defaultModule.path);
    }
  });
  return result;
}

export const currentPage = () => {
  const currentParams = {path: '', tenantCode: '', appId: ''};
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  if (url) {
    const urlParams = url.searchParams;
    if (url.pathname) {
      const routerPaths = getRouter(modules, ['/login', '/page/preview']);
      // eslint-disable-next-line no-restricted-syntax
      for (const item of routerPaths) {
        if (url.pathname.indexOf(item) !== -1) {
          const tb = url.pathname.replace(`${URL_PREFIX}`, '').split(item);
          if (tb && tb.length > 0) {
            const ta = tb[0].split("/");
            currentParams.tenantCode = ta && ta[1] || '';
            currentParams.appId = ta && ta[2] || '';
            break;
          }
        }
      }
    }
    currentParams.tenantCode = currentParams.tenantCode || urlParams.get("tenantCode") || '';
    currentParams.appId = currentParams.appId || urlParams.get("appId") || '';
  }
  if (currentParams.tenantCode) {
    currentParams.path += `/:tenantCode`
    if (currentParams.appId) {
      currentParams.path += `/:appId`
    }
  }

  return currentParams;
}

const {path, ...urlParams} = currentPage();

const formatModules = (_modules: any, result: RouteRecordNormalized[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    defaultModule.path = URL_PREFIX + path + defaultModule.path;
    if (defaultModule.children && defaultModule.children.length > 0) {
      defaultModule.children.forEach((value: any, index: number) => {
        value.params = urlParams;
      });
    }
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule];
    result.push(...moduleList);
  });
  // 默认页面
  DEFAULT_ROUTE.fullPath = URL_PREFIX + path + DEFAULT_ROUTE.fullPath;
  DEFAULT_ROUTE.params = urlParams;

  return result;
}

const formatExternalModules = (_modules: any, result: RouteRecordNormalized[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

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
            path: `${item.treeEntity || item.id}`,
            name: `${item.id}`,
            component: DEFAULT_LAYOUT,
            meta: {locale: item.text, icon: item.iconType, requiresAuth: true, order: item.seqNo},
            children: [],
            props: item
          } as unknown as RouteRecordNormalized);
        } else if (["formPage", "listPage", "freePage"].includes(item.type)) {
          data.children?.push({
            path: `preview/:pageId`,
            name: `${item.id}`,
            component: () => import('@/views/page/PageRuntime.vue'),
            meta: {locale: item.text, icon: item.iconType, requiresAuth: true, order: item.seqNo},
            children: [],
            props: item,
            params: {...urlParams, pageId: `${item.pageId}`}
          } as unknown as RouteRecordNormalized);
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

export const formatAppModules = async (result: RouteRecordNormalized[]) => {
  try {
    const {data} = await getMenus({flag: "menuItem", ...urlParams} as unknown as QueryMenuForm);
    // @ts-ignore
    const menuForms = data.code === globalConfig.interceptorCode ? data.data : data;
    const folderOptions: RouteRecordNormalized[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of menuForms) {
      if (item.type === 'folder') {
        folderOptions.push({
          path: `${URL_PREFIX}/:tenantCode/:appId/page`,
          name: `${item.id}`,
          component: DEFAULT_LAYOUT,
          meta: {locale: item.text, icon: item.iconType, requiresAuth: true, order: item.seqNo},
          children: [],
          props: item
        } as unknown as RouteRecordNormalized);
      }
    }
    result = buildOrgOptions(folderOptions, menuForms);
    console.log(result)
  } catch (err) {
    console.log(err);
    result = [];
  }

  return result;
}

// @ts-ignore
const appDataBaseRoutes: RouteRecordNormalized[] = await formatAppModules([]);

const appRoutes: RouteRecordNormalized[] = formatModules(modules, appDataBaseRoutes);

const appExternalRoutes: RouteRecordNormalized[] = formatExternalModules(externalModules, []);

export const appLoginRoutes = (result: any[]) => {
  const loginPath = `${URL_PREFIX}${path}/login`;
  // 基础版
  result.push({
    path: loginPath,
    name: `login`,
    component: () => import('@/views/login/index.vue'),
    meta: {
      requiresAuth: false,
    },
  });
  result.push({path: '/', redirect: loginPath});

  if (URL_PREFIX) {
    const ta = URL_PREFIX.split('');
    const positions = new Set();
    for (let i = 0; i < ta.length; i += 1) {
      if (ta[i] === '/') {
        const position = URL_PREFIX.substring(0, i);
        if (position) positions.add(position);
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const position of positions) {
      result.push({path: position, redirect: `${URL_PREFIX}/login`})
    }
    // 前缀完全版
    result.push({path: `${URL_PREFIX}`, redirect: loginPath})
    if (path) {
      result.push({path: `${URL_PREFIX}${path}`, redirect: loginPath})
    }
  }
  return result;
}

export {appDataBaseRoutes, appRoutes, appExternalRoutes};
