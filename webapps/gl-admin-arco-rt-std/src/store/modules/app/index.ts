import {defineStore} from 'pinia';
import {Notification, NotificationReturn} from '@arco-design/web-vue';
import type {RouteRecordNormalized} from 'vue-router';
import defaultSettings from '@/config/settings.json';
import {getMenuList} from '@/api/user';
import {AppState} from './types';

const useAppStore = defineStore('app', {
  state: (): AppState => ({...defaultSettings}),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return {...state};
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
      }
    },
    toggleNavStyle(navStyle: string) {
      this.navStyle = navStyle;
      document.body.setAttribute('gl-nav-style', navStyle);
      // 强行设置为亮色
      this.toggleTheme(false)
      // if(navStyle?.toLowerCase().indexOf('light')>=0){
      //   this.toggleTheme(false)
      // }else{
      //   this.toggleTheme(true)
      // }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      let notifyInstance: NotificationReturn | null = null;
      try {
        notifyInstance = Notification.info({
          id: 'menuNotice', // Keep the instance id the same
          content: 'loading',
          closable: true,
        });
        const {data} = await getMenuList();
        this.serverMenu = data;
        notifyInstance = Notification.success({
          id: 'menuNotice',
          content: 'success',
          closable: true,
        });
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        notifyInstance = Notification.error({
          id: 'menuNotice',
          content: 'error',
          closable: true,
        });
      }
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
});

export default useAppStore;
