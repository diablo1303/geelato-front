import axios from 'axios';
import qs from 'query-string';
import {PageQueryRequest, PageQueryResponse, QueryResult} from '@/api/base'
import {SelectOptionData} from "@arco-design/web-vue/es/select/interface";


/* 组织分页查询 */
export function pageQueryOrg(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/org/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

/* 用户分页查询 */
export function pageQueryUser(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/user/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

/* 字典分页查询 */
export function pageQueryDict(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/dict/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

/* 字典项分页查询 */
export function pageQueryDictItem(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/dict/item/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

/* 权限分页查询 */
export function pageQueryPermission(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/permission/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

/* 组织用户查询 */
export function pageQueryOrgUser(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/org/user/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

/* 角色分页查询 */
export function pageQueryRole(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function pageQueryRoleApp(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/app/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function pageQueryRolePermission(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/permission/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function pageQueryRoleTreeNode(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/tree/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function pageQueryRoleUser(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/user/pageQuery', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

/* -----------------------------组织管理--------------------------- */
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

export interface FilterOrgForm {
  id: string;
  pid: string;
  name: string;
  code: string;
  type: string;
  category: string;
  status: string;
  tenantCode: string;
  createAt: string[];
}

export function queryOrgs(params: QueryOrgForm) {
  return axios.get<QueryOrgForm[]>('/api/security/org/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryTrees(params: QueryOrgForm) {
  return axios.get<QueryOrgForm[]>('/api/security/org/queryTree', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getOrg(id: string) {
  return axios.get<QueryOrgForm>(`/api/security/org/get/${id}`);
}

export function createOrUpdateOrg(params: QueryOrgForm) {
  return axios.post<QueryResult>('/api/security/org/createOrUpdate', params);
}

export function deleteOrg(id: string) {
  return axios.delete<QueryResult>(`/api/security/org/isDelete/${id}`);
}

export function validateOrgCode(params: QueryOrgForm) {
  return axios.post<QueryResult>('/api/security/org/validate', params);
}

/* -----------------------------用户管理--------------------------- */
export interface QueryUserForm {
  id: string;
  name: string;
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
  description: string;
  tenantCode: string;
}

export interface FilterUserForm {
  id: string;
  name: string;
  sex: string;
  orgId: string;
  orgName: string;
  type: string;
  source: string;
  tenantCode: string;
  createAt: string[];
}

export function queryUsers(params: QueryUserForm) {
  return axios.get<QueryUserForm[]>('/api/security/user/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getUser(id: string) {
  return axios.get<QueryUserForm>(`/api/security/user/get/${id}`);
}

export function createOrUpdateUser(params: QueryUserForm) {
  return axios.post<QueryResult>('/api/security/user/createOrUpdate', params);
}

export function deleteUser(id: string) {
  return axios.delete<QueryResult>(`/api/security/user/isDelete/${id}`);
}

export function resetPassword(id: string) {
  return axios.post<QueryResult>(`/api/security/user/resetPwd/${id}`);
}

export function validateUserLoginName(params: QueryUserForm) {
  return axios.post<QueryResult>('/api/security/user/validate/loginName', params);
}

export function validateUserMobilePhone(params: QueryUserForm) {
  return axios.post<QueryResult>('/api/security/user/validate/mobilePhone', params);
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
}

export interface FilterDictForm {
  id: string;
  tenantCode: string;
  appId: string;
  dictName: string;
  dictCode: string;
  enableStatus: string;
  createAt: string[];
}

export function queryDicts(params: QueryDictForm) {
  return axios.get<QueryDictForm[]>('/api/dict/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getDict(id: string) {
  return axios.get<QueryDictForm>(`/api/dict/get/${id}`);
}

export function createOrUpdateDict(params: QueryDictForm) {
  return axios.post<QueryResult>('/api/dict/createOrUpdate', params);
}

export function deleteDict(id: string) {
  return axios.delete<QueryResult>(`/api/dict/isDelete/${id}`);
}

export function validateDictCode(params: QueryDictForm) {
  return axios.post<QueryResult>('/api/dict/validate', params);
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
  tenantCode: string;
}

export interface FilterDictItemForm {
  id: string;
  pid: string;
  dictId: string;
  itemCode: string;
  itemName: string;
  enableStatus: string;
  createAt: string[];
  tenantCode: string;
}

export function getDictItem(id: string) {
  return axios.get<QueryDictItemForm>(`/api/dict/item/get/${id}`);
}

export function createOrUpdateDictItem(params: QueryDictItemForm) {
  return axios.post<QueryResult>('/api/dict/item/createOrUpdate', params);
}

export function batchCreateOrUpdateDictItem(dictId: string, params: QueryDictItemForm[]) {
  return axios.post<QueryResult>(`/api/dict/item/batchCreateOrUpdate?dictId=${dictId}`, params);
}

export function deleteDictItem(id: string) {
  return axios.delete<QueryResult>(`/api/dict/item/isDelete/${id}`);
}

export function queryItemByDictCode(dictCode: string) {
  return axios.get<QueryDictItemForm[]>(`/api/dict/item/queryItemByDictCode/${dictCode}`);
}

export function validateDictItemCode(params: QueryDictItemForm) {
  return axios.post<QueryResult>('/api/dict/item/validate', params);
}

/* -----------------------------权限管理--------------------------- */
export interface QueryPermissionForm {
  id: string;
  name: string;
  text: string;
  description: string;
  tenantCode: string;
}

export interface FilterPermissionForm {
  id: string;
  name: string;
  text: string;
  tenantCode: string;
  createAt: string[]
}

export function queryPermissions(params: QueryPermissionForm) {
  return axios.get<QueryPermissionForm[]>('/api/security/permission/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getPermission(id: string) {
  return axios.get<QueryPermissionForm>(`/api/security/permission/get/${id}`);
}

export function createOrUpdatePermission(params: QueryPermissionForm) {
  return axios.post<QueryResult>('/api/security/permission/createOrUpdate', params);
}

export function deletePermission(id: string) {
  return axios.delete<QueryResult>(`/api/security/permission/isDelete/${id}`);
}

export function validatePermissionCode(params: QueryPermissionForm) {
  return axios.post<QueryResult>('/api/security/permission/validate', params);
}

/* -----------------------------用户组织关联表--------------------------- */
export interface QueryOrgUserForm {
  id: string;
  userId: string;
  userName: string;
  orgId: string;
  orgName: string;
  defaultOrg: number;
}

export interface FilterOrgUserForm {
  id: string;
  userId: string;
  userName: string;
  orgId: string;
  orgName: string;
  defaultOrg: string;
  createAt: string[]
}

export function queryOrgUsers(params: PageQueryRequest) {
  return axios.get<QueryOrgUserForm[]>('/api/security/org/user/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getOrgUser(id: string) {
  return axios.get<QueryOrgUserForm>(`/api/security/org/user/get/${id}`);
}

export function insertOrgUser(params: QueryOrgUserForm) {
  return axios.post<QueryResult>('/api/security/org/user/insert', params);
}

export function deleteOrgUser(id: string) {
  return axios.delete<QueryResult>(`/api/security/org/user/isDelete/${id}`);
}

/* -----------------------------角色管理--------------------------- */
export interface QueryRoleForm {
  id: string;
  name: string;
  code: string;
  type: string;
  enableStatus: number;
  seqNo: number;
  description: string;
  tenantCode: string;
}

export interface FilterRoleForm {
  id: string;
  name: string;
  code: string;
  type: string;
  enableStatus: string;
  createAt: string[];
  tenantCode: string;
}

export function getRole(id: string) {
  return axios.get<QueryRoleForm>(`/api/security/role/get/${id}`);
}

export function createOrUpdateRole(params: QueryRoleForm) {
  return axios.post<QueryResult>('/api/security/role/createOrUpdate', params);
}

export function deleteRole(id: string) {
  return axios.delete<QueryResult>(`/api/security/role/isDelete/${id}`);
}

export function validateRoleCode(params: QueryRoleForm) {
  return axios.post<QueryResult>('/api/security/role/validate', params);
}

/* -----------------------------user app--------------------------- */
export interface QueryRoleAppForm {
  id: string;
  roleId: string;
  roleName: string;
  appId: string;
  appName: string;
  tenantCode: string;
}

export interface QueryAppForm {
  id: string;
  name: string;
}

export interface FilterRoleAppForm {
  id: string;
  roleId: string;
  roleName: string;
  appId: string;
  appName: string;
  tenantCode: string;
  createAt: string[]
}

export function queryApps(params: QueryAppForm) {
  return axios.get<QueryAppForm[]>('/api/app/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getRoleApp(id: string) {
  return axios.get<QueryRoleAppForm>(`/api/security/role/app/get/${id}`);
}

export function insertRoleApp(params: QueryRoleAppForm) {
  return axios.post<QueryResult>('/api/security/role/app/insert', params);
}

export function deleteRoleApp(id: string) {
  return axios.delete<QueryResult>(`/api/security/role/app/isDelete/${id}`);
}

/* -----------------------------role permission--------------------------- */
export interface QueryRolePermissionForm {
  id: string;
  roleId: string;
  roleName: string;
  permissionId: string;
  permissionName: string;
  tenantCode: string;
}

export interface FilterRolePermissionForm {
  id: string;
  roleId: string;
  roleName: string;
  permissionId: string;
  permissionName: string;
  tenantCode: string;
  createAt: string[]
}

export function getRolePermission(id: string) {
  return axios.get<QueryRolePermissionForm>(`/api/security/role/permission/get/${id}`);
}

export function insertRolePermission(params: QueryRolePermissionForm) {
  return axios.post<QueryResult>('/api/security/role/permission/insert', params);
}

export function deleteRolePermission(id: string) {
  return axios.delete<QueryResult>(`/api/security/role/permission/isDelete/${id}`);
}

/* -----------------------------role tree node--------------------------- */
export interface QueryRoleTreeNodeForm {
  id: string;
  roleId: string;
  roleName: string;
  treeNodeId: string;
  treeNodeText: string;
  title: string;
  tenantCode: string;
}

export interface FilterRoleTreeNodeForm {
  id: string;
  roleId: string;
  roleName: string;
  treeNodeId: string;
  treeNodeText: string;
  title: string;
  tenantCode: string;
  createAt: string[]
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
  flag: string;
  description: string;
  tenantCode: string;
}

export function queryTreeNodes(params: QueryTreeNodeForm) {
  return axios.get<QueryTreeNodeForm[]>('/api/treeNode/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getRoleTreeNode(id: string) {
  return axios.get<QueryRoleTreeNodeForm>(`/api/security/role/tree/get/${id}`);
}

export function insertRoleTreeNode(params: QueryRoleTreeNodeForm) {
  return axios.post<QueryResult>('/api/security/role/tree/insert', params);
}

export function deleteRoleTreeNode(id: string) {
  return axios.delete<QueryResult>(`/api/security/role/tree/isDelete/${id}`);
}

/* -----------------------------role user--------------------------- */
export interface QueryRoleUserForm {
  id: string;
  roleId: string;
  roleName: string;
  userId: string;
  userName: string;
  tenantCode: string;
}

export interface FilterRoleUserForm {
  id: string;
  roleId: string;
  roleName: string;
  userId: string;
  userName: string;
  tenantCode: string;
  createAt: string[]
}

export function getRoleUser(id: string) {
  return axios.get<QueryRoleUserForm>(`/api/security/role/user/get/${id}`);
}

export function insertRoleUser(params: QueryRoleUserForm) {
  return axios.post<QueryResult>('/api/security/role/user/insert', params);
}

export function deleteRoleUser(id: string) {
  return axios.delete<QueryResult>(`/api/security/role/user/isDelete/${id}`);
}

const querySelectOptions = async (dictCode: string) => {
  let selectOptions: SelectOptionData[] = [];
  try {
    const {data} = await queryItemByDictCode(dictCode);
    if (data != null && data.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of data) {
        selectOptions.push({'value': item.itemCode, 'label': item.itemName, 'disabled': item.enableStatus !== 1});
      }
    }
  } catch (err) {
    console.log(err);
    selectOptions = [];
  }
  return selectOptions;
}
export {querySelectOptions};