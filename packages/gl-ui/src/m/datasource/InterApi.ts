import type {PageQueryResponse, QueryResult} from "./Base";
import {entityApi} from "./EntityApi";
import utils from '../utils/Utils'

export interface QueryApiParamForm {
  id: string;
  apiId: string;
  paramType: string;
  name: string;
  dataType: string;
  required: boolean;
  demoValue: string;
  defaultValue: string;
  remark: string;
  appId: string;
  tenantCode: string;
  updateAt?: string;
  updaterName?: string;
}

export function pageQueryApiParams(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/script/api/param/pageQuery?${records.join('&')}`);
}

export function queryApiParams(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryApiParamForm[]>(`/api/script/api/param/query?${records.join('&')}`);
}

export function getApiParam(id: string) {
  return entityApi.getAxios().get<QueryApiParamForm>(`/api/script/api/param/get/${id}`);
}

export function createOrUpdateApiParam(params: QueryApiParamForm) {
  return entityApi.getAxios().post<QueryResult>('/api/script/api/param/createOrUpdate', params);
}

export function deleteApiParam(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/script/api/param/isDelete/${id}`);
}

export interface QueryApiForm {
  id: string;
  name: string;
  code: string;
  version: string;
  remark: string;
  groupName: string;
  sourceContent: string;
  releaseContent: string;
  enableStatus: number;
  appId: string;
  tenantCode: string;
  updateAt?: string;
  updaterName?: string;
  parameters?: QueryApiParamForm[];
}

export function pageQueryApis(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/script/api/pageQuery?${records.join('&')}`);
}

export function queryApis(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryApiForm[]>(`/api/script/api/query?${records.join('&')}`);
}

export function getApi(id: string) {
  return entityApi.getAxios().get<QueryApiForm>(`/api/script/api/get/${id}`);
}

export function createOrUpdateApi(params: QueryApiForm) {
  return entityApi.getAxios().post<QueryResult>('/api/script/api/createOrUpdate', params);
}

export function deleteApi(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/script/api/isDelete/${id}`);
}

export function validateApiCode(params: QueryApiForm) {
  return entityApi.getAxios().post<QueryResult>('/api/script/api/validate', params);
}