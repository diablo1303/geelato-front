import type {RouteRecordNormalized} from 'vue-router';
import {DEFAULT_LAYOUT} from "@/router/routes/base";
import globalconfig from "@/config/globalconfig.json";
import {getMenuList1, QueryMenuForm} from "@/api/user";
import {DEFAULT_ROUTE, URL_PREFIX} from "@/router/constants";
import {ref} from "vue";

const modules = import.meta.glob('./modules/*.ts', {eager: true});
const externalModules = import.meta.glob('./externalModules/*.ts', {eager: true,});

const currentPage = ref({tenantCode: '', appId: '', pageId: ''});

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

const formatUrl = () => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  if (url) {
    console.log(url);
    const urlParams = url.searchParams;
    if (url.pathname) {
      const routerPaths = getRouter(modules, ['/page/preview']);
      // eslint-disable-next-line no-restricted-syntax
      for (const item of routerPaths) {
        if (url.pathname.indexOf(item) !== -1) {
          const tb = url.pathname.split(item);
          if (tb && tb.length >= 2 && tb[1]) {
            const ta = tb[1].split("/");
            currentPage.value.tenantCode = ta && ta[1] || '';
            currentPage.value.appId = ta && ta[2] || '';
            currentPage.value.pageId = ta && ta[3] || '';
            break;
          }
        }
      }
    }
    currentPage.value.tenantCode = currentPage.value.tenantCode || urlParams.get("tenantCode") || '';
    currentPage.value.appId = currentPage.value.appId || urlParams.get("appId") || '';
    currentPage.value.pageId = currentPage.value.pageId || urlParams.get("pageId") || '';
  }
  console.log(currentPage.value);
}
formatUrl();

const currentPathSuffix = () => {
  let path = "";
  if (currentPage.value.tenantCode) {
    path += `/:tenantCode`
    if (currentPage.value.appId) {
      path += `/:appId`
    }
  }
  return path;
}

const formatModules = (_modules: any, result: RouteRecordNormalized[]) => {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    defaultModule.path = URL_PREFIX + defaultModule.path;
    if (defaultModule.children && defaultModule.children.length > 0) {
      defaultModule.children.forEach((value: any, index: number) => {
        value.path += currentPathSuffix();
        value.params = currentPage.value;
      });
    }
    const moduleList = Array.isArray(defaultModule) ? [...defaultModule] : [defaultModule];
    result.push(...moduleList);
  });
  // 默认页面
  DEFAULT_ROUTE.fullPath = URL_PREFIX + DEFAULT_ROUTE.fullPath + currentPathSuffix();
  DEFAULT_ROUTE.params = currentPage.value;

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
            path: `preview/:tenantCode/:appId/:pageId`,
            name: `${item.id}`,
            component: () => import('@/views/page/PageRuntime.vue'),
            meta: {locale: item.text, icon: item.iconType, requiresAuth: true, order: item.seqNo},
            children: [],
            props: item,
            params: {tenantCode: currentPage.value.tenantCode, appId: currentPage.value.appId, pageId: `${item.pageId}`}
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

const formatAppModules = async () => {
  let result: RouteRecordNormalized[] = [];
  try {
    const {data} = await getMenuList1({flag: "menuItem", ...currentPage.value} as unknown as QueryMenuForm);
    // @ts-ignore
    const menuForms = data.code === globalconfig.interceptorCode ? data.data : data;
    const folderOptions: RouteRecordNormalized[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const item of menuForms) {
      if (item.type === 'folder') {
        folderOptions.push({
          path: `${URL_PREFIX}/page`,
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
const appDataBaseRoutes: RouteRecordNormalized[] = await formatAppModules();

const appRoutes: RouteRecordNormalized[] = formatModules(modules, appDataBaseRoutes);

const appExternalRoutes: RouteRecordNormalized[] = formatExternalModules(externalModules, []);

export {appDataBaseRoutes, appRoutes, appExternalRoutes};
