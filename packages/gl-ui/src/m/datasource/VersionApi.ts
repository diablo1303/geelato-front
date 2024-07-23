import type {BaseEntity, PageQueryResponse, QueryResult} from "./Base";
import {entityApi} from "./EntityApi";
import utils from '../utils/Utils'

export interface QueryAppVersionForm extends BaseEntity {
  version: string;
  packagePath: string;
  packageSource: string;
  packetTime: string;
  status: string;
  description: string;
  appId: string;
}

/**
 * 分页查询
 * @param params
 */
export function pageQueryAppVersions(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/app/version/pageQuery?${records.join('&')}`);
}

/**
 * 单条查询
 * @param id
 */
export function getAppVersion(id: string) {
  return entityApi.getAxios().get<QueryAppVersionForm>(`/api/app/version/get/${id}`);
}

/**
 * 创建或更新
 * @param params
 */
export function createOrUpdateAppVersion(params: QueryAppVersionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/app/version/createOrUpdate', params);
}

/**
 * 删除
 * @param id
 */
export function deleteAppVersion(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/app/version/isDelete/${id}`);
}

/**
 * 应用打包
 * @param appId
 */
export function packetAppVersion(appId: string, version?: string, description?: string, appointMetas?: Record<string, string>) {
  return entityApi.getAxios().post<QueryResult>(`/package/packet/${appId}?version=${version || ''}&description=${description || ''}`);
}

/**
 * 应用对比打包
 * @param appId
 * @param version
 * @param description
 * @param appointMetas
 */
export function packetMergeAppVersion(appId: string, version?: string, description?: string, appointMetas?: Record<string, string>) {
  return entityApi.getAxios().post<QueryResult>(`/package/packet/merge?appId=${appId}&version=${version || ''}&description=${description || ''}`, appointMetas || {});
}

/**
 * 验证应用版本
 * @param params
 */
export function validateAppVersion(params: QueryAppVersionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/app/version/validate', params);
}

/**
 * 部署应用
 * @param versionId
 */
export function deployAppVersion(versionId: string) {
  return entityApi.getAxios().get<QueryResult>(`/package/deploy/${versionId}`);
}

/**
 * 查询应用包详细数据
 * @param appVersionId
 */
export function queryAppPackage(appVersionId: string) {
  return entityApi.getAxios().get<QueryResult>(`/api/app/version/package/${appVersionId}`);
}