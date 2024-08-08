import {ref} from "vue";
import type {RouteParamsRaw, Router, RouteRecordNormalized} from 'vue-router';
import type {QueryMenuForm} from "@geelato/gl-ui";
import {applicationApi, authUtil} from "@geelato/gl-ui";
import globalConfig from "../../assets/globalConfig";
import {DEFAULT_LAYOUT, DEFAULT_PAGE_RUNTIME} from "./base";
import {currentParams, DEFAULT_ROUTE, DEFAULT_ROUTE_ACCOUNT, IS_ACCOUNT, IS_DATA_PAGE, URL_PREFIX} from "../constants";
import type {Component} from "./types";

const IS_DATA_END_PAGE = ref<boolean>(false);
const IS_DATA_REDIRECT_PAGE = ref<boolean>(false);

const modules = import.meta.glob('./modules/*.ts', {eager: true});
const externalModules = import.meta.glob('./externalModules/*.ts', {eager: true,});

/**
 * 获取模块
 * @param modules
 * @param result
 */
const getModules = (modules: any, result: RouteRecordNormalized[]) => {
  Object.keys(modules).forEach((key) => {
    const defaultModule = modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule];
    result.push(...moduleList);
  });

  return result;
}

const getRouter = (_modules: any, result: string[]) => {
  // 获取模块
  const moduleResult: RouteRecordNormalized[] = [];
  getModules(modules, moduleResult);
  getModules(_modules, moduleResult);
  // 获取路由
  if (moduleResult.length > 0) {
    for (const module of moduleResult) {
      if (module.children && module.children.length > 0) {
        for (const value of module.children) {
          result.push(`${module.path}/${value.path}`);
        }
      } else {
        result.push(module.path);
      }
    }
  }

  return result;
}


/**
 * page功能，参数是否完整
 * @param params
 */
const pageParamsIsFull = (params: object, type?: number) => {
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

/**
 * 指向个人默认页面，或page基础页面
 * @param pageParams
 */
const pageBaseRoute = (router: Router, pageParams: RouteParamsRaw, callBack?: any) => {
  if (DEFAULT_ROUTE.value.name && pageParamsIsFull(DEFAULT_ROUTE.value.params)) {
    window.open(router.resolve({name: DEFAULT_ROUTE.value.name, params: DEFAULT_ROUTE.value.params}).href, "_self");
  } else if (pageParamsIsFull(pageParams, 1)) {
    window.open(router.resolve({name: 'pageWrapper', params: pageParams}).href, "_self");
  } else if (callBack && typeof callBack === 'function') callBack();
}

const isPageApp = (url: URL, curParams: Record<string, string>) => {
  if (curParams.tenantCode && curParams.appId) {
    const pagePathValue = `${URL_PREFIX.value}${curParams.pathValue}/page`;
    const loginPathValue = `${URL_PREFIX.value}${curParams.pathValue}/login`;
    // http://localhost:5173/:prefix/:tenantCode/:appId/page/xx/xx/:pageId
    if (url.pathname.startsWith(`${pagePathValue}/`) || url.pathname.startsWith(`${pagePathValue}`)) {
      IS_DATA_PAGE.value = true;
      if (!authUtil.getToken()) {
        window.location.assign(`${url.origin}${URL_PREFIX.value}${loginPathValue}?redirect=${url.href}`);
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

/**
 * 获取当前页面参数
 * @param _modules
 */
const analyzeCurrentPath = (_modules: any) => {
  const routerPaths = getRouter(_modules, ['/login', '/page', 'forget', '/export/list', '/export']);
  currentParams.value = {appId: "", path: "", pathValue: "", tenantCode: ""};
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
      if (`${URL_PREFIX.value}` && pathName.startsWith(`${URL_PREFIX.value}`)) {
        pathName = pathName.replace(`${URL_PREFIX.value}`, '');
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
      const params = pathName.split('/') || [];
      currentParams.value.tenantCode = params && params[1] || '';
      currentParams.value.appId = params && params[2] || '';
    }
    currentParams.value.tenantCode = currentParams.value.tenantCode || urlParams.get("tenantCode") || '';
    currentParams.value.appId = currentParams.value.appId || urlParams.get("appId") || '';
  }
  if (currentParams.value.tenantCode) {
    currentParams.value.path += `/:tenantCode`;
    currentParams.value.pathValue += `/${currentParams.value.tenantCode}`;
    if (currentParams.value.appId) {
      currentParams.value.path += `/:appId`;
      currentParams.value.pathValue += `/${currentParams.value.appId}`;
    }
  }
  // 判断路由是否时account功能
  isAccountApp(url, currentParams.value);
  // 判断路由是否时page功能
  isPageApp(url, currentParams.value);
}

/**
 * 构建基础路由
 * @param _modules
 * @param result
 */
const formatModules = (_modules: any, result: RouteRecordNormalized[], format?: any) => {
  // 自定义操作
  if (format && typeof format === 'function') return format(_modules, modules, result);
  // 默认操作
  const {path, pathValue, ...urlParams} = currentParams.value;
  // 获取模块
  const moduleResult: RouteRecordNormalized[] = [];
  getModules(modules, moduleResult);
  getModules(_modules, moduleResult);
  // 构建模块
  if (moduleResult.length > 0) {
    for (const module of moduleResult) {
      // 限制
      if (IS_ACCOUNT.value && module.name !== 'account') continue;
      if (!IS_ACCOUNT.value && module.name === 'account') continue;
      // 租户下显示，应用下不显示
      if (IS_DATA_PAGE.value) continue;
      if (urlParams.appId) continue;
      // 路由
      module.path = URL_PREFIX.value + path + module.path;
      if (module.children && module.children.length > 0) {
        for (const value of module.children) {
          // @ts-ignore
          if (!['userAccount', 'manageAccount'].includes(value.name)) value.params = urlParams;
        }
      }
      result.push(module);
    }
  }

  if (!IS_DATA_PAGE.value) {
    DEFAULT_ROUTE.value.fullPath = URL_PREFIX.value + path + DEFAULT_ROUTE.value.fullPath;
    DEFAULT_ROUTE.value.params = urlParams;
  }
  if (IS_ACCOUNT.value) Object.assign(DEFAULT_ROUTE.value, DEFAULT_ROUTE_ACCOUNT);

  return result;
}

/**
 * 构建额外的路由
 * @param _modules
 * @param result
 */
const formatExternalModules = (_modules: any, result: RouteRecordNormalized[]) => {
  getModules(externalModules, result);
  getModules(_modules, result);

  return result;
}

/**
 * 构建低代码路由
 * @param defaultData
 * @param totalData
 */
const buildOrgOptions = (defaultData: RouteRecordNormalized[], totalData: QueryMenuForm[]): RouteRecordNormalized[] => {
  const {path, pathValue, ...urlParams} = currentParams.value;
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
            // @ts-ignore
            component: DEFAULT_PAGE_RUNTIME,
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
      if (DEFAULT_ROUTE.value.params.pageId) {
        break;
      }
      setRoute(fullPath, result.children[i] as RouteRecordNormalized);
    }
  } else if (result.path.endsWith(':pageId')) {
    // @ts-ignore
    DEFAULT_ROUTE.value.params = result.params;
    DEFAULT_ROUTE.value.name = result.name as string;
    DEFAULT_ROUTE.value.fullPath = fullPath;
  } else {
    fullPath = "";
  }
}

/**
 * 低代码路由
 * @param result
 */
const formatAppModules = async (result: RouteRecordNormalized[], formatApp?: any) => {
  try {
    // 自定义 格式化
    if (formatApp && typeof formatApp === 'function') return formatApp(result);
    // 默认 格式化
    if (!authUtil.getToken() || !IS_DATA_PAGE.value) return result;
    // 获取菜单
    const {path, pathValue, ...urlParams} = currentParams.value;
    const {data} = await applicationApi.getMenus({flag: "menuItem", ...urlParams} as unknown as QueryMenuForm);
    // @ts-ignore
    const menuForms = data.code === globalConfig.interceptorCode ? data.data : data;
    const folderOptions: RouteRecordNormalized[] = [];
    let folderOrder = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const item of menuForms) {
      if (item.type === 'folder' && (!item.pid || item.pid === urlParams.appId)) {
        folderOptions.push({
          path: `${URL_PREFIX.value}/:tenantCode/:appId/page/${item.id}`,
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
        if (DEFAULT_ROUTE.value.params.pageId) {
          break;
        }
      }
      // ---page -- 默认首页 /:tenantCode/:appId/page/xx/xx/:pageId
      if (IS_DATA_PAGE.value && IS_DATA_END_PAGE.value && DEFAULT_ROUTE.value.name && pageParamsIsFull(DEFAULT_ROUTE.value.params)) {
        let fullPaths: string[] = DEFAULT_ROUTE.value.fullPath.split('/');
        // eslint-disable-next-line no-restricted-syntax,guard-for-in
        for (const obj in DEFAULT_ROUTE.value.params) {
          // @ts-ignore
          fullPaths = fullPaths.map(item => item === `:${obj}` ? (DEFAULT_ROUTE.value.params[obj] || '') : item);
        }
        const url = fullPaths.join('/');
        window.location.assign(window.location.origin + url);
      }
    }
    // console.log(result)
  } catch (err) {
    console.log(err);
    result = [];
  }

  return result;
}

/**
 * 登录路由
 * @param comp 地址
 * @param result 路由
 */
const appLoginRoutes = (result: any[], comp?: Component) => {
  const {path, pathValue, ...urlParams} = currentParams.value;
  const loginPath = `${URL_PREFIX.value}${path}/login`;
  const loginPathValue = `${URL_PREFIX.value}${pathValue}/login`;
  // 基础版
  result.push({path: '/', redirect: loginPathValue, params: {...urlParams}});
  // 完整版
  result.push({
    path: loginPath,
    name: `login`,
    component: comp,
    meta: {
      requiresAuth: false,
    },
    params: {...urlParams}
  });
  // 前缀功能版
  if (URL_PREFIX.value) {
    const ta = URL_PREFIX.value.split('');
    const positions = new Set();
    for (let i = 0; i < ta.length; i += 1) {
      if (ta[i] === '/') {
        const position = URL_PREFIX.value.substring(0, i);
        if (position) positions.add(position);
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const position of positions) {
      result.push({path: position, redirect: loginPathValue, params: {...urlParams}})
    }
    // 前缀完全版
    result.push({path: `${URL_PREFIX.value}`, redirect: loginPathValue, params: {...urlParams}})
    if (path) {
      result.push({path: `${URL_PREFIX.value}${path}`, redirect: loginPathValue, params: {...urlParams}})
    }
  } else {
    result.push({path: `${path}`, redirect: loginPathValue, params: {...urlParams}});
  }

  return result;
}

export {appLoginRoutes, analyzeCurrentPath, formatAppModules, formatExternalModules, formatModules, pageBaseRoute, pageParamsIsFull}