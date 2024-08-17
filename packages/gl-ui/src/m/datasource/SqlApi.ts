import type {PageQueryResponse, QueryResult} from "./Base";
import {entityApi} from "./EntityApi";
import utils from '../utils/Utils'

export interface QuerySqlForm {
  id: string;
  title: string;
  keyName: string;
  parameterDefinition: string;
  configType: string;
  encodingContent: string;
  description: string; // 描述
  enableStatus: number; // 状态
  appId: string;
  tenantCode: string;
  updaterName?: string;
  updateAt?: string;
}

export function pageQuerySqls(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/sql/pageQuery?${records.join('&')}`);
}

export function querySqls(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QuerySqlForm[]>(`/api/sql/query?${records.join('&')}`);
}

export function getSql(id: string) {
  return entityApi.getAxios().get<QuerySqlForm>(`/api/sql/get/${id}`);
}

export function createOrUpdateSql(params: QuerySqlForm) {
  return entityApi.getAxios().post<QueryResult>('/api/sql/createOrUpdate', params);
}

export function deleteSql(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/sql/isDelete/${id}`);
}

export function validateSqlKeyName(params: QuerySqlForm) {
  return entityApi.getAxios().post<QueryResult>('/api/sql/validate', params);
}

export interface QueryAppSqlForm {
  id: string;
  appId: string;
  appName: string;
  sqlId: string;
  sqlKey: string;
  sqlTitle: string;
  sqlAppId: string;
  approvalStatus: string;
  approvalNeed: boolean;
  enableStatus: number;
  tenantCode: string;
  description: string;
  updaterName?: string;
  updateAt?: string;
}

export function queryAppSqls(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryAppSqlForm[]>(`/api/app/sql/query?${records.join('&')}`);
}

export function getAppSql(id: string) {
  return entityApi.getAxios().get<QueryAppSqlForm>(`/api/app/sql/get/${id}`);
}

export function createOrUpdateAppSql(params: QueryAppSqlForm) {
  return entityApi.getAxios().post<QueryResult>('/api/app/sql/createOrUpdate', params);
}

export function deleteAppSql(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/app/sql/isDelete/${id}`);
}