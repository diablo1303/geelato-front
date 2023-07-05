import type {App, Plugin} from "vue";
import PageProvideProxy from "@geelato/gl-ui";
import GlPage from './components/gl-page/GlPage.vue'
import GlEntityTablePlus from "./components/gl-entity-table-plus/index.vue";
import GlEntityTree from "./components/gl-entity-tree/GlEntityTree.vue";
import GlEntityForm from "./components/gl-entity-form/index.vue";
import GlRowColLayout from "./components/gl-row-col-layout/GlRowColLayout.vue";
import GlCard from "./components/gl-card/index.vue";
import GlHidden from "./components/gl-hidden-area/GlHiddenArea.vue";
import GlTab from "./components/gl-tabs/GlTab.vue";
import GlTabs from "./components/gl-tabs/GlTabs.vue";
import GlDynamicSelect from "./components/gl-dynamic-select/GlDynamicSelect.vue";
import GlUserSelect from "./components/gl-user-select/GlUserSelect.vue";
import GlDict from "./components/gl-dict/GlDict.vue";
import en from "./locale/en-US";
import cn from "./locale/zh-CN";
import {PluginUtil} from "@geelato/gl-ui";
import './assets/style.css'
import GlColor from "./components/gl-color/GlColor.vue";
import GlEncode from "./components/gl-encode/GlEncode.vue";
import GlInstRuntime from "./components/gl-inst-runtime/GlInstRuntime.vue";
import GlInstsRuntime from "./components/gl-inst-runtime/GlInstsRuntime.vue";
import GlRefPage from "./components/gl-ref-page/GlRefPage.vue";

const i18nMessage = {en, cn};

const component: Plugin = {
    install: function (app: App) {
        // @ts-ignore
        if (PluginUtil.markInstalledPlugin(app, "gl-ui-arco")) {
            return;
        }
        app.component(GlDict.name, GlDict)
        app.component(GlPage.name, GlPage)
        app.component("GlEntityTablePlus", GlEntityTablePlus)
        // 表格注册多一个，作为子表单，在配置时减少一些不必要的配置项
        app.component("GlEntityTableSub", GlEntityTablePlus)
        app.component(GlRefPage.name, GlRefPage)
        app.component(GlEntityTree.name, GlEntityTree)
        app.component(GlEntityForm.name, GlEntityForm)
        app.component(GlCard.name, GlCard)
        app.component(GlHidden.name, GlHidden)
        app.component(GlRowColLayout.name, GlRowColLayout)
        app.component(GlTab.name, GlTab)
        app.component(GlTabs.name, GlTabs)
        app.component(GlUserSelect.name, GlUserSelect)
        app.component(GlDynamicSelect.name, GlDynamicSelect)
        app.component(GlColor.name, GlColor)
        app.component(GlEncode.name, GlEncode)
        app.component(GlInstRuntime.name, GlInstRuntime)
        app.component(GlInstsRuntime.name, GlInstsRuntime)
        // const i18n = createI18n({
        //   locale: localStorage.getItem("arco-locale") || "zh-CN",
        //   fallbackLocale: "en-US",
        //   allowComposition: true,
        //   messages: {
        //     "en-US": en,
        //     "zh-CN": cn,
        //   },
        // });
        // app.use(i18n);
    },
};

export {PageProvideProxy, i18nMessage};
// 默认导出组件
export default component;
