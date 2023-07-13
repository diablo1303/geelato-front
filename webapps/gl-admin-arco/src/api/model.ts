import axios from 'axios';
import qs from 'query-string';
import {PageQueryRequest, PageQueryResponse, QueryResult} from '@/api/base'

/* *************************** 数据库连接信息 ****************************** */
export interface QueryConnectForm {
  id: string;
  dbConnectName: string; // 连接名称
  dbSchema: string; // 数据库schema
  dbType: string; // 数据库类型 mysql|oracle|sqlserver|postgresql
  dbName: string; // 数据库名
  dbHostnameIp: string; // 主机名或IP
  dbPort: number; // 连接端口
  dbUserName: string; // 用户名
  dbPassword: string; // 密码
  enableStatus: number; // 状态
}

export interface FilterConnectForm {
  id: string;
  dbConnectName: string;
  dbName: string;
  dbType: string;
  enableStatus: string;
  createAt: string[];
}

export function pageQueryConnects(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/model/connect/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryConnects(params: PageQueryRequest) {
  return axios.get<QueryConnectForm[]>('/api/model/connect/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getConnect(id: string) {
  return axios.get<QueryConnectForm>(`/api/model/connect/get/${id}`);
}

export function createOrUpdateConnect(params: QueryConnectForm) {
  return axios.post<QueryResult>('/api/model/connect/createOrUpdate', params);
}

export function jdbcConnect(params: QueryConnectForm) {
  return axios.post<QueryResult>('/api/model/connect/jdbcConnect', params);
}

export function deleteConnect(id: string) {
  return axios.delete<QueryResult>(`/api/model/connect/isDelete/${id}`);
}

/* *************************** 实体信息 ****************************** */
export interface QueryTableForm {
  id: string;
  connectId: string; // 数据库连接 id
  title: string; // 名称(中文)
  tableName: string; // 数据库中的表名
  entityName: string; // 实体名称
  linked: number; // 已链接
  tableType: string; // 表格类型 table:数据库表;entity:实体;view:视图
  viewSql: string;// 视图语句
  enableStatus: number; // 状态
  seqNo: number; // 排序
  tableComment: string; // 备注
  description: string; // 补充描述
}

export interface FilterTableForm {
  id: string;
  title: string;
  connectId: string;
  tableName: string;
  entityName: string;
  tableType: string;
  enableStatus: string;
  linked: string;
  createAt: string[];
}

export function pageQueryTables(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/model/table/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryTables(params: PageQueryRequest) {
  return axios.get<QueryTableForm[]>('/api/model/table/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getTable(id: string) {
  return axios.get<QueryTableForm>(`/api/model/table/get/${id}`);
}

export function createOrUpdateTable(params: QueryTableForm) {
  return axios.post<QueryResult>('/api/model/table/createOrUpdate', params);
}

export function deleteTable(id: string) {
  return axios.delete<QueryResult>(`/api/model/table/isDelete/${id}`);
}

export function queryDefaultView(entityName: string) {
  return axios.get<string>(`/api/model/table/queryDefaultView/${entityName}`);
}

export function resetDefaultView(params: QueryTableForm) {
  return axios.post<QueryResult>('/api/model/table/resetDefaultView', params);
}

/**
 * 重置实体模型（从数据库同步至模型）
 * @param tableId
 */
export function resetModelFormTable(tableId: string) {
  return axios.post<QueryResult>(`/api/model/table/reset/${tableId}`);
}

/* *************************** 字段信息 ****************************** */
export interface QueryTableColumnForm {
  id: string; // *
  tableId: string; // 表id *
  abstractColumnExpressions: string; //
  fieldName: string;// 列名
  tableSchema: string; // 数据库名
  tableName: string; // 表名
  tableCatalog: string; // 表目录 *
  title: string; // 实体属性中文,中文名
  name: string; // 列名
  comment: string; // 备注
  ordinalPosition: number; // 次序
  defaultValue: string | number | string[]; // 默认值
  type: string; // 类型
  key: number | boolean; // 列键
  nullable: number | boolean; // 是否可空 YES_OR_NO
  uniqued: number | boolean; // 唯一约束
  dataType: string; // 数据类型
  selectType: string;// 数据类型
  extra: string; // 特别 auto_increment
  autoIncrement: number | boolean; // auto_increment
  charMaxLength: number; // 长度
  numericPrecision: number; // 整数位
  numericScale: number; // 小数位
  numericSigned: number | boolean; // 是否有符号，默认有，若无符号，则需在type中增加：unsigned
  datetimePrecision: string; // 时间类型
  enableStatus: number; // 状态
  linked: number; // 链接
  description: string; // 描述
  isRefColumn: boolean | number;  // 1-外表字段，默认0
  refLocalCol: string; // isRefColumn为true时，需要通过本表引用字段
  refTables: string; // 外表表名
  refColName: string; // 外表字段名称
  autoAdd: number | boolean | string | string[];
  autoName: string;
  seqNo: number;
}

export interface FilterTableColumnForm {
  id: string;
  tableId: string; // 表id
  tableName: string; // 表名
  title: string; // 实体属性中文,中文名
  name: string; // 列名
  dataType: string; // 数据类型
  selectType: string; // 数据类型
  key: string; // 列键
  nullable: string; // 是否可空 YES_OR_NO
  uniqued: string; // 唯一约束
  enableStatus: string; // 状态
  createAt: string[];
}

/* 分页查询 */
export function pageQueryTableColumns(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/model/table/column/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryTableColumns(params: PageQueryRequest) {
  return axios.get<QueryTableColumnForm[]>('/api/model/table/column/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryDefaultMeta() {
  return axios.get<QueryTableColumnForm[]>('/api/model/table/column/queryDefaultMeta');
}

export function getTableColumn(id: string) {
  return axios.get<QueryTableColumnForm>(`/api/model/table/column/get/${id}`);
}

export function createOrUpdateTableColumn(params: QueryTableColumnForm) {
  return axios.post<QueryResult>('/api/model/table/column/createOrUpdate', params);
}

export function deleteTableColumn(id: string) {
  return axios.delete<QueryResult>(`/api/model/table/column/isDelete/${id}`);
}

export interface DataTypeRadius {
  max: number;
  min: number;
  digit: number;
  unDigit: number;
  precision: number;
}

export interface ColumnSelectType {
  group: string;
  label: string;
  value: string;
  mysql: string;
  disabled: false;
  fixed: false;
  extent: number;
  radius: DataTypeRadius;
}

export function querySelectType() {
  return axios.get<ColumnSelectType[]>(`/api/model/table/column/selectType`);
}

/* *************************** 实体外键关系 ****************************** */
export interface QueryTableForeignForm {
  id: string;
  mainTable: string; // 主表表名
  mainTableCol: string; // 主表表名字段
  foreignTable: string; // 外键关联表表名
  foreignTableCol: string; // 外键关联表字段
  updateAction: string,// RESTRICT、NO ACTION、SET NULL、CASCADE
  deleteAction: string,
  enableStatus: number; // 状态
  description: string;// 备注
  seqNo: number;
}

export interface FilterTableForeignForm {
  id: string;
  mainTable: string;
  mainTableCol: string;
  foreignTable: string;
  foreignTableCol: string;
  enableStatus: string;
  createAt: string[];
}

/* 分页查询 */
export function pageQueryTableForeigns(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/model/table/foreign/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryTableForeigns(params: PageQueryRequest) {
  return axios.get<QueryTableForeignForm[]>('/api/model/table/foreign/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getTableForeign(id: string) {
  return axios.get<QueryTableForeignForm>(`/api/model/table/foreign/get/${id}`);
}

export function createOrUpdateTableForeign(params: QueryTableForeignForm) {
  return axios.post<QueryResult>('/api/model/table/foreign/createOrUpdate', params);
}

export function deleteTableForeign(id: string) {
  return axios.delete<QueryResult>(`/api/model/table/foreign/isDelete/${id}`);
}

/* *************************** 实体视图信息 ****************************** */
export interface QueryViewColumnForm {
  tableName: string;
  title: string;
  name: string;
  fieldName: string;
  type: string;
  comment: string;
  key: number | boolean;
  nullable: number | boolean;
  charMaxLength: number | string;
  precision: number;
  scale: number;
}

export interface QueryViewForm {
  id: string;
  connectId: string; // 数据库连接 id
  entityName: string; // 实体名称
  title: string; // 名称(中文)
  viewName: string; // 数据库中的表名
  viewType: string; // 视图类型 default:默认视图;custom:自定义视图
  viewConstruct: string;// 视图语句
  viewColumn: string;// 视图字段
  description: string; // 补充描述
  linked: number; // 已链接
  enableStatus: number; // 状态
  seqNo: number; // 排序
}

export interface FilterViewForm {
  id: string;
  connectId: string;
  entityName: string;
  title: string;
  viewName: string;
  viewType: string;
  enableStatus: string;
  linked: string;
  createAt: string[];
}

export function pageQueryViews(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/model/view/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryViews(params: PageQueryRequest) {
  return axios.get<QueryViewForm[]>('/api/model/view/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getView(id: string) {
  return axios.get<QueryViewForm>(`/api/model/view/get/${id}`);
}

export function createOrUpdateView(params: QueryViewForm) {
  return axios.post<QueryResult>('/api/model/view/createOrUpdate', params);
}

export function deleteView(id: string) {
  return axios.delete<QueryResult>(`/api/model/view/isDelete/${id}`);
}

/* --------------------------- 其他方法 --------------------------------- */
/**
 * 新建或更新表，不删除表字段（从模型同步至数据库）
 * @param entity 实体名称
 */
export function createOrUpdateModelToTable(entity: string) {
  return axios.post<QueryResult>(`/api/meta/ddl/table/${entity}`);
}

/**
 * 新建更新视图（发布）
 * @param view
 * @param viewSql 视图语句
 */
export function releaseMetaView(view: string, viewSql: string) {
  return axios.post<QueryResult>(`/api/meta/ddl/view/${view}`, {sql: viewSql});
}

/**
 * 验证sql语句正确性
 * @param connectId 数据连接id
 * @param viewSql 视图语句
 */
export function validateMetaView(connectId: string, viewSql: string) {
  return axios.post<QueryResult>(`/api/meta/ddl/view/valid/${connectId}`, {sql: viewSql});
}

/* --------------------- 方法，接口调用 ------------------- */
const queryDefaultMetas = async () => {
  let defaultMetas: string[] = [];
  try {
    const {data} = await queryDefaultMeta();
    if (data != null && data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        defaultMetas.push(item.name);
      }
    }
  } catch (err) {
    console.log(err);
    defaultMetas = [];
  }
  return defaultMetas;
}
const getSelectTypes = async () => {
  let selectTypes: ColumnSelectType[] = [];
  try {
    const {data} = await querySelectType();
    selectTypes = data;
  } catch (err) {
    console.log(err);
    selectTypes = [];
  }
  return selectTypes;
}
export {queryDefaultMetas, getSelectTypes};