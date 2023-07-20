export type RoleType = '' | '*' | 'admin' | 'user';

export interface UserState {
  id?: string; // 主键
  name?: string; // 名称
  loginName?: string; // 登录名称
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
  tenantCode?: string; // 租户
  role: RoleType; // 角色
}
