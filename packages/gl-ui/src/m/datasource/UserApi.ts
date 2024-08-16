import type {ComponentCustomProperties} from "vue";
import type {QueryResult} from "./Base";
import {entityApi} from "./EntityApi";
import type {RouteRecordNormalized} from 'vue-router';
import * as applicationApi from './ApplicationApi'
import * as securityApi from './SecurityApi'
import {getToken} from "../utils/Auth";

export type RoleType = '' | '*' | 'admin' | 'user';

export interface UserState {
  id?: string; // 主键
  name?: string; // 名称
  loginName?: string; // 登录名称
  jobNumber?: string; // 工号
  cooperatingOrgId?: string; // 合作单位
  avatar?: string; // 头像
  mobilePrefix?: string; // 手机区域编号
  mobilePhone?: string; // 手机号码
  email?: string; // 邮箱
  registrationDate?: string; // 注册时间
  personalWebsite?: string; //
  introduction?: string; //
  certification?: number; //
  job?: string; //
  jobName?: string; //
  location?: string; //
  locationName?: string; //
  orgId?: string; // 部门ID
  orgName?: string; // 部门名称
  companyId?: string; // 公司ID
  companyName?: string; // 公司名称
  corpId?: string; // 集团ID
  corpName?: string; // 集团名称
  description?: string; // 简介
  nationCode?: string; // 详细地址
  provinceCode?: string; // 详细地址
  cityCode?: string; // 详细地址
  address?: string; // 详细地址
  tenantCode?: string; // 租户
  role: RoleType; // 角色
}

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

/**
 * 登录
 * @param data
 */
export function login(data: LoginData) {
  return entityApi.getAxios().post<LoginRes>('/api/user/login', data);
}

/**
 * 登出
 */
export function logout() {
  return entityApi.getAxios().post<LoginRes>('/api/user/logout');
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return entityApi.getAxios().post<UserState>('/api/user/info');
}

/**
 * 获取用户菜单列表
 */
export function getMenuList() {
  return entityApi.getAxios().post<RouteRecordNormalized[]>('/api/user/menu');
}

/**
 * 更新用户头像
 * @param userId
 * @param formData
 */
export function uploadAvatar(userId: string, formData: FormData) {
  return entityApi.getAxios().post<UserState>(`/api/user/avatar/${userId}`, formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  });
}

export interface AccountUserInfo {
  description: string;
  address: string;
}

/**
 * 更新用户信息
 * @param userId
 * @param formData
 */
export function updateUserInfo(userId: string, formData: AccountUserInfo) {
  return entityApi.getAxios().post<UserState>(`/api/user/update/${userId}`, formData);
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
  return entityApi.getAxios().post<QueryResult>(`/api/user/forgetValid`, params);
}

export function forgetPasswordEdit(params: ResetPasswordForm) {
  return entityApi.getAxios().post<QueryResult>(`/api/user/forget`, params);
}

export interface AuthCodeForm {
  action: AuthCodeAction;
  validType: string;
  prefix: string;
  validBox: string;
  userId: string;
  authCode: string;
}

export interface BindAccountData {
  index: number;
  title: string;
  description: string;
  isNull: boolean;
}

/**
 * 获取验证码
 * @param params
 */
export function generateAuthCode(params: AuthCodeForm) {
  return entityApi.getAxios().post<QueryResult>(`/api/code/generate`, params);
}

export function validateUser(params: AuthCodeForm) {
  return entityApi.getAxios().post<QueryResult>(`/api/user/validate`, params);
}

export function bindAccount(params: AuthCodeForm) {
  return entityApi.getAxios().post<QueryResult>(`/api/user/bindAccount`, params);
}

/**
 * 获取系统参数配置
 * @param params
 */
export function getSystemConfig(params: Record<string, any>) {
  const token = getToken();
  if (token) entityApi.getAxios().defaults.headers.common.Authorization = `Bearer ${token}`;
  // @ts-ignore
  return entityApi.getAxios().get<QueryResult>(`/api/config?${Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&')}`);
}

/**
 * 系统参数配置
 * @param params
 */
export const getSysConfig = async (global: ComponentCustomProperties & Record<string, any>, userInfo?: Record<any, any>, params?: Record<string, string>) => {
  try {
    const token = getToken();
    const {data} = await getSystemConfig(params || {});
    const config = data.code === 20000 ? data.data : data;
    if (config && global) {
      global.$gl = global.$gl || {};
      // 系统配置信息
      global.$gl.cfg = global.$gl.cfg || {};
      global.$gl.cfg.sys = Object.assign(global.$gl.cfg.sys || {}, config.sys) || {};
      global.$gl.cfg.tenant = Object.assign(global.$gl.cfg.tenant || {}, config.tenant) || {};
      global.$gl.cfg.app = Object.assign(global.$gl.cfg.app || {}, config.app) || {};
      // 当前应用
      global.$gl.app = global.$gl.app || {};
      if (params?.appId && token) {
        const appData = await applicationApi.getApp(params?.appId);
        global.$gl.app = Object.assign(global.$gl.app, appData?.data || {});
      }
      // 用户信息
      global.$gl.user = global.$gl.user || userInfo || {};
      // 服务端未提供用户的公司信息时，在前端发起请求另行获取
      if (userInfo?.id && !userInfo?.corpId) {
        const resp = await securityApi.getUserCompany(userInfo.id)
        userInfo.corpId = resp.data?.id
        userInfo.corpName = resp.data?.name
      }
    }
    console.log(global);
  } catch (err) {
    console.log(err);
  }
}