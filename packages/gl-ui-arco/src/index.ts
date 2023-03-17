import type {App, Plugin} from "vue";
import GlPage from './components/gl-page/GlPage.vue'
import GlEntityTablePlus from "./components/gl-entity-table-plus/index.vue";
import GlEntityTree from "./components/gl-entity-tree/GlEntityTree.vue";
import GlEntityForm from "./components/gl-entity-form/index.vue";
import GlFormRowLayout from "./components/gl-row-layout/index.vue";
import GlCard from "./components/gl-card/index.vue";
import GlFormRow from "./components/gl-form-row/GlFormRow.vue";
import GlFormCol from "./components/gl-form-col/GlFormCol.vue";
import en from "./locale/en-US";
import cn from "./locale/zh-CN";
import {PluginUtil} from "@geelato/gl-ui";

const i18nMessage = {en, cn};
const component: Plugin = {
    install: function (app: App) {
        // @ts-ignore
        if (PluginUtil.markInstalledPlugin(app, "gl-ui-arco")) {
            return;
        }
        app.component("GlPage", GlPage);
        app.component("GlEntityTablePlus", GlEntityTablePlus);
        app.component(GlEntityTree.name, GlEntityTree)
        app.component(GlEntityForm.name, GlEntityForm)
        app.component(GlCard.name, GlCard)
        app.component(GlFormRowLayout.name, GlFormRowLayout)
        app.component(GlFormRow.name, GlFormRow)
        app.component(GlFormCol.name, GlFormCol)
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

export {i18nMessage};
// 默认导出组件
export default component;
