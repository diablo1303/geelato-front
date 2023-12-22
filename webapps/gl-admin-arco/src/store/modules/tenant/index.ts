import {defineStore} from 'pinia';
import {formDataFromFile} from "@/api/tenant";
import {checkFileExists, getDownloadUrlById} from "@/api/attachment";
import {TenantState} from "./types";
import defaultTenant from "./defaultTenant.json";

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
    features: undefined // 特性
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
    async queryTenant(fileName: string) {
      let data: TenantState = {};
      try {
        const res = await formDataFromFile(fileName);
        data = (res && res.data) ? JSON.parse(res.data) : defaultTenant;
        if (data.logo) {
          const url = getDownloadUrlById(data.logo, false);
          await checkFileExists(url, () => {
            data.logo = url;
          }, () => {
            data.logo = '';
          });
        }
        // @ts-ignore
        data.features = data.features ? JSON.parse(data.features) : [];
      } catch (e) {
        data = defaultTenant as unknown as TenantState;
      } finally {
        this.setTenant(data);
      }
    }
  },
});

export default useTenantStore;
