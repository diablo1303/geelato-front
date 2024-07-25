import type {defineComponent} from 'vue';
import type {NavigationGuard, RouteMeta} from 'vue-router';

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  // @ts-ignore
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

export interface AppRouteRecordRaw {
  path: string;
  name?: string | symbol;
  meta?: RouteMeta;
  redirect?: string;
  component: Component | string;
  children?: AppRouteRecordRaw[];
  alias?: string | string[];
  props?: Record<string, any>;
  beforeEnter?: NavigationGuard | NavigationGuard[];
  fullPath?: string;
  params?: Record<string, any>
}

export interface CurrentParameter {
  path: string
  pathValue: string;
  tenantCode: string;
  appId: string;
}