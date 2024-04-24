import axios from "axios";
import qs from "query-string";
import {PageQueryRequest, PageQueryResponse, QueryResult} from "@/api/base";

export interface EncodingItem {
  // 基础
  id: string;
  itemType: string;
  seqNo: number;
  // 常量 constant
  constantValue: string;
  // 业务 business
  businessDict: string;
  // 日期 date
  dateType: string;
  // 序列号 serial
  serialDigit: number;
  serialType: string;
  // 参数 argument
  validate: boolean;
  errorMsg: string;
}

export interface QueryEncodingForm {
  id: string;
  title: string;
  template: string;
  separators: string;
  example: string;
  enableStatus: number;
  description: string;
  appId: string;
  tenantCode: string;
}

export interface FilterEncodingForm {
  id: string;
  title: string;
  template: string;
  example: string;
  enableStatus: string;
  description: string;
  appId: string;
  tenantCode: string;
  createAt: string[];
}

export function pageQueryEncoding(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/encoding/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryEncodings(params: QueryEncodingForm) {
  return axios.get<QueryEncodingForm[]>('/api/encoding/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getEncoding(id: string) {
  return axios.get<QueryEncodingForm>(`/api/encoding/get/${id}`);
}

export function createOrUpdateEncoding(params: QueryEncodingForm) {
  return axios.post<QueryResult>('/api/encoding/createOrUpdate', params);
}

export function deleteEncoding(id: string) {
  return axios.delete<QueryResult>(`/api/encoding/isDelete/${id}`);
}