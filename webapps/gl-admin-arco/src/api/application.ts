import axios from "axios";
import qs from "query-string";
import {PageQueryRequest, PageQueryResponse, QueryResult} from "@/api/base";
import {getToken} from "@/utils/auth";
import {useApiUrl} from "@geelato/gl-ui";
import {SelectOptionData} from "@arco-design/web-vue";

const urlOrigin = useApiUrl().getApiBaseUrl()

export interface QueryAppForm {
  id: string;
  name: string;// 应用名称
  type: string;// 应用类型
  code: string;// 应用编码
  icon: string;// 图标
  appKey: string;
  token: string;
  tree: string;
  logo: string;// 标识
  theme: string;
  watermark: number;// 应用水印
  href: string;// 首页链接
  dependAppCode: string;
  powerInfo: string;
  versionInfo: string;
  description: string;// 描述
  seqNo: number;
  applyStatus: number;
  designStatus: number;
  appStorage: string;
  tenantCode?: string;
  roles?: string;
  connects?: string;
}

export interface FilterAppForm {
  id: string;
  name: string;// 应用名称
  code: string;// 应用编码
  watermark: string;// 应用水印
  versionInfo: string;
  createAt: string[];
  tenantCode: string;
  applyStatus: string;
  designStatus: string;
}

export interface QueryMenuForm {
  id: string;
  pid: string;
  appId: string;
  pageId: string;// 页面id
  flag: string;// menuItem
  icon: string;
  iconType: string;
  type: string;// folder formPage listPage freePage
  meta: string;// 路径
  treeEntity: string;
  extendEntity: string;
  text: string;
  seqNo: number;
  tenantCode: string;
  children?: QueryMenuForm[];
}

export function pageQueryApps(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/app/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryApps() {
  return axios.get<QueryAppForm[]>('/api/app/query');
}

export function queryAppsByParams(params: Record<string, any>) {
  return axios.get<QueryAppForm[]>('/api/app/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getApp(id: string) {
  return axios.get<QueryAppForm>(`/api/app/get/${id}`);
}

export function createOrUpdateApp(params: QueryAppForm) {
  return axios.post<QueryResult>('/api/app/createOrUpdate', params);
}

export function deleteApp(id: string) {
  return axios.delete<QueryResult>(`/api/app/isDelete/${id}`);
}

export function validateAppCode(params: QueryAppForm) {
  return axios.post<QueryResult>('/api/app/validate', params);
}

/* -----------------------------版本管理--------------------------- */
export interface QueryAppVersionForm {
  id: string;
  version: string;
  packagePath: string;
  packageSource: string;
  packetTime: string;
  status: string;
  description: string;
  appId: string;
  tenantCode: string;
  createAt?: string;
  creator?: string;
  creatorName?: string;
  updateAt?: string;
  updater?: string;
  updaterName?: string;
}

export function pageQueryAppVersions(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/app/version/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getAppVersion(id: string) {
  return axios.get<QueryAppVersionForm>(`/api/app/version/get/${id}`);
}

export function createOrUpdateAppVersion(params: QueryAppVersionForm) {
  return axios.post<QueryResult>('/api/app/version/createOrUpdate', params);
}

export function deleteAppVersion(id: string) {
  return axios.delete<QueryResult>(`/api/app/version/isDelete/${id}`);
}

/**
 * 应用打包
 * @param appId
 */
export function packetAppVersion(appId: string, version?: string, description?: string) {
  return axios.get<QueryResult>(`/package/packet/${appId}?version=${version || ''}&description=${description || ''}`);
}

/**
 * 部署应用
 * @param versionId
 */
export function deployAppVersion(versionId: string) {
  return axios.get<QueryResult>(`/package/deploy/${versionId}`);
}

export function queryAppPackage(appVersionId: string) {
  return axios.get<QueryResult>(`/api/app/version/package/${appVersionId}`);
}

/* -------------------------------------------------------------- */
/**
 * 获取应用菜单
 * @param params
 */
export function getMenus(params: QueryMenuForm) {
  const token = getToken();
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  return axios.post<QueryMenuForm[]>(`${urlOrigin}/api/user/menu`, params);
}

/**
 * 应用与数据链接关系表
 * @param params
 */
export function pageQueryAppConnectOf(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/app/connect/pageQueryOf', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

/**
 * 查询所有的应用
 * @param params
 * @param successBack
 * @param failBack
 */
export const getAppSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await queryAppsByParams(params);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}

/**
 * 查询所有的应用
 * @param params
 * @param successBack
 * @param failBack
 */
export const queryAppSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  await getAppSelectOptions(params, (data: QueryAppForm[]) => {
    const options: SelectOptionData[] = [];
    if (data && data.length > 0) {
      for (let i = 0; i < data.length; i += 1) {
        options.push({label: data[i].name, value: data[i].id});
      }
    }
    if (successBack && typeof successBack === 'function') successBack(options);
  }, failBack);
}