import type {RouteRecordNormalized} from 'vue-router';
import {entityApi} from "./EntityApi";
import type {QueryRolePermissionForm} from "./SecurityApi";
import type {BaseSortableEntity, PageQueryResponse, QueryResult} from "./Base";
import utils from "../utils/Utils";
import {getToken} from "../utils/Auth";
import useApiUrl from "../hooks/useApiUrl";

const urlOrigin = useApiUrl().getApiBaseUrl()

export interface AppState {
  theme: string;
  navStyle: string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  menuCollapseWidth: number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];

  [key: string]: unknown;
}

export interface QueryAppForm extends BaseSortableEntity {
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
  applyStatus: number;
  designStatus: number;
  appStorage: string;
  roles?: string;
  connects?: string;
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
  return entityApi.getAxios().post<QueryMenuForm[]>(`${urlOrigin}/api/user/menu`, params, {
    headers: {'Authorization': `Bearer ${token}`}
  });
}

/**
 * 分页查询
 * @param params
 */
export function pageQueryApps(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/app/pageQuery?${records.join('&')}`);
}

/**
 * 条件查询
 * @param params
 */
export function queryApps(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryAppForm[]>(`/api/app/query?${records.join('&')}`);
}

/**
 * 单条查询
 * @param id
 */
export function getApp(id: string) {
  return entityApi.getAxios().get<QueryAppForm>(`/api/app/get/${id}`);
}

/**
 * 创建或更新
 * @param params
 */
export function createOrUpdateApp(params: QueryAppForm) {
  return entityApi.getAxios().post<QueryResult>('/api/app/createOrUpdate', params);
}

/**
 * 删除
 * @param id
 */
export function deleteApp(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/app/isDelete/${id}`);
}

/**
 * 验证应用编码
 * @param params
 */
export function validateAppCode(params: QueryAppForm) {
  return entityApi.getAxios().post<QueryResult>('/api/app/validate', params);
}

/**
 * 用户拥有权限的应用
 * @param tenantCode
 * @param userId
 */
export function queryAppsByUser(tenantCode: string, userId?: string) {
  return entityApi.getAxios().get<QueryAppForm[]>(`/api/app/queryByUser?tenantCode=${tenantCode}&userId=${userId}`);
}

export function queryPermissionByPage(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryResult>(`/api/app/queryPermissionByPage?${records.join('&')}`);
}

export function queryRolePermissionByPage(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryRolePermissionForm[]>(`/api/app/queryRolePermissionByPage?${records.join('&')}`);
}

/**
 * 应用与数据链接关系表
 * @param params
 */
export function pageQueryAppConnectOf(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/app/connect/pageQueryOf?${records.join('&')}`);
}

/**
 * 查询所有的应用
 * @param params
 * @param successBack
 * @param failBack
 */
export const getAppSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await queryApps(params);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}