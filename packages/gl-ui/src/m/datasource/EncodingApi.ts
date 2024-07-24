import {entityApi} from "./EntityApi";
import utils from '../utils/Utils';
import type {PageQueryResponse, QueryResult} from "./Base";

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
  // 顺序时，是否补位0
  coverPos: boolean;
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

/**
 * 分页查询
 * @param params
 */
export function pageQueryEncoding(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/encoding/pageQuery?${records.join('&')}`);
}

/**
 * 条件查询
 * @param params
 */
export function queryEncodings(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryEncodingForm[]>(`/api/encoding/query?${records.join('&')}`);
}

/**
 * 单条查询
 * @param id
 */
export function getEncoding(id: string) {
  return entityApi.getAxios().get<QueryEncodingForm>(`/api/encoding/get/${id}`);
}

/**
 * 创建或更新
 * @param params
 */
export function createOrUpdateEncoding(params: QueryEncodingForm) {
  return entityApi.getAxios().post<QueryResult>('/api/encoding/createOrUpdate', params);
}

/**
 * 删除
 * @param id
 */
export function deleteEncoding(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/encoding/isDelete/${id}`);
}

/**
 * 获取一个新的编码，如需要使用系统编码app，需在参数中传入appId
 * @param id 编码ID
 * @param argumentParam params参数
 * @param argumentBody body参数，优先级高于params参数
 */
export function generateCode(id: string, argumentParam?: Record<string, any>, argumentBody?: Record<string, any>) {
  const records = utils.getUrlParams(argumentParam || {});
  return entityApi.getAxios().post(`/api/encoding/generate/${id}?${records.join('&')}`, argumentBody || {});
}