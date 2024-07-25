import type {RouteLocationNormalized} from 'vue-router';
import {defineStore} from 'pinia';
import {isUtil} from '@geelato/gl-ui';
import {DEFAULT_ROUTE, REDIRECT_ROUTE_NAME} from '../../../router/constants';
import type {TabBarState, TagProps} from './types';

const formatTag = (route: RouteLocationNormalized): TagProps => {
  const {name, meta, fullPath, query} = route;
  return {
    // @ts-ignore
    title: meta.locale || '',
    name: String(name),
    fullPath,
    query,
    // @ts-ignore
    ignoreCache: meta.ignoreCache,
  };
};

const BAN_LIST = [REDIRECT_ROUTE_NAME];

const useTabBarStore = defineStore('tabBar', {
  state: (): TabBarState => ({
    cacheTabList: new Set([DEFAULT_ROUTE.value.name]),
    // @ts-ignore
    tagList: [DEFAULT_ROUTE.value],
  }),

  getters: {
    getTabList(): TagProps[] {
      return this.tagList;
    },
    getCacheList(): string[] {
      return Array.from(this.cacheTabList);
    },
  },

  actions: {
    updateTabList(route: RouteLocationNormalized) {
      if (BAN_LIST.includes(route.name as string)) return;
      this.tagList.push(formatTag(route));
      if (!route.meta.ignoreCache) {
        this.cacheTabList.add(route.name as string);
      }
    },
    deleteTag(idx: number, tag: TagProps) {
      this.tagList.splice(idx, 1);
      this.cacheTabList.delete(tag.name);
    },
    addCache(name: string) {
      if (isUtil.isString(name) && name !== '') this.cacheTabList.add(name);
    },
    deleteCache(tag: TagProps) {
      this.cacheTabList.delete(tag.name);
    },
    freshTabList(tags: TagProps[]) {
      this.tagList = tags;
      this.cacheTabList.clear();
      // 要先判断ignoreCache
      this.tagList
        .filter((el) => !el.ignoreCache)
        .map((el) => el.name)
        .forEach((x) => this.cacheTabList.add(x));
    },
    resetTabList() {
      // @ts-ignore
      this.tagList = [DEFAULT_ROUTE.value];
      this.cacheTabList.clear();
      this.cacheTabList.add(DEFAULT_ROUTE.value.name);
    },
  },
});

export default useTabBarStore;
