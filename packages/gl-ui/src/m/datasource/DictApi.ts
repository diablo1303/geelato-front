import {entityApi} from "./EntityApi";
import type {PageQueryResponse, QueryResult} from "./Base";
import * as fileApi from "./FileApi";
import utils from "../utils/Utils";

export interface QueryDictItemForm {
  id: string;
  pid: string;
  dictId: string;
  itemCode: string;
  itemName: string;
  itemRemark: string;
  enableStatus: number;
  seqNo: number;
  children?: QueryDictItemForm[];
  appId: string;
  tenantCode: string;
}

/**
 * 分页查询
 * @param params
 */
export function pageQueryDictItem(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/dict/item/pageQuery?${records.join('&')}`);
}

/**
 * 条件查询
 * @param params
 */
export function queryDictItems(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryDictItemForm[]>(`/api/dict/item/query?${records.join('&')}`);
}

/**
 * 单条查询
 * @param id
 */
export function getDictItem(id: string) {
  return entityApi.getAxios().get<QueryDictItemForm>(`/api/dict/item/get/${id}`);
}

/**
 * 创建或更新
 * @param params
 */
export function createOrUpdateDictItem(params: QueryDictItemForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/item/createOrUpdate', params);
}

/**
 * 批量创建或更新
 * @param dictId 字典ID
 * @param parentId 字典项父级id
 * @param params 字典项集合
 */
export function batchCreateOrUpdateDictItem(dictId: string, parentId: string, params: QueryDictItemForm[]) {
  return entityApi.getAxios().post<QueryResult>(`/api/dict/item/batchCreateOrUpdate?dictId=${dictId}&parentId=${parentId}`, params);
}

/**
 * 删除
 * @param id
 */
export function deleteDictItem(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/dict/item/isDelete/${id}`);
}

/**
 * 校验字典项编码
 * @param params
 */
export function validateDictItemCode(params: QueryDictItemForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/item/validate', params);
}

/**
 * 根据字典编码查询字典项
 * @param dictCode
 */
export function queryItemByDictCode(dictCode: string) {
  return entityApi.getAxios().get(`${entityApi.getAxios().defaults.baseURL}/api/dict/item/queryItemByDictCode/${dictCode}`)
}


export interface QueryDictForm {
  id: string;
  tenantCode: string;
  appId: string;
  dictName: string;
  dictCode: string;
  dictRemark: string;
  enableStatus: number;
  seqNo: number;
  dictItems?: QueryDictItemForm[]
}

/**
 * 分页查询
 * @param params
 */
export function pageQueryDict(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/dict/pageQuery?${records.join('&')}`);
}

/**
 * 条件查询
 * @param params
 */
export function queryDicts(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryDictForm[]>(`/api/dict/query?${records.join('&')}`);
}

/**
 * 单条查询
 * @param id
 */
export function getDict(id: string) {
  return entityApi.getAxios().get<QueryDictForm>(`/api/dict/get/${id}`);
}

/**
 * 创建或更新
 * @param params
 */
export function createOrUpdateDict(params: QueryDictForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/createOrUpdate', params);
}

/**
 * 删除
 * @param id
 */
export function deleteDict(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/dict/isDelete/${id}`);
}

/**
 * 校验字典编码
 * @param params
 */
export function validateDictCode(params: QueryDictForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/validate', params);
}

/**
 * 创建字典及字典项
 * @param params
 */
export function createDictAndItems(params: QueryDictForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/item/createDictAndItems', params);
}


/**
 * 导出 - 数据字典
 * @param fileName
 * @param map
 * @param list
 */
export const exportDictionary = async (fileName: string, map?: Record<string, any>, list?: any[]) => {
  // {"valueMap": {}, "valueMapList": [{"dictItem": []}]}
  const exportData = {"valueMap": map || {}, "valueMapList": list || []}
  console.log(exportData);
  try {
    const {data} = await fileApi.exportWps('data', '4942276091403440128', exportData, fileName || '字典管理数据导出');
    if (data && data.id) fileApi.fetchFileById(data.id);
  } catch (err) {
    throw new Error("导出失败！");
  }
}

/**
 * 导出数据字典
 * @param data
 */
export const exportDictAndItems = async (dictId: string) => {
  if (dictId) {
    try {
      // 字典
      const dictData = await getDict(dictId);
      // @ts-ignore
      dictData.data.enableStatus = dictData.data.enableStatus === 1 ? '启用' : '禁用';
      // 字典项
      const itemData = await queryDictItems({dictId: dictData.data.id});
      itemData.data.forEach((item: QueryDictItemForm) => {
        // @ts-ignore
        item.enableStatus = item.enableStatus === 1 ? '启用' : '禁用';
      });
      // 导出
      await exportDictionary(dictData.data.dictName, dictData.data, [{"dictItem": itemData.data}]);
    } catch (err) {
      throw new Error("导出失败！");
    }
  } else {
    throw new Error("导出时，数据字典主键不能为空！");
  }
}