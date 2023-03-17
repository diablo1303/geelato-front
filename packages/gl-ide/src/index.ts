/*
 *  打包引用的入口
 */
import type {App, Plugin} from 'vue'
import GlPlugin from "./entity/GlPlugin";
import Panel from "./entity/Panel";
import EventNames from "./entity/Events";
import GlIde from './components/Index.vue'
import {reactive} from 'vue'
import Ide from "./entity/Ide";
import BaseDesignMeta from "./entity/meta/BaseDesignMeta";
import PropertyMeta from "./entity/meta/PropertyMeta";
import TypeEnums from "./entity/meta/TypeEnums";
import Page from "./entity/Page";
import {PluginUtil} from "@geelato/gl-ui";
import {useIdeStore} from "./stores/UseIdeStore";
import {useEntityStore} from "./stores/UseEntityStore";
import {useComponentStore} from "./stores/UseComponentStore";
import {useThemeStore} from "./stores/UseThemeStore";
import {useHistoryStore} from "./stores/UseHistoryStore";
import {useAppStore} from "./stores/UseAppStore";
import uiLibAdapter from "./utils/UiLibAdapter";
import './assets/gl-root.css'
import './assets/gl-table-form.css'

const ide = reactive(new Ide())
const component: Plugin = {
    install: function (app: App) {
        // @ts-ignore
        if (PluginUtil.markInstalledPlugin(app, 'gl-ide')) {
            return
        }
        if (!app.config.globalProperties.$ide) {
            app.config.globalProperties.$ide = ide
        }
        // 注册组件
        app.component(GlIde.name, GlIde)
    }
}
export {
    EventNames,
    GlPlugin,
    Panel,
    ide,
    BaseDesignMeta,
    PropertyMeta,
    TypeEnums,
    Page,
    GlIde,
    useIdeStore,
    useAppStore,
    useEntityStore,
    useComponentStore,
    useThemeStore,
    useHistoryStore,
    uiLibAdapter
}
// 默认导出组件
export default component
