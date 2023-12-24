export interface features {
  label: string;
  value: string;
}

export interface TenantState {
  id?: string; // 主键
  name?: string; // 名称
  lang?: string; // 语言
  copyright?: string; // 版本信息
  domain?: string; // 站点域名
  icpFilingNo?: string; // ICP备案号
  nsFilingNo?: string; // 网安备案号
  logo?: string; // 标志（长版带文字）
  logoIcon?: string; // 标志图标
  slogan?: string; // 口号标语
  welcome?: string; // 欢迎语
  features?: features[]; // 特性
  enableMutilLang?: boolean; // 启动多语言
}
