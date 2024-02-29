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
  description?: string; // 简介
  nationCode?: string; // 详细地址
  provinceCode?: string; // 详细地址
  cityCode?: string; // 详细地址
  address?: string; // 详细地址
  tenantCode?: string; // 租户
  role: RoleType; // 角色
}
