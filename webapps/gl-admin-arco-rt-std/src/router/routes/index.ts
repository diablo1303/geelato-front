import {ref} from "vue";
import type {RouteParamsRaw, RouteRecordNormalized} from 'vue-router';
import {Router} from "vue-router";
import type {QueryMenuForm} from "@geelato/gl-ui";
import {applicationApi, authUtil} from "@geelato/gl-ui";
import {ROUTER_IS_ACCOUNT,globalConfig} from "@geelato/gl-ui-arco-admin";
import {DEFAULT_LAYOUT} from "@/router/routes/base";
import {DEFAULT_ROUTE, DEFAULT_ROUTE_ACCOUNT, URL_PREFIX} from "@/router/constants";

const token = authUtil.getToken();
export const IS_ACCOUNT = ref<boolean>(ROUTER_IS_ACCOUNT.value);
export const IS_DATA_PAGE = ref<boolean>(false);
const IS_DATA_END_PAGE = ref<boolean>(false);
const IS_DATA_REDIRECT_PAGE = ref<boolean>(false);
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

/**
 * page功能，参数是否完整
 * @param params
 */
export const pageParamsIsFull = (params: object, type?: number) => {
  if (params) {
    if (type === 1 && 'tenantCode' in params && 'appId' in params) {
      // @ts-ignore
      if (!!params.tenantCode && !!params.appId) {
        return true;
      }
    } else if ('tenantCode' in params && 'appId' in params && 'pageId' in params) {
      // @ts-ignore
      if (!!params.tenantCode && !!params.appId && !!params.pageId) {
        return true;
      }
    }
  }
  return false;
}

const isPageApp = (url: URL, curParams: Record<string, string>) => {
  if (curParams.tenantCode && curParams.appId) {
    const pagePathValue = `${URL_PREFIX}${curParams.pathValue}/page`;
    const loginPathValue = `${URL_PREFIX}${curParams.pathValue}/login`;
    // http://localhost:5173/:prefix/:tenantCode/:appId/page/xx/xx/:pageId
    if (url.pathname.startsWith(`${pagePathValue}/`) || url.pathname.startsWith(`${pagePathValue}`)) {
      IS_DATA_PAGE.value = true;
      if (!token) {
        window.location.assign(`${url.origin}${URL_PREFIX}${loginPathValue}?redirect=${url.href}`);
      }
    }
    // http://localhost:5173/:prefix/:tenantCode/:appId/page
    if ([pagePathValue, `${pagePathValue}/`].includes(url.pathname)) {
      IS_DATA_END_PAGE.value = true;
      IS_DATA_PAGE.value = true;
    }
    // http://localhost:5173/:prefix/:tenantCode/:appId/login?redirect=
    if (url.pathname.startsWith(`${loginPathValue}`) && url.search.indexOf('redirect=') !== -1) {
      const redirectValue = url.searchParams.get("redirect") || '';
      if (redirectValue.indexOf(`${pagePathValue}`) !== -1) {
        // redirect=http://localhost:5173/:prefix/:tenantCode/:appId/page
        IS_DATA_PAGE.value = true;
      } else if (url.search.indexOf('&pageId=') !== -1) {
        // redirect=&tenantCode=&appId=&pageId=
        IS_DATA_REDIRECT_PAGE.value = true;
        IS_DATA_PAGE.value = true;
      }
    }
  }
}

const isAccountApp = (url: URL, curParams: Record<string, string>) => {
  // http://localhost:5173/account/user | http://localhost:5173/account/manage
  if (['/account', '/account/', '/account/user', '/account/user/', '/account/manage', '/account/manage/'].includes(url.pathname)) {
    IS_ACCOUNT.value = true;
  }
  // http://localhost:5173/login?redirect=userAccount
  if (url.pathname.endsWith("/login") && url.search.indexOf('redirect=') !== -1) {
    const redirectValue = url.searchParams.get("redirect") || '';
    if (['account', 'userAccount', 'manageAccount'].includes(redirectValue)) {
      IS_ACCOUNT.value = true;
    }
  }
}

export const currentPage = () => {
  const routerPaths = getRouter(modules, ['/login', '/page', 'forget', '/export/list', '/export']);
  const currentParams = {path: '', pathValue: '', tenantCode: '', appId: ''};
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  if (url) {
    const urlParams = url.searchParams;
    if (url.pathname) {
      // 是否是账户页面
      if (url.pathname.startsWith('/account/')) {
        IS_ACCOUNT.value = true;
      }
      let pathName = url.pathname;
      if (`${URL_PREFIX}` && pathName.startsWith(`${URL_PREFIX}`)) {
        pathName = pathName.replace(`${URL_PREFIX}`, '');
      }
      let pathNames: string[] = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const item of routerPaths) {
        if (pathName.indexOf(item) !== -1) {
          pathNames = pathName.split(item) || [];
          break;
        }
      }
      pathName = pathNames && pathNames.length > 0 ? pathNames[0] : pathName;
      const params = pathName.split("/") || [];
      currentParams.tenantCode = params && params[1] || '';
      currentParams.appId = params && params[2] || '';
    }
    currentParams.tenantCode = currentParams.tenantCode || urlParams.get("tenantCode") || '';
    currentParams.appId = currentParams.appId || urlParams.get("appId") || '';
  }
  if (currentParams.tenantCode) {
    currentParams.path += `/:tenantCode`
    currentParams.pathValue += `/${currentParams.tenantCode}`;
    if (currentParams.appId) {
      currentParams.path += `/:appId`
      currentParams.pathValue += `/${currentParams.appId}`;
    }
  }
  // 判断路由是否时account功能
  isAccountApp(url, currentParams);
  // 判断路由是否时page功能
  isPageApp(url, currentParams);

  return currentParams;
}

const {path, pathValue, ...urlParams} = currentPage();

const formatModules = (_modules: any, result: RouteRecordNormalized[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    // 限制
    if (IS_ACCOUNT.value && defaultModule.name !== 'account') {
      return;
    }
    if (!IS_ACCOUNT.value && defaultModule.name === 'account') {
      return;
    }
    // 租户下显示，应用下不显示
    if (urlParams.appId) {
      return;
    }
    defaultModule.path = URL_PREFIX + path + defaultModule.path;
    if (defaultModule.children && defaultModule.children.length > 0) {
      defaultModule.children.forEach((value: any, index: number) => {
        if (!['userAccount', 'manageAccount'].includes(value.name)) value.params = urlParams;
      });
    }
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule];
    result.push(...moduleList);
  });
  if (IS_ACCOUNT.value) Object.assign(DEFAULT_ROUTE, DEFAULT_ROUTE_ACCOUNT);

  // console.log(DEFAULT_ROUTE);
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
  let pageOrder = 99;
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
            component: null,
            // eslint-disable-next-line no-plusplus
            meta: {locale: item.text, icon: item.iconType, requiresAuth: true, order: pageOrder++},
            children: [],
            props: item
          } as unknown as RouteRecordNormalized);
        } else if (["formPage", "listPage", "freePage"].includes(item.type)) {
          data.children?.push({
            path: `${item.id}/:pageId`,
            name: `${item.id}`,
            component: () => import('@/views/page/PageRuntime.vue'),
            // eslint-disable-next-line no-plusplus
            meta: {locale: item.text, icon: item.iconType, requiresAuth: true, order: pageOrder++},
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

const setRoute = (fullPath: string, result: RouteRecordNormalized) => {
  fullPath += result.path.startsWith("/") ? result.path : `/${result.path}`;
  if (result.children && result.children.length > 0) {
    for (let i = 0; i < result.children.length; i += 1) {
      // @ts-ignore
      if (DEFAULT_ROUTE.params.pageId) {
        break;
      }
      setRoute(fullPath, result.children[i] as RouteRecordNormalized);
    }
  } else if (result.path.endsWith(':pageId')) {
    // @ts-ignore
    DEFAULT_ROUTE.params = result.params;
    DEFAULT_ROUTE.name = result.name as string;
    DEFAULT_ROUTE.fullPath = fullPath;
  } else {
    fullPath = "";
  }
}

export const formatAppModules = async (result: RouteRecordNormalized[]) => {
  try {
    if (!token) return result;
    const {data} = await applicationApi.getMenus({flag: "menuItem", ...urlParams} as unknown as QueryMenuForm);
    // @ts-ignore
    const menuForms = data.code === globalConfig.interceptorCode ? data.data : data;
    const folderOptions: RouteRecordNormalized[] = [];
    let folderOrder = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const item of menuForms) {
      if (item.type === 'folder' && (!item.pid || item.pid === urlParams.appId)) {
        folderOptions.push({
          path: `${URL_PREFIX}/:tenantCode/:appId/page/${item.id}`,
          name: `${item.id}`,
          component: DEFAULT_LAYOUT,
          // eslint-disable-next-line no-plusplus
          meta: {locale: item.text, icon: item.iconType, requiresAuth: true, order: folderOrder++},
          children: [],
          props: item
        } as unknown as RouteRecordNormalized);
      }
    }
    result = buildOrgOptions(folderOptions, menuForms);
    // 默认页面 取第一个
    if (result && result.length > 0) {
      for (let i = 0; i < result.length; i += 1) {
        setRoute("", result[i]);
        // @ts-ignore
        if (DEFAULT_ROUTE.params.pageId) {
          break;
        }
      }
      // ---page -- 默认首页 /:tenantCode/:appId/page/xx/xx/:pageId
      if (IS_DATA_PAGE.value && IS_DATA_END_PAGE.value && DEFAULT_ROUTE.name && pageParamsIsFull(DEFAULT_ROUTE.params)) {
        let fullPaths: string[] = DEFAULT_ROUTE.fullPath.split('/');
        // eslint-disable-next-line no-restricted-syntax,guard-for-in
        for (const obj in DEFAULT_ROUTE.params) {
          // @ts-ignore
          fullPaths = fullPaths.map(item => item === `:${obj}` ? (DEFAULT_ROUTE.params[obj] || '') : item);
        }
        const url = fullPaths.join('/');
        window.location.assign(window.location.origin + url);
      }
    }
    console.log(result);
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
  const loginPathValue = `${URL_PREFIX}${pathValue}/login`;
  // 基础版
  result.push({path: '/', redirect: loginPathValue, params: {...urlParams}});
  // 完整版
  result.push({
    path: loginPath,
    name: `login`,
    component: () => import('@/views/login/index.vue'),
    meta: {
      requiresAuth: false,
    }, params: {...urlParams}
  });
  // 前缀功能版
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
      result.push({path: position, redirect: loginPathValue, params: {...urlParams}})
    }
    // 前缀完全版
    result.push({path: `${URL_PREFIX}`, redirect: loginPathValue, params: {...urlParams}})
    if (path) {
      result.push({path: `${URL_PREFIX}${path}`, redirect: loginPathValue, params: {...urlParams}})
    }
  } else {
    result.push({path: `${path}`, redirect: loginPathValue, params: {...urlParams}});
  }

  return result;
}

/**
 * 指向个人默认页面，或page基础页面
 * @param pageParams
 */
export const pageBaseRoute = (router: Router, pageParams: RouteParamsRaw, callBack?: any) => {
  if (DEFAULT_ROUTE.name && pageParamsIsFull(DEFAULT_ROUTE.params)) {
    window.open(router.resolve({name: DEFAULT_ROUTE.name, params: DEFAULT_ROUTE.params}).href, "_self");
  } else if (pageParamsIsFull(pageParams, 1)) {
    window.open(router.resolve({name: 'pageWrapper', params: pageParams}).href, "_self");
  } else if (callBack && typeof callBack === 'function') callBack();
}

export {appDataBaseRoutes, appRoutes, appExternalRoutes};
