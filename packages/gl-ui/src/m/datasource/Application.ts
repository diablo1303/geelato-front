import {entityApi} from "./EntityApi";
import utils from "../utils/Utils";
import type {PageQueryResponse, QueryResult} from "./Base";
import type {QueryRolePermissionForm} from "./Security";

export interface QueryAppForm {
  id: string;
  name: string;// 应用名称
  code: string;// 应用编码
  type: string;// 应用类型
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

export function queryApps(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryAppForm[]>(`/api/app/query?${records.join('&')}`);
}

export function pageQueryAppConnectOf(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/app/connect/pageQueryOf?${records.join('&')}`);
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