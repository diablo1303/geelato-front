import axios from 'axios';
import {UserState} from '@/store/modules/user/types';
import {RouteRecordNormalized} from "vue-router";
import {QueryResult} from "@/api/base";


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