import type {PageQueryResponse, QueryResult} from "./Base";
import type {QueryTableColumnForm} from "./Model";
import {entityApi} from "./EntityApi";
import utils from '../utils/Utils';

export interface QueryOrgForm {
  id: string;
  pid: string;
  seqNo: number;
  name: string;
  code: string;
  type: string; // 组织类型：department-部门，company-公司
  category: string; // 组织类别：inside-内部，outside-外部，virtule-虚拟
  status: number;
  description: string;
  isLeaf?: boolean | string;
  tenantCode: string;
}

export interface QueryUserForm {
  id: string;
  jobNumber: string;
  cooperatingOrgId: string;
  name: string;
  enName: string;
  loginName: string;
  seqNo: number;
  sex: number;
  salt: string;
  avatar: string;
  password: string;
  mobilePrefix: string;
  plainPassword: string;
  mobilePhone: string;
  telephone: string;
  orgId: string;
  orgName: string;
  email: string;
  post: string;
  provinceCode: string;
  cityCode: string;
  type: number;
  source: number;
  enableStatus: number;
  description: string;
  tenantCode: string;
}

export function queryOrgsByParams(params: Record<string, any>) {
  return entityApi.getAxios().post<QueryOrgForm[]>('/api/security/org/queryByParams', params);
}

export function queryTrees(pid: string) {
  return entityApi.getAxios().get<QueryOrgForm[]>(`/api/security/org/queryTree?pid=${pid}`);
}

export function queryUsersByParams(params: Record<string, any>) {
  return entityApi.getAxios().post<QueryUserForm[]>('/api/security/user/queryByParams', params);
}

export function pageQueryUser(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/user/pageQuery?${records.join('&')}`);
}

export function getUserCompany(id: string) {
  return entityApi.getAxios().get<QueryOrgForm>(`/api/security/user/getCompany/${id}`);
}

export function getOrgCompany(id: string) {
  return entityApi.getAxios().get<QueryOrgForm>(`/api/security/org/getCompany/${id}`);
}

/* -----------------------------字典管理 - 字典项--------------------------- */
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

export function queryDictItems(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryDictItemForm[]>(`/api/dict/item/query?${records.join('&')}`);
}

export function getDictItem(id: string) {
  return entityApi.getAxios().get<QueryDictItemForm>(`/api/dict/item/get/${id}`);
}

export function createOrUpdateDictItem(params: QueryDictItemForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/item/createOrUpdate', params);
}

export function batchCreateOrUpdateDictItem(dictId: string, parentId: string, params: QueryDictItemForm[]) {
  return entityApi.getAxios().post<QueryResult>(`/api/dict/item/batchCreateOrUpdate?dictId=${dictId}&parentId=${parentId}`, params);
}

export function deleteDictItem(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/dict/item/isDelete/${id}`);
}

export function queryItemByDictCode(dictCode: string) {
  return entityApi.getAxios().get<QueryDictItemForm[]>(`/api/dict/item/queryItemByDictCode/${dictCode}`);
}

export function validateDictItemCode(params: QueryDictItemForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/item/validate', params);
}

/* -----------------------------字典管理 - 字典--------------------------- */
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

export function queryDicts(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryDictForm[]>(`/api/dict/query?${records.join('&')}`);
}

export function getDict(id: string) {
  return entityApi.getAxios().get<QueryDictForm>(`/api/dict/get/${id}`);
}

export function createOrUpdateDict(params: QueryDictForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/createOrUpdate', params);
}

export function deleteDict(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/dict/isDelete/${id}`);
}

export function validateDictCode(params: QueryDictForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/validate', params);
}

export function createDictAndItems(params: QueryDictForm) {
  return entityApi.getAxios().post<QueryResult>('/api/dict/item/createDictAndItems', params);
}

/* -----------------------------权限管理--------------------------- */
export interface QueryPermissionForm {
  id: string;
  name: string;
  code: string;
  type: string;
  object: string;
  rule: string;
  description: string;
  appId: string;
  tenantCode: string;
  default?: boolean;
}

export interface QueryPermissionClassifyForm {
  type: string;
  data: QueryPermissionForm[];
}

export function queryPermissions(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryPermissionForm[]>(`/api/security/permission/query?${records.join('&')}`);
}

export function getPermission(id: string) {
  return entityApi.getAxios().get<QueryPermissionForm>(`/api/security/permission/get/${id}`);
}

export function createOrUpdatePermission(params: QueryPermissionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/permission/createOrUpdate', params);
}

export function deletePermission(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/permission/isDelete/${id}`);
}

export function validatePermissionCode(params: QueryPermissionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/permission/validate', params);
}

/* -----------------------------角色管理--------------------------- */
export interface QueryRoleForm {
  id: string;
  name: string;
  code: string;
  type: string;
  weight: number;
  enableStatus: number;
  seqNo: number;
  description: string;
  tenantCode: string;
  appId: string;
  appName?: string;
}

export function getRole(id: string) {
  return entityApi.getAxios().get<QueryRoleForm>(`/api/security/role/get/${id}`);
}

export function createOrUpdateRole(params: QueryRoleForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/createOrUpdate', params);
}

export function deleteRole(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/role/isDelete/${id}`);
}

export function validateRoleCode(params: QueryRoleForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/validate', params);
}

/* -----------------------------role permission--------------------------- */
export interface QueryRolePermissionForm {
  id: string;
  roleId: string;
  roleName: string;
  permissionId: string;
  permissionIds?: string;
  permissionName: string;
  appId: string;
  tenantCode: string;
}

export interface QueryTableRolePermissionForm {
  role: QueryRoleForm[];
  permission: QueryPermissionForm[];
  table: Record<string, boolean | string>[];
}

export interface QueryTableRolePermissionClassifyForm {
  role: QueryRoleForm[];
  permission: QueryPermissionClassifyForm[];
  table: Record<string, boolean | string>[];
}

export interface QueryColumnRolePermissionForm {
  role: QueryRoleForm[];
  column: QueryTableColumnForm[];
  table: Record<string, boolean | string>[];
}

export function getRolePermission(id: string) {
  return entityApi.getAxios().get<QueryRolePermissionForm>(`/api/security/role/permission/get/${id}`);
}

export function insertRolePermission(params: QueryRolePermissionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/permission/insert', params);
}

export function switchRolePermission(params: QueryRolePermissionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/permission/switch', params);
}

export function deleteRolePermission(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/role/permission/isDelete/${id}`);
}

export function queryTableRolePermissions(type: string, object: string, params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryTableRolePermissionClassifyForm>(`/api/security/role/permission/queryTable/${type}/${object}?${records.join('&')}`);
}

export function insertTableRolePermission(params: QueryRolePermissionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/permission/insertTable', params);
}

export function insertTableRoleViewPermission(params: QueryRolePermissionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/permission/insertTable/view', params);
}

export function resetDefaultPermission(type: string, object: string, appId: string) {
  return entityApi.getAxios().post<QueryResult>(`/api/security/permission/default/${type}/${object}?appId=${appId}`, {});
}

export function queryColumnRolePermissions(type: string, object: string, params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryColumnRolePermissionForm>(`/api/security/role/permission/queryColumn/${type}/${object}?${records.join('&')}`);
}

export function insertColumnRolePermission(params: Record<string, boolean | string>) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/permission/insertColumn', params);
}

/* ----------------------------- 编码管理 encoding --------------------------- */
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

export function queryEncodings(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryEncodingForm[]>(`/api/encoding/query?${records.join('&')}`);
}