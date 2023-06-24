import type {App, Plugin} from 'vue'
import GlCommandBlockOne from "./components/setters/action-setters/blocks/CommandBlockOne.vue";
import GlCommandBlockTwo from "./components/setters/action-setters/blocks/CommandBlockTwo.vue";

const component: Plugin = {
    install: function (app: App) {
        // 注册组件
        // if (!app.config.globalProperties.$ide) {
        //     console.error('必须先注册安装GlIde插件.')
        //     return
        // }

        // 注册组件
        app.component('GlCommandBlock', GlCommandBlockOne)
        app.component('GlBlockMessage', GlCommandBlockOne)
        app.component('GlBlockNotification', GlCommandBlockOne)
        app.component('GlBlockOpenComponentPage', GlCommandBlockOne)
        app.component('GlBlockOpenThirdPage', GlCommandBlockOne)
        app.component('GlBlockSetVar', GlCommandBlockOne)
        app.component('GlBlockIf', GlCommandBlockTwo)
        app.component('GlBlockElse', GlCommandBlockTwo)
        app.component('GlIfComponentValueBlock', GlCommandBlockTwo)
        app.component('GlBlockComponentInvoke', GlCommandBlockOne)
        app.component('GlBlockConfirm', GlCommandBlockOne)
        app.component('GlBlockSetVisible', GlCommandBlockOne)
        app.component('GlTriggerComponentActionBlock', GlCommandBlockOne)
        app.component('GlLogBlock', GlCommandBlockOne)
        app.component('GlSetValueBlock', GlCommandBlockOne)
        // 注册组件构建器

        // 注册属性设置组件


        // 组件别名
        // app.config.globalProperties.$gl.alias[GlX.name] = 'glx'

        // 安装插件
        // useIdeStore().usePlugin(plugin)
    }
}

// 默认导出组件
export default component
