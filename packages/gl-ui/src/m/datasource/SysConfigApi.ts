import type {PageQueryResponse, QueryResult} from "./Base";
import {entityApi} from "./EntityApi";
import utils from '../utils/Utils'

export interface QuerySysConfigForm {
  id: string;
  keyType: string | string[];
  configKey: string;
  valueType: string;
  configValue: string | number | boolean;
  configAssist?: string;
  remark: string;
  purpose: string;
  enableStatus: number;
  encrypted: boolean | number;
  appId: string;
  tenantCode: string;
}

/**
 * 分页查询
 * @param params
 */
export function pageQuerySysConfig(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/sys/config/pageQuery?${records.join('&')}`);
}

/**
 * 条件查询
 * @param params
 */
export function querySysConfigs(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QuerySysConfigForm[]>(`/api/sys/config/query?${records.join('&')}`);
}

/**
 * 单条获取
 * @param id
 * @param encrypt 是否解密
 */
export function getSysConfig(id: string, encrypt?: boolean) {
  return entityApi.getAxios().get<QuerySysConfigForm>(`/api/sys/config/get/${id}?encrypt=${encrypt === true}`);
}

/**
 * 创建或更新
 * @param params
 */
export function createOrUpdateSysConfig(params: QuerySysConfigForm) {
  return entityApi.getAxios().post<QueryResult>('/api/sys/config/createOrUpdate', params);
}

/**
 * 删除
 * @param id
 */
export function deleteSysConfig(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/sys/config/isDelete/${id}`);
}

/**
 * 校验配置键
 * @param params
 */
export function validateSysConfigKey(params: QuerySysConfigForm) {
  return entityApi.getAxios().post<QueryResult>('/api/sys/config/validate', params);
}

/**
 * 根据配置键查询配置值
 * @param configKey
 */
export function getValueByKeys(configKey: string) {
  return entityApi.getAxios().get<string>(`/api/sys/config/getValue/${configKey}`);
}