import axios from 'axios';
import qs from 'query-string';

export interface SelectOption {
  value: string;
  label: string;
  children?: SelectOption[]
};

/* 过滤条件 */
export interface PageQueryFilter {
  id: string;
  number: number;
  name: string;
  count: number;
  status: 'online' | 'offline';
  createdTime: string;
}

/* 列表参数 */
export interface PageQueryRequest extends Partial<PageQueryFilter> {
  current: number;
  pageSize: number;
}

/* 列表返回结果 */
export interface PageQueryResponse {
  items: PageQueryFilter[];
  total: number;
}

/* 部门分页查询 */
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

/* 返回结果 */
export interface QueryResult {
  data: any;
  msg: string;
  code: number;
  status: string;
}

/* -----------------------------部门管理--------------------------- */
export interface QueryOrgForm {
  id: string;
  pid: string;
  seqNo: number;
  name: string;
  code: string;
  type: string;
  status: number;
  description: string;
}

export function queryOrgs() {
  return axios.get<QueryOrgForm[]>('/api/security/org/query');
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

/* -----------------------------字典管理 - 字典--------------------------- */
export interface QueryDictForm {
  id: string;
  tenantCode: string;
  dicName: string;
  dicCode: string;
  dicRemark: string;
  enableStatus: number;
  seqNo: number;
}

export function queryDicts(dicName: string) {
  return axios.get<QueryDictForm>('/api/dict/query');
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

/* -----------------------------字典管理 - 字典项--------------------------- */
export interface QueryDictItemForm {
  id: string;
  dictId: string;
  itemText: string;
  itemCode: string;
  dataRemark: string;
  enableStatus: number;
  seqNo: number;
}

export function getDictItem(id: string) {
  return axios.get<QueryDictItemForm>(`/api/dict/item/get/${id}`);
}

export function createOrUpdateDictItem(params: QueryDictItemForm) {
  return axios.post<QueryResult>('/api/dict/item/createOrUpdate', params);
}

export function deleteDictItem(id: string) {
  return axios.delete<QueryResult>(`/api/dict/item/isDelete/${id}`);
}

/* -----------------------------权限管理--------------------------- */
export interface QueryPermissionForm {
  id: string;
  name: string;
  text: string;
  description: string;
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

/* -----------------------------权限管理--------------------------- */
export interface QueryOrgUserForm {
  id: string;
  userId: string;
  userName: string;
  orgId: string;
  orgName: string;
  defaultOrg: number;
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