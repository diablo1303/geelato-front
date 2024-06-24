import axios from "axios";
import qs from "query-string";
import {PageQueryRequest, PageQueryResponse, QueryResult} from "@/api/base";
import {getToken} from "@/utils/auth";
import {useApiUrl} from "@geelato/gl-ui";

const urlOrigin = useApiUrl().getApiBaseUrl()

export interface QueryAppForm {
  id: string;
  name: string;// 应用名称
  type: string;// 应用类型
  code: string;// 应用编码
  icon: string;// 图标
  purpose: string;// 应用用途
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
}

export interface FilterAppForm {
  id: string;
  name: string;// 应用名称
  code: string;// 应用编码
  watermark: string;// 应用水印
  versionInfo: string;
  createAt: string[];
}

export function pageQueryApps(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/app/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryApps(params: QueryAppForm) {
  return axios.get<QueryAppForm[]>('/api/app/query');
}

export function queryAppsByUser(tenantCode: string, userId?: string) {
  return axios.get<QueryAppForm[]>(`/api/app/queryByUser?tenantCode=${tenantCode}&userId=${userId}`);
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
  url: string;// 外部链接
  treeEntity: string;
  extendEntity: string;
  text: string;
  seqNo: number;
  tenantCode: string;
  children?: QueryMenuForm[];
}

/**
 * 获取应用菜单
 * @param params
 */
export function getMenus(params: QueryMenuForm) {
  const token = getToken();
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  return axios.post<QueryMenuForm[]>(`${urlOrigin}/api/user/menu`, params);
}