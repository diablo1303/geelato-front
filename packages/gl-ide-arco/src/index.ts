/*
 *  打包引用的入口
 */
import type {App} from 'vue'
import pluginCore from './plugin'
import pluginBlock from "./blocks";
import { type GeelatoPlugin, type GeelatoPluginOptions, PluginUtil } from '@geelato/gl-ui'
import GlIdeArco from './App.vue'
const component: GeelatoPlugin = {
    install: function (app: App) {
        // @ts-ignore
        if(PluginUtil.markInstalledPlugin(app,'gl-ide-arco')){
            return
        }
        // 注册组件
        app.component(GlIdeArco.name, GlIdeArco)

        // @ts-ignore
        app.use(pluginCore)
        app.use(pluginBlock)
    },
    setupGeelato: function (options?: GeelatoPluginOptions) {}
}
// 默认导出组件
export default component
