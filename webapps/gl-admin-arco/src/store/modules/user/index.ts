import {defineStore} from 'pinia';
import {getUserInfo, login as userLogin, LoginData, logout as userLogout,} from '@/api/user';
import {clearToken, clearValidUser, setToken} from '@/utils/auth';
import {removeRouteListener} from '@/utils/route-listener';
import {UserState} from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    name: undefined,
    loginName: undefined,
    jobNumber: undefined,
    cooperatingOrgId: undefined,
    avatar: undefined,
    mobilePrefix: undefined,
    mobilePhone: undefined,
    email: undefined,
    registrationDate: undefined,
    personalWebsite: undefined,
    introduction: undefined,
    certification: undefined,
    job: undefined,
    jobName: undefined,
    location: undefined,
    locationName: undefined,
    orgId: undefined,
    orgName: undefined,
    companyId: undefined,
    companyName: undefined,
    corpId: undefined,
    corpName: undefined,
    tenantCode: undefined,
    description: undefined,
    nationCode: undefined,
    provinceCode: undefined,
    cityCode: undefined,
    address: undefined,
    role: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return {...state};
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info(successCallBack?: any) {
      const res = await getUserInfo();
      if (res && res.data) {
        res.data.corpId = res.data.companyId;
        res.data.corpName = res.data.companyName;
      }
      this.setInfo(res.data);
      if (typeof successCallBack === "function") successCallBack();
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.token);
        clearValidUser();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('login fail:', err);
        clearToken();
        clearValidUser();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      clearValidUser();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
