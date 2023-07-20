import axios from 'axios';
import {UserState} from '@/store/modules/user/types';
import {RouteRecordNormalized} from "vue-router";
import {QueryAppForm} from "@/api/application";
import {QueryResult} from "@/api/base";

const urlOrigin = import.meta.env.VITE_API_BASE_URL;

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

export interface QueryMenuForm {
  id: string;
  pid: string;
  appId: string;
  pageId: string;// 页面id
  flag: string;// menuItem
  icon: string;
  iconType: string;
  type: string;// folder formPage listPage freePage
  meta: string;// 路径
  treeEntity: string;
  extendEntity: string;
  text: string;
  seqNo: number;
  tenantCode: string;
  children?: QueryMenuForm[];
}

// export function login(data: LoginData) {
//   return axios.post<LoginRes>('/api/user/login', data);
// }
export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

/**
 * 获取应用信息
 * @param id
 */
export function getApp(id: string) {
  return axios.get<QueryAppForm>(`${urlOrigin}/api/app/get/${id}`);
}

/**
 * 获取应用菜单
 * @param params
 */
export function getMenus(params: QueryMenuForm) {
  return axios.post<QueryMenuForm[]>(`${urlOrigin}/api/user/menu`, params);
}

export type AuthCodeAction = 'forgetPassword' | 'validateUser' | 'updateMobile' | 'updatePassword' | 'updateEmail';

export interface ResetPasswordForm {
  action: AuthCodeAction;
  validType: string;
  prefix: string;
  validBox: string;
  userId: string;
  authCode: string;
  password: string;
  rPassword: string;
}

export function forgetPasswordValid(params: ResetPasswordForm) {
  return axios.post<QueryResult>(`/api/user/forgetValid`, params);
}

export function forgetPasswordEdit(params: ResetPasswordForm) {
  return axios.post<QueryResult>(`/api/user/forget`, params);
}

export interface AuthCodeForm {
  action: AuthCodeAction;
  validType: string;
  prefix: string;
  validBox: string;
  userId: string;
  authCode: string;
}

export function generateAuthCode(params: AuthCodeForm) {
  return axios.post<QueryResult>(`/api/code/generate`, params);
}

export function validateUser(params: AuthCodeForm) {
  return axios.post<QueryResult>(`/api/user/validate`, params);
}

export function bindAccount(params: AuthCodeForm) {
  return axios.post<QueryResult>(`/api/user/bindAccount`, params);
}

export interface BindAccountData {
  index: number;
  title: string;
  description: string;
  isNull: boolean;
}

export function abbreviateValue(value: string, type: string) {
  if (value) {
    if (type === '1') {
      value = `${value.substring(0, 3)}******${value.substring(value.length - 3)}`
    } else if (type === '2') {
      value = `${value.substring(0, 3)}****${value.substring(value.lastIndexOf('@'))}`;
    }
  }
  return value;
}