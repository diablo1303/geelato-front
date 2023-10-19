import axios from "axios";
import qs from "query-string";
import {PageQueryRequest, PageQueryResponse, QueryResult} from "@/api/base";

export interface QueryFileTemplateForm {
  id: string;
  title: string;
  useType: string;
  fileType: string;
  fileCode: string;
  template: string;
  templateRule: string;
  enableStatus: number;
  description: string;
  appId: string;
  tenantCode: string;
  fileCodeFormat?: string[];
}

export interface FilterFileTemplateForm {
  id: string;
  title: string;
  useType: string;
  fileType: string;
  fileCode: string;
  template: string;
  templateRule: string;
  enableStatus: string;
  description: string;
  appId: string;
  tenantCode: string;
  createAt: string[];
}

export function pageQueryFileTemplate(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/export/template/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryFileTemplates() {
  return axios.get<QueryFileTemplateForm[]>('/api/export/template/query');
}

export function getFileTemplate(id: string) {
  return axios.get<QueryFileTemplateForm>(`/api/export/template/get/${id}`);
}

export function createOrUpdateFileTemplate(params: QueryFileTemplateForm) {
  return axios.post<QueryResult>('/api/export/template/createOrUpdate', params);
}

export function deleteFileTemplate(id: string) {
  return axios.delete<QueryResult>(`/api/export/template/isDelete/${id}`);
}