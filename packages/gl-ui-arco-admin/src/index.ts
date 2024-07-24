import type {App, Plugin} from 'vue'
import {PluginUtil} from '@geelato/gl-ui'
import {use} from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {BarChart, LineChart, PieChart, RadarChart} from 'echarts/charts';
import {DataZoomComponent, GraphicComponent, GridComponent, LegendComponent, TooltipComponent,} from 'echarts/components';
import axios from './api/interceptor';
import globalConfig from './assets/globalConfig';
import GlAccountEmail from "./components/account/components/account-email.vue";
import GlAccountMobile from "./components/account/components/account-mobile.vue";
import GlAccountPassword from "./components/account/components/account-password.vue";
import GlAccountValid from "./components/account/components/account-valid.vue";
import GlManageAccount from "./components/account/manage/index.vue";
import GlUserAccount from "./components/account/user/index.vue";
import GlBanner from "./components/banner/index.vue";
import GlBreadcrumb from "./components/breadcrumb/index.vue";
import GlButtonTooltip from "./components/button-tooltip/index.vue";
import GlEcharts from "./components/chart/index.vue";
import GlCopyToClipboardAdmin from "./components/copy-to-clipboard/index.vue";
import GlDiff2Html from "./components/diff2html/index.vue";
import GlFooter from "./components/footer/index.vue";
import GlGlobalSetting from "./components/global-setting/index.vue";
import GlMonacoEditorAdmin from "./components/monaco/index.vue";
import GlNavBar from "./components/navbar/index.vue";
import GlNavTop from "./components/navtop/index.vue";
import GlResetPassword from "./components/reset-password/index.vue";
import GlUploadImageBase64 from "./components/upload-base64/image.vue";
import GlUploadBase64 from "./components/upload-base64/index.vue";
import GlUploadFile from "./components/upload-file/index.vue";
import GlVueCropping from "./components/vue-cropper/index.vue";
import useChartOption from "./hooks/chart-option";
import useLoading from "./hooks/loading";
import useLocale from "./hooks/locale";
import usePermission from "./hooks/permission";
import useRequest from "./hooks/request";
import useResponsive from "./hooks/responsive";
import useThemes from "./hooks/themes";
import useUser from "./hooks/user";
import useVisible from "./hooks/visible";
import {PageSizeOptions} from "./types/global";
import {setPinia, useAppStore, useTabBarStore, useTenantStore, useUserStore} from "./store/index";
import {
  ROUTER_ACCOUNT_ROUTE_PATH,
  ROUTER_DEFAULT_ROUTE,
  ROUTER_DEFAULT_ROUTE_ACCOUNT,
  ROUTER_IS_ACCOUNT,
  ROUTER_NOT_FOUND,
  ROUTER_REDIRECT_ROUTE_NAME,
  ROUTER_WHITE_LIST,
} from "./router/constants";
import localeEnUs from "./locale/en-US";
import localeZhCn from "./locale/zh-CN";
import {packageStatusOptions} from "./views/version/searchTable";
import GlApplicationList from "./views/application/list.vue";
import GlApplicationModel from "./views/application/model.vue";
import GlAppVersionCompareTabs from "./views/compare/tabsForm.vue";
import GlExportList from "./views/export/list.vue";
import GlModelTree from "./views/model/tree.vue";
import GlModelConnectList from "./views/model/connect/list.vue";
import GlModelTableList from "./views/model/table/list.vue";
import GlModelTableTabs from "./views/model/table/tableTabs.vue";
import GlDictionaryList from "./views/security/dictionary/list.vue";
import GlDictionaryEntryList from "./views/security/dictionary/item/list.vue";
import GlEncodingList from "./views/security/encoding/list.vue";
import GlFileTemplateList from "./views/security/file/list.vue";
import GlOrgList from "./views/security/org/list.vue";
import GlPermissionList from "./views/security/permission/list.vue";
import GlRoleList from "./views/security/role/list.vue";
import GlSystemConfigList from "./views/security/sysconfig/list.vue";
import GlUserList from "./views/security/user/list.vue";
import GlUserPermissionList from "./views/security/user/permission/list.vue";
import GlAppVersionForm from "./views/version/form.vue";
import GlAppVersionList from "./views/version/list.vue";
import GlAppVersionTabs from "./views/version/tabsForm.vue";

const i18nMessage = {localeEnUs, localeZhCn}

use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GraphicComponent,
]);

const component: Plugin = {
  install: function (Vue: App) {
    // @ts-ignore
    if (PluginUtil.markInstalledPlugin(Vue, 'gl-ui-arco-admin')) {
      return
    }
    Vue.component(GlAccountEmail.name, GlAccountEmail)
    Vue.component(GlAccountMobile.name, GlAccountMobile)
    Vue.component(GlAccountPassword.name, GlAccountPassword)
    Vue.component(GlAccountValid.name, GlAccountValid)
    Vue.component(GlManageAccount.name, GlManageAccount)
    Vue.component(GlUserAccount.name, GlUserAccount)
    Vue.component(GlBanner.name, GlBanner)
    Vue.component(GlBreadcrumb.name, GlBreadcrumb)
    Vue.component(GlButtonTooltip.name, GlButtonTooltip)
    Vue.component(GlEcharts.name, GlEcharts)
    Vue.component(GlCopyToClipboardAdmin.name, GlCopyToClipboardAdmin)
    Vue.component(GlDiff2Html.name, GlDiff2Html)
    Vue.component(GlFooter.name, GlFooter)
    Vue.component(GlGlobalSetting.name, GlGlobalSetting)
    Vue.component(GlMonacoEditorAdmin.name, GlMonacoEditorAdmin)
    Vue.component(GlNavBar.name, GlNavBar)
    Vue.component(GlNavTop.name, GlNavTop)
    Vue.component(GlResetPassword.name, GlResetPassword)
    Vue.component(GlUploadImageBase64.name, GlUploadImageBase64)
    Vue.component(GlUploadBase64.name, GlUploadBase64)
    Vue.component(GlUploadFile.name, GlUploadFile)
    Vue.component(GlVueCropping.name, GlVueCropping)

    Vue.component(GlApplicationList.name, GlApplicationList)
    Vue.component(GlApplicationModel.name, GlApplicationModel)
    Vue.component(GlAppVersionCompareTabs.name, GlAppVersionCompareTabs)
    Vue.component(GlExportList.name, GlExportList)
    Vue.component(GlModelTree.name, GlModelTree)
    Vue.component(GlModelConnectList.name, GlModelConnectList)
    Vue.component(GlModelTableList.name, GlModelTableList)
    Vue.component(GlModelTableTabs.name, GlModelTableTabs)
    Vue.component(GlDictionaryList.name, GlDictionaryList)
    Vue.component(GlDictionaryEntryList.name, GlDictionaryEntryList)
    Vue.component(GlEncodingList.name, GlEncodingList)
    Vue.component(GlFileTemplateList.name, GlFileTemplateList)
    Vue.component(GlOrgList.name, GlOrgList)
    Vue.component(GlPermissionList.name, GlPermissionList)
    Vue.component(GlRoleList.name, GlRoleList)
    Vue.component(GlSystemConfigList.name, GlSystemConfigList)
    Vue.component(GlUserList.name, GlUserList)
    Vue.component(GlUserPermissionList.name, GlUserPermissionList)
    Vue.component(GlAppVersionForm.name, GlAppVersionForm)
    Vue.component(GlAppVersionList.name, GlAppVersionList)
    Vue.component(GlAppVersionTabs.name, GlAppVersionTabs)

    // 不在这里注册多语言信息，而通过export { i18nMessage }导出，admin工程中引用
    // const i18n = createI18n({
    //   locale: localStorage.getItem("arco-locale") || "zh-CN",
    //   fallbackLocale: "en-US",
    //   allowComposition: true,
    //   messages: {
    //     "en-US": en,
    //     "zh-CN": cn,
    //   },
    // });
    // Vue.use(i18n);
  }
}

export {
  axios,
  globalConfig,
  // 自定义 locale
  i18nMessage,
  localeEnUs,
  localeZhCn,
  // 自定义 store
  useTenantStore,
  useAppStore,
  useUserStore,
  useTabBarStore,
  setPinia,
  // 自定义 hooks
  useChartOption,
  useLoading,
  useLocale,
  usePermission,
  useRequest,
  useResponsive,
  useThemes,
  useUser,
  useVisible,
  // 自定义 router
  ROUTER_ACCOUNT_ROUTE_PATH,
  ROUTER_DEFAULT_ROUTE,
  ROUTER_DEFAULT_ROUTE_ACCOUNT,
  ROUTER_IS_ACCOUNT,
  ROUTER_NOT_FOUND,
  ROUTER_REDIRECT_ROUTE_NAME,
  ROUTER_WHITE_LIST,
  // 自定义 options
  packageStatusOptions,
  PageSizeOptions
}

// 默认导出组件
export default component
