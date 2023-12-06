import {type ComponentCustomProperties} from "vue";
import axios from 'axios';
import {UserState} from '@/store/modules/user/types';
import {RouteRecordNormalized} from "vue-router";
import {QueryResult} from "@/api/base";
import {getToken} from "@/utils/auth";
// eslint-disable-next-line import/no-unresolved
import globalConfig from "@/config/globalConfig";

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

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

export function getSystemConfig(params: Record<string, any>) {
  const token = getToken();
  if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  return axios.get<QueryResult>(`/api/config`, params);
}

/**
 * 系统参数配置
 * @param params
 */
export const getSysConfig = async (global: ComponentCustomProperties & Record<string, any>, params?: Record<string, string>) => {
  try {
    const {data} = await getSystemConfig({
      appId: params && params.appId || '',
      tenantCode: params && params.tenantCode || ''
    });
    const config = data.code === globalConfig.interceptorCode ? data.data : data;
    if (config && global) {
      global.$gl = global.$gl || {};
      global.$gl.sys = config.sys || {};
      global.$gl.tenant = config.tenant || {};
      global.$gl.app = config.app || {};
    }
    console.log(global);
  } catch (err) {
    console.log(err);
  }
}