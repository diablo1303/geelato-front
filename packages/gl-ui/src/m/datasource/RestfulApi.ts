import type {PageQueryResponse, QueryResult} from "./Base";
import {entityApi} from "./EntityApi";
import utils from '../utils/Utils'

export interface QueryRestfulForm {
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

export function pageQueryRestfuls(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/restful/pageQuery?${records.join('&')}`);
}

export function queryRestfuls(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryRestfulForm[]>(`/api/restful/query?${records.join('&')}`);
}

export function getRestful(id: string) {
  return entityApi.getAxios().get<QueryRestfulForm>(`/api/restful/get/${id}`);
}

export function createOrUpdateRestful(params: QueryRestfulForm) {
  return entityApi.getAxios().post<QueryResult>('/api/restful/createOrUpdate', params);
}

export function deleteRestful(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/restful/isDelete/${id}`);
}

export function validateRestfulKeyName(params: QueryRestfulForm) {
  return entityApi.getAxios().post<QueryResult>('/api/restful/validate', params);
}

export interface QueryAppRestfulForm {
  id: string;
  appId: string;
  appName: string;
  restfulId: string;
  restfulTitle: string;
  restfulKey: string;
  restfulAppId: string;
  approvalStatus: string;
  approvalNeed: boolean;
  enableStatus: number;
  tenantCode: string;
  description: string;
  updaterName?: string;
  updateAt?: string;
}

export function queryAppRestfuls(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryAppRestfulForm[]>(`/api/app/restful/query?${records.join('&')}`);
}

export function getAppRestful(id: string) {
  return entityApi.getAxios().get<QueryAppRestfulForm>(`/api/app/restful/get/${id}`);
}

export function createOrUpdateAppRestful(params: QueryAppRestfulForm) {
  return entityApi.getAxios().post<QueryResult>('/api/app/restful/createOrUpdate', params);
}

export function deleteAppRestful(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/app/restful/isDelete/${id}`);
}