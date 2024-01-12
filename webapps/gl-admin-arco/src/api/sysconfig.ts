import axios from "axios";
import qs from "query-string";
import {PageQueryRequest, PageQueryResponse, QueryResult} from "@/api/base";


export interface QuerySysConfigForm {
  id: string;
  keyType: string | string[];
  configKey: string;
  valueType: string;
  configValue: string;
  configAssist?: string;
  remark: string;
  enableStatus: number;
  appId: string;
  tenantCode: string;
}

export interface FilterSysConfigForm {
  id: string;
  keyType: string;
  configKey: string;
  valueType: string;
  configValue: string;
  remark: string;
  enableStatus: string;
  appId: string;
  tenantCode: string;
  createAt: string[];
}

export function pageQuerySysConfig(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/sys/config/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function querySysConfigs(params: QuerySysConfigForm) {
  return axios.get<QuerySysConfigForm[]>('/api/sys/config/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getSysConfig(id: string) {
  return axios.get<QuerySysConfigForm>(`/api/sys/config/get/${id}`);
}

export function createOrUpdateSysConfig(params: QuerySysConfigForm) {
  return axios.post<QueryResult>('/api/sys/config/createOrUpdate', params);
}

export function deleteSysConfig(id: string) {
  return axios.delete<QueryResult>(`/api/sys/config/isDelete/${id}`);
}

export function validateSysConfigKey(params: QuerySysConfigForm) {
  return axios.post<QueryResult>('/api/sys/config/validate', params);
}

export function getValueByKeys(configKey: string) {
  return axios.get<string>(`/api/sys/config/getValue/${configKey}`);
}