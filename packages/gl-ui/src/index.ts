import {reactive, type App, type Plugin} from 'vue'
import emitter from "./m/mix/emitter";
import GlHtml from './components/gl-html/Index.vue'
import GlIconfont from './components/gl-iconfont/Index.vue'
import GlDndPlaceholder from './components/gl-dnd-placeholder/Index.vue'
import GlComponent from "./components/gl-component/GlComponent.vue";
import type IComponentInstance from "./components/gl-component/IComponentInstance";
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
import useCurrentInstance from "./m/hooks/useCurrentInstance";
import './assets/style.css'

const Utils = AllUtils


const component: Plugin = {
    install: function (app: App) {
        if (PluginUtil.markInstalledPlugin(app, 'gl-ui')) {
            return
        }

        // 注册图标库组件
        app.component('GlIconfont', GlIconfont)
        app.component(GlHtml.name, GlHtml)
        app.component(GlDndPlaceholder.name, GlDndPlaceholder)
        app.component('GlComponent',GlComponent)

        if (!app.config.globalProperties.$gl) {
            app.config.globalProperties.$gl = reactive({alias: {}})
        }
        // 别名，用于生成组件id时，作为前缀
        app.config.globalProperties.$gl.alias['GlIconfont'] = 'icon'
        app.config.globalProperties.$gl.alias[GlHtml.name] = 'html'
        app.config.globalProperties.$gl.alias['GlComponent'] = 'c'
        app.config.globalProperties.$gl.alias[GlDndPlaceholder.name] = 'dndph'
    }
}

export {
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
    useCurrentInstance,
    IComponentInstance
}
// 默认导出组件
export default component
