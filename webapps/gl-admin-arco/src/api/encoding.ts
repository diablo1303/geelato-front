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

/**
 * 生成随机数
 * @param extent
 * @constructor
 */
export function generateRandom(extent?: number) {
  extent = extent && extent > 0 ? extent : 32;
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < extent; i += 1) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

/**
 * 日期格式化
 * @param date
 * @param format
 */
export function formatTime(date: Date, format?: string) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  if (format) {
    return format.replace('yyyy', String(year)).replace('yy', String(year).substring(2, 4))
      .replace('MM', month).replace('dd', day).replace('HH', hours)
      .replace('mm', minutes).replace('ss', seconds);
  }
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}