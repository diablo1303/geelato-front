import {entityApi} from "./EntityApi";

/* 过滤条件 */
export interface PageQueryFilter {
  id: string;
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

/* 返回结果 */
export interface QueryResult {
  data: any;
  msg: string;
  code: number;
  status: string;
}

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
  const paras = [];
  for (const key in params) {
    paras.push(`${key}=${params[key]}`);
  }
  return entityApi.getAxios().get<PageQueryResponse>(`/api/security/user/pageQuery?${paras.join('&')}`);
}
