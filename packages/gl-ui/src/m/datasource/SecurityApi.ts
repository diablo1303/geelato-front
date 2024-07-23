import type {PageQueryResponse, QueryResult} from "./Base";
import type {QueryTableColumnForm} from "./ModelApi";
import {entityApi} from "./EntityApi";
import utils from '../utils/Utils';

/* 组织管理 */

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

export function pageQueryOrg(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/org/pageQuery?${records.join('&')}`);
}


export function queryOrgs(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryOrgForm[]>(`/api/security/org/query?${records.join('&')}`);
}

export function queryOrgsByParams(params: Record<string, any>) {
  return entityApi.getAxios().post<QueryOrgForm[]>('/api/security/org/queryByParams', params);
}

export function queryTrees(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryOrgForm[]>(`/api/security/org/queryTree?${records.join('&')}`);
}

export function getOrg(id: string) {
  return entityApi.getAxios().get<QueryOrgForm>(`/api/security/org/get/${id}`);
}

export function createOrUpdateOrg(params: QueryOrgForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/org/createOrUpdate', params);
}

export function deleteOrg(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/org/isDelete/${id}`);
}

export function validateOrgCode(params: QueryOrgForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/org/validate', params);
}

export function getOrgCompany(id: string) {
  return entityApi.getAxios().get<QueryOrgForm>(`/api/security/org/getCompany/${id}`);
}


/* 用户管理 */

export interface QueryUserForm {
  id: string;
  jobNumber: string;
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
  cooperatingOrgId: string;
}

export function pageQueryUser(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/user/pageQuery?${records.join('&')}`);
}

export function pageQueryUserOf(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/user/pageQueryOf?${records.join('&')}`);
}


export function queryUsers(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryUserForm[]>(`/api/security/user/query?${records.join('&')}`);
}

export function queryUsersByParams(params: Record<string, any>) {
  return entityApi.getAxios().post<QueryUserForm[]>('/api/security/user/queryByParams', params);
}

export function getUser(id: string) {
  return entityApi.getAxios().get<QueryUserForm>(`/api/security/user/get/${id}`);
}

export function createOrUpdateUser(params: QueryUserForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/user/createOrUpdate', params);
}

export function deleteUser(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/user/isDelete/${id}`);
}

export function resetPassword(id: string) {
  return entityApi.getAxios().post<QueryResult>(`/api/security/user/resetPwd/${id}`);
}

export function validateUserParams(type: string, params: QueryUserForm) {
  return entityApi.getAxios().post<QueryResult>(`/api/security/user/validate/${type}`, params);
}

export function getUserCompany(id: string) {
  return entityApi.getAxios().get<QueryOrgForm>(`/api/security/user/getCompany/${id}`);
}

/* 组织用户关联 */
export interface QueryOrgUserForm {
  id: string;
  userId: string;
  userName: string;
  orgId: string;
  orgName: string;
  defaultOrg: number;
  tenantCode: string;
}

export function pageQueryOrgUser(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/org/user/pageQuery?${records.join('&')}`);
}

export function pageQueryOrgUserOf(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/org/user/pageQueryOf?${records.join('&')}`);
}

export function queryOrgUsers(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryOrgUserForm[]>(`/api/security/org/user/query?${records.join('&')}`);
}

export function getOrgUser(id: string) {
  return entityApi.getAxios().get<QueryOrgUserForm>(`/api/security/org/user/get/${id}`);
}

export function insertOrgUser(params: QueryOrgUserForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/org/user/insert', params);
}

export function deleteOrgUser(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/org/user/isDelete/${id}`);
}

/* 权限管理 */
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

export function pageQueryPermission(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/permission/pageQuery?${records.join('&')}`);
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


/* 角色管理 */
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
  usedApp: number | boolean;
  appName?: string;
  appIds?: string;
}

export function pageQueryRole(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/pageQuery?${records.join('&')}`);
}

export function pageQueryOfRole(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/pageQueryOf?${records.join('&')}`);
}


export function queryRoles(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryRoleForm[]>(`/api/security/role/query?${records.join('&')}`);
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

/* 角色应用关联关系 */
export interface QueryRoleAppForm {
  id: string;
  roleId: string;
  roleName: string;
  appId: string;
  appName: string;
  tenantCode: string;
  appIds?: string;
}

export function pageQueryRoleApp(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/app/pageQuery?${records.join('&')}`);
}

export function pageQueryRoleAppOf(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/app/pageQueryOf?${records.join('&')}`);
}

export function getRoleApp(id: string) {
  return entityApi.getAxios().get<QueryRoleAppForm>(`/api/security/role/app/get/${id}`);
}

export function insertRoleApp(params: QueryRoleAppForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/app/insert', params);
}

export function deleteRoleApp(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/role/app/isDelete/${id}`);
}

export function deleteRoleOfApp(appId: string, roleId: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/role/app/isDelete/${appId}/${roleId}`);
}

/* 角色用户关联关系 */
export interface QueryRoleUserForm {
  id: string;
  roleId: string;
  roleName: string;
  userId: string;
  userName: string;
  tenantCode: string;
}

export function pageQueryRoleUser(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/user/pageQuery?${records.join('&')}`);
}

export function pageQueryRoleUserOf(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/user/pageQueryOf?${records.join('&')}`);
}

export function getRoleUser(id: string) {
  return entityApi.getAxios().get<QueryRoleUserForm>(`/api/security/role/user/get/${id}`);
}

export function queryRoleByUser(userId: string, appId: string, tenantCode: string) {
  return entityApi.getAxios().get<QueryRoleForm[]>(`/api/security/role/user/queryRoles/${userId}?appId=${appId}&tenantCode=${tenantCode}`);
}

export function insertRoleUser(params: QueryRoleUserForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/user/insert', params);
}

export function switchRoleUser(params: QueryRoleUserForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/user/switch', params);
}

export function deleteRoleUser(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/role/user/isDelete/${id}`);
}

/* 角色菜单关联关系 */
export interface QueryRoleTreeNodeForm {
  id: string;
  roleId: string;
  roleName: string;
  treeNodeId: string;
  treeNodeText: string;
  treeId: string;
  title: string;
  appId: string;
  tenantCode: string;
}

export interface QueryTreeNodeForm {
  id: string;
  treeEntity: string;
  treeId: string;
  parent: string;
  type: string;
  title: string;
  iconType: string;
  extendEntity: string;
  extendId: string;
  meta: string;
  url: string;// 外部链接
  flag: string;
  description: string;
  appId: string;
  tenantCode: string;
  children?: QueryTreeNodeForm[];
  isSelected?: boolean;
}

export function pageQueryRoleTreeNode(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/tree/pageQuery?${records.join('&')}`);
}

export function pageQueryRoleTreeNodeOf(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/tree/pageQueryOf?${records.join('&')}`);
}

export function queryTreeNodes(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<QueryTreeNodeForm[]>(`/api/treeNode/query?${records.join('&')}`);
}

export function getRoleTreeNode(id: string) {
  return entityApi.getAxios().get<QueryRoleTreeNodeForm>(`/api/security/role/tree/get/${id}`);
}

export function insertRoleTreeNode(params: QueryRoleTreeNodeForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/tree/insert', params);
}

export function deleteRoleTreeNode(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/role/tree/isDelete/${id}`);
}

export function deleteRoleTreeNodeById(roleId: string, treeNodeId: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/role/tree/isDelete/${roleId}/${treeNodeId}`);
}

export function deleteRoleTreeNodes(params: Record<string, any>) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/tree/delete', params);
}


/* 角色权限关联关系 */
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

export function pageQueryRolePermission(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/permission/pageQuery?${records.join('&')}`);
}

export function pageQueryRolePermissionOf(params: Record<string, any>) {
  const records = utils.getUrlParams(params);
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/role/permission/pageQueryOf?${records.join('&')}`);
}

export function getRolePermission(id: string) {
  return entityApi.getAxios().get<QueryRolePermissionForm>(`/api/security/role/permission/get/${id}`);
}

export function insertRolePermission(params: QueryRolePermissionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/permission/insert', params);
}

export function deleteRolePermission(id: string) {
  return entityApi.getAxios().delete<QueryResult>(`/api/security/role/permission/isDelete/${id}`);
}

export function switchRolePermission(params: QueryRolePermissionForm) {
  return entityApi.getAxios().post<QueryResult>('/api/security/role/permission/switch', params);
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


/**
 * 查询所有角色
 * @param params
 * @param successBack
 * @param failBack
 */
export const getRoleSelectOptions = async (params: Record<string, any>, successBack?: any, failBack?: any) => {
  try {
    const {data} = await queryRoles(params);
    if (successBack && typeof successBack === 'function') successBack(data);
  } catch (err) {
    if (failBack && typeof failBack === 'function') failBack(err);
  }
}
