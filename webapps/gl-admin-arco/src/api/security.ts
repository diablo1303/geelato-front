import axios from 'axios';
import qs from 'query-string';
import {PageQueryRequest, PageQueryResponse, QueryResult} from '@/api/base'
import {Message, SelectOptionData} from "@arco-design/web-vue";
import {QueryTableColumnForm} from "@/api/model";
import {exportDictionary} from "@/api/attachment";


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

export function pageQueryUserOf(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/user/pageQueryOf', {
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

export function pageQueryOrgUserOf(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/org/user/pageQueryOf', {
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

export function pageQueryOfRole(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/pageQueryOf', {
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

export function pageQueryRoleAppOf(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/app/pageQueryOf', {
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

export function pageQueryRolePermissionOf(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/permission/pageQueryOf', {
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

export function pageQueryRoleTreeNodeOf(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/tree/pageQueryOf', {
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

export function pageQueryRoleUserOf(params: PageQueryRequest) {
  return axios.get<PageQueryResponse>('/api/security/role/user/pageQueryOf', {
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

export function queryOrgsByParams(params: Record<string, any>) {
  return axios.post<QueryOrgForm[]>('/api/security/org/queryByParams', params);
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

export interface FilterUserForm {
  id: string;
  name: string;
  loginName: string;
  enName: string;
  jobNumber: string;
  sex: string;
  orgId: string;
  orgName: string;
  type: string;
  source: string;
  enableStatus: string;
  tenantCode: string;
  cooperatingOrgId: string;
  createAt: string[];
}

export function queryUsers(params: QueryUserForm) {
  return axios.get<QueryUserForm[]>('/api/security/user/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function queryUsersByParams(params: Record<string, any>) {
  return axios.post<QueryUserForm[]>('/api/security/user/queryByParams', params);
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

export function validateUserParams(type: string, params: QueryUserForm) {
  return axios.post<QueryResult>(`/api/security/user/validate/${type}`, params);
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
  appId: string;
  tenantCode: string;
  children?: QueryDictItemForm[];
}

export interface FilterDictItemForm {
  id: string;
  pid: string;
  dictId: string;
  itemCode: string;
  itemName: string;
  enableStatus: string;
  createAt: string[];
  appId: string;
  tenantCode: string;
}

export function queryDictItems(params: QueryDictItemForm) {
  return axios.get<QueryDictItemForm[]>('/api/dict/item/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function getDictItem(id: string) {
  return axios.get<QueryDictItemForm>(`/api/dict/item/get/${id}`);
}

export function createOrUpdateDictItem(params: QueryDictItemForm) {
  return axios.post<QueryResult>('/api/dict/item/createOrUpdate', params);
}

export function batchCreateOrUpdateDictItem(dictId: string, parentId: string, params: QueryDictItemForm[]) {
  return axios.post<QueryResult>(`/api/dict/item/batchCreateOrUpdate?dictId=${dictId}&parentId=${parentId}`, params);
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

export function createDictAndItems(params: QueryDictForm) {
  return axios.post<QueryResult>('/api/dict/item/createDictAndItems', params);
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

export interface FilterPermissionForm {
  id: string;
  name: string;
  code: string;
  type: string;
  object: string;
  rule: string;
  description: string;
  appId: string;
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
  tenantCode: string;
}

export interface FilterOrgUserForm {
  id: string;
  userId: string;
  userName: string;
  orgId: string;
  orgName: string;
  defaultOrg: string;
  tenantCode: string;
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

export interface FilterRoleForm {
  id: string;
  name: string;
  code: string;
  type: string;
  enableStatus: string;
  createAt: string[];
  appId: string;
  tenantCode: string;
}

export function queryRoles(params: Record<string, any>) {
  return axios.get<QueryRoleForm[]>('/api/security/role/query', {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
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
  appIds?: string;
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

export function getRoleApp(id: string) {
  return axios.get<QueryRoleAppForm>(`/api/security/role/app/get/${id}`);
}

export function insertRoleApp(params: QueryRoleAppForm) {
  return axios.post<QueryResult>('/api/security/role/app/insert', params);
}

export function deleteRoleApp(id: string) {
  return axios.delete<QueryResult>(`/api/security/role/app/isDelete/${id}`);
}

export function deleteRoleOfApp(appId: string, roleId: string) {
  return axios.delete<QueryResult>(`/api/security/role/app/isDelete/${appId}/${roleId}`);
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

export interface FilterRolePermissionForm {
  id: string;
  roleId: string;
  roleName: string;
  permissionId: string;
  permissionName: string;
  appId: string;
  tenantCode: string;
  createAt: string[]
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
  return axios.get<QueryRolePermissionForm>(`/api/security/role/permission/get/${id}`);
}

export function insertRolePermission(params: QueryRolePermissionForm) {
  return axios.post<QueryResult>('/api/security/role/permission/insert', params);
}

export function deleteRolePermission(id: string) {
  return axios.delete<QueryResult>(`/api/security/role/permission/isDelete/${id}`);
}

export function queryTableRolePermissions(type: string, object: string, params: PageQueryRequest) {
  return axios.get<QueryTableRolePermissionClassifyForm>(`/api/security/role/permission/queryTable/${type}/${object}`, {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function insertTableRolePermission(params: QueryRolePermissionForm) {
  return axios.post<QueryResult>('/api/security/role/permission/insertTable', params);
}

export function insertTableRoleViewPermission(params: QueryRolePermissionForm) {
  return axios.post<QueryResult>('/api/security/role/permission/insertTable/view', params);
}

export function resetDefaultPermission(type: string, object: string, appId: string) {
  return axios.post<QueryResult>(`/api/security/permission/default/${type}/${object}?appId=${appId}`, {});
}

export function queryColumnRolePermissions(type: string, object: string, params: PageQueryRequest) {
  return axios.get<QueryColumnRolePermissionForm>(`/api/security/role/permission/queryColumn/${type}/${object}`, {
    params, paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function insertColumnRolePermission(params: Record<string, boolean | string>) {
  return axios.post<QueryResult>('/api/security/role/permission/insertColumn', params);
}

/* -----------------------------role tree node--------------------------- */
export interface QueryRoleTreeNodeForm {
  id: string;
  roleId: string;
  roleName: string;
  treeNodeId: string;
  treeNodeText: string;
  title: string;
  appId: string;
  tenantCode: string;
}

export interface FilterRoleTreeNodeForm {
  id: string;
  roleId: string;
  roleName: string;
  treeNodeId: string;
  treeNodeText: string;
  title: string;
  appId: string;
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
  appId: string;
  tenantCode: string;
  children?: QueryTreeNodeForm[];
  isSelected?: boolean;
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

export function deleteRoleTreeNodeById(roleId: string, treeNodeId: string) {
  return axios.delete<QueryResult>(`/api/security/role/tree/isDelete/${roleId}/${treeNodeId}`);
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

export function queryRoleByUser(userId: string, appId: string, tenantCode: string) {
  return axios.get<QueryRoleForm[]>(`/api/security/role/user/queryRoles/${userId}?appId=${appId}&tenantCode=${tenantCode}`);
}

export function insertRoleUser(params: QueryRoleUserForm) {
  return axios.post<QueryResult>('/api/security/role/user/insert', params);
}

export function switchRoleUser(params: QueryRoleUserForm) {
  return axios.post<QueryResult>('/api/security/role/user/switch', params);
}

export function deleteRoleUser(id: string) {
  return axios.delete<QueryResult>(`/api/security/role/user/isDelete/${id}`);
}

export const querySelectOptions = async (dictCode: string) => {
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
      const itemData = await queryDictItems({dictId: dictData.data.id} as QueryDictItemForm);
      itemData.data.forEach((item: QueryDictItemForm) => {
        // @ts-ignore
        item.enableStatus = item.enableStatus === 1 ? '启用' : '禁用';
      });
      // 导出
      await exportDictionary(dictData.data.dictName, dictData.data, [{"dictItem": itemData.data}]);
    } catch (err) {
      console.log(err);
    }
  } else {
    Message.warning("导出时，数据字典主键不能为空！");
  }
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
