import type {PageQueryResponse, QueryResult} from "./Base";
import type {QueryTableColumnForm} from "./ModelApi";
import {entityApi} from "./EntityApi";
import utils from '../utils/Utils'

export interface BusinessTypeData {
  name: string;
  type: string;
  format: string;
  remark: string;
  sign?: string;
}

export interface BusinessRuleData {
  columnName: string;
  type: string;
  rule: string;
  goal: string;
  priority: boolean;
  retain: boolean;
  order: number;
  remark: string;
  columnNameArr?: string[];
  ruleTableName?: string;
  ruleColumnName?: string[];
  ruleQueryOptions?: QueryTableColumnForm[];
  sign?: string;
}

export interface BusinessMetaData {
  tableName: string;
  columnName: string;
  evaluation: string;
  constValue: string;
  variableValue: string;
  expression: string;
  dictCode: string;
  primaryValue: string;
  remark: string;
  columnNameOptions?: QueryTableColumnForm[];
  primaryTableName?: string;
  primaryColumnNameGoal?: string;
  primaryColumnNameMatch?: string[];
  primaryValueOptions?: QueryTableColumnForm[];
  sign?: string;
}


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
  businessTypeData?: BusinessTypeData[] | string;
  businessRuleData?: BusinessRuleData[] | string;
  businessMetaData?: BusinessMetaData[] | string;
}

/**
 * 分页查询
 * @param params
 */
export function pageQueryFileTemplate(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/export/template/pageQuery?${records.join('&')}`);
}

/**
 * 条件查询
 * @param params
 */
export function queryFileTemplates(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryFileTemplateForm[]>(`/api/export/template/query?${records.join('&')}`);
}

/**
 * 单条查询
 * @param id
 */
export function getFileTemplate(id: string) {
  return entityApi.getAxios().get<QueryFileTemplateForm>(`/api/export/template/get/${id}`);
}

/**
 * 创建或更新
 * @param params
 */
export function createOrUpdateFileTemplate(params: QueryFileTemplateForm) {
  return entityApi.getAxios().post<QueryResult>('/api/export/template/createOrUpdate', params);
}

/**
 * 删除
 * @param id
 */
export function deleteFileTemplate(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/export/template/isDelete/${id}`);
}

/**
 * 根据模型数据生成文件
 * @param id 模板id
 * @param type template：模板文件，meta:元数据文件
 */
export function generateTemplateOrMetaFile(id: string, type: string) {
  return entityApi.getAxios().post<QueryResult>(`/api/export/template/generateFile/${id}`, {fileType: type});
}