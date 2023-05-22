import {reactive, type App, type Plugin} from 'vue'
import emitter from "./m/mix/emitter";
import PageProvideProxy from "./components/PageProvideProxy";
import type {PageParamType} from "./components/PageProvideProxy";
import GlHtml from './components/gl-html/Index.vue'
import GlIconfont from './components/gl-iconfont/Index.vue'
import GlColor from './components/gl-color/GlColor.vue'
import GlDndPlaceholder from './components/gl-dnd-placeholder/Index.vue'
import GlComponent from "./components/gl-component/GlComponent.vue";
import GlPageViewer from "./components/gl-page-viewer/GlPageViewer.vue";
import GlText from './components/gl-text/Index.vue'
import {LooseObject} from "./m/mix/LooseObject";
import {default as iconsJson} from './assets/iconfont.json'
import {IconsJson} from "./components/gl-iconfont/IconsJson";
import {EntityApi, entityApi} from "./m/datasource/EntityApi";
import {
    EntityReader,
    EntityReaderParam,
    EntityReaderOrder,
    EntityMeta,
    EntityLiteMeta,
    FieldMeta,
    compareMeta
} from "./m/datasource/EntityDataSource";
import utils from "./m/utils/Utils";
import mixins from "./components/mixins";
import MixUtil from "./m/utils/MixUtil";
import PluginUtil from "./m/utils/PluginUtil";
import AllUtils from "./m/utils/AllUtils";
import CheckUtil from "./m/utils/CheckUtil";
import ConvertUtil from "./m/utils/ConvertUtil";
import useGlobal from "./m/hooks/useGlobal";
import './assets/style.css'
import actionScriptExecutor from "./m/actions/ActionScriptExecutor";

const Utils = AllUtils

const component: Plugin = {
    install: function (app: App) {
        if (PluginUtil.markInstalledPlugin(app, 'gl-ui')) {
            return
        }
        actionScriptExecutor.setApp(app)

        // 注册图标库组件
        app.component(GlIconfont.name, GlIconfont)
        app.component(GlHtml.name, GlHtml)
        app.component(GlDndPlaceholder.name, GlDndPlaceholder)
        app.component(GlText.name, GlText)
        app.component(GlColor.name, GlColor)
        app.component(GlComponent.name, GlComponent)
        app.component(GlPageViewer.name, GlPageViewer)

        if (!app.config.globalProperties.$gl) {
            app.config.globalProperties.$gl = reactive({
                alias: {},
                utils: utils
            })
        }

        // 别名，用于生成组件id时，作为前缀
        app.config.globalProperties.$gl.alias['GlIconfont'] = 'icon'
        app.config.globalProperties.$gl.alias[GlHtml.name] = 'html'
        app.config.globalProperties.$gl.alias['GlComponent'] = 'c'
        app.config.globalProperties.$gl.alias[GlDndPlaceholder.name] = 'dndph'
    }
}

export {
    PageParamType,
    PageProvideProxy,
    GlIconfont,
    EntityApi,
    entityApi,
    EntityReader,
    EntityReaderParam,
    EntityReaderOrder,
    EntityMeta,
    EntityLiteMeta,
    FieldMeta,
    compareMeta,
    utils,
    mixins,
    emitter,
    LooseObject,
    iconsJson,
    IconsJson,
    MixUtil,
    CheckUtil,
    ConvertUtil,
    Utils,
    PluginUtil,
    useGlobal,
    actionScriptExecutor,
}
// 默认导出组件
export default component