import type {RouteRecordNormalized} from 'vue-router';

export interface AppState {
  theme: string;
  navStyle:string;
  colorWeak: boolean;
  navbar: boolean;
  menu: boolean;
  topMenu: boolean;
  hideMenu: boolean;
  menuCollapse: boolean;
  footer: boolean;
  themeColor: string;
  menuWidth: number;
  menuCollapseWidth:number;
  globalSettings: boolean;
  device: string;
  tabBar: boolean;
  menuFromServer: boolean;
  serverMenu: RouteRecordNormalized[];

  [key: string]: unknown;
}
