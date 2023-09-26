import {PageQueryRequest, PageQueryResponse, QueryResult} from "@/api/base";
import axios from "axios";
import qs from "query-string";


export interface QuerySysConfigForm {
  id: string;
  configKey: string;
  configValue: string;
  remark: string;
  enableStatus: number;
  appId: string;
  tenantCode: string;
}

export interface FilterSysConfigForm {
  id: string;
  configKey: string;
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