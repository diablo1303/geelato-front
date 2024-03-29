/*
 *  打包引用的入口
 */
import type {App,Plugin} from 'vue'
import pluginCore from './plugin'
import pluginBlock from "./blocks";
import {PluginUtil} from "@geelato/gl-ui";
import GlIdeArco from './App.vue'
const component: Plugin = {
    install: function (app: App) {
        // console.log('gl-ide-arco:gl-ide-arco:gl-ide-arco')
        // @ts-ignore
        if(PluginUtil.markInstalledPlugin(app,'gl-ide-arco')){
            return
        }
        // 注册组件
        app.component(GlIdeArco.name, GlIdeArco)

        // @ts-ignore
        app.use(pluginCore)
        app.use(pluginBlock)
        // pluginCore.install(app)
    }
}
// 默认导出组件
export default component
