import {defineStore} from 'pinia';
import type {TenantState} from "@geelato/gl-ui";
import {authUtil, fileApi} from "@geelato/gl-ui";

const useTenantStore = defineStore('tenant', {
  state: (): TenantState => ({
    id: undefined, // 主键
    name: undefined, // 名称
    lang: undefined, // 语言
    copyright: undefined, // 版本信息
    domain: undefined, // 站点域名
    icpFilingNo: undefined, // ICP备案号
    nsFilingNo: undefined, // 网安备案号
    logo: undefined, // 标志（长版带文字）
    logoIcon: undefined, // 标志图标
    slogan: undefined, // 口号标语
    welcome: undefined, // 欢迎语
    features: undefined, // 特性
    enableMutilLang: undefined, // 启动多语言
  }),

  getters: {
    getTenant(state: TenantState): TenantState {
      return {...state};
    },
  },

  actions: {
    setTenant(partial: Partial<TenantState>) {
      this.$patch(partial);
    },
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async queryTenant(fileName?: string) {
      let data: TenantState = {};
      try {
        const fileNames = [];
        fileNames.push(window.location.hostname);
        fileNames.push(authUtil.getCurrentLocale());
        const res = await fileApi.formDataFromFile(fileName || fileNames.join('_'));
        data = (res && res.data) ? JSON.parse(res.data) : {};
        if (data.logoIcon && !(data.logoIcon.startsWith('data:') && data.logoIcon.indexOf(";base64") !== -1)) {
          const url = fileApi.getDownloadUrlById(data.logoIcon, false);
          await fileApi.checkFileExists(url, () => {
            data.logoIcon = url;
          }, () => {
            data.logoIcon = '';
          });
        }
        // @ts-ignore
        data.features = data.features ? JSON.parse(data.features) : [];
      } catch (err) {
        console.log(err);
      } finally {
        this.setTenant(data);
      }
    }
  },
});

export default useTenantStore;
