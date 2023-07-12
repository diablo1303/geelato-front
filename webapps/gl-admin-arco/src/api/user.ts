import axios from 'axios';
import {UserState} from '@/store/modules/user/types';
import {RouteRecordNormalized} from "vue-router";
import {QueryAppForm} from "@/api/service/app_service";

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