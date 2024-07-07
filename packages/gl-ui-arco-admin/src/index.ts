import type { App, Plugin } from 'vue'
import { PluginUtil } from '@geelato/gl-ui'
import Demo from "./components/demo/Demo.vue";

// const i18nMessage = { en, cn }
const i18nMessage = {}

const component: Plugin = {
  install: function (Vue: App) {
    // @ts-ignore
    if (PluginUtil.markInstalledPlugin(Vue, 'gl-ui-arco-admin')) {
      return
    }
    Vue.component('Demo', Demo)
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
  i18nMessage
}
// 默认导出组件
export default component
