import type {App, Plugin} from 'vue'
import {GlPlugin, Panel, useIdeStore} from '@geelato/gl-ide'
import GlIdePluginCoreComponents from './components/sidebar/Components.vue'
import GlIdePluginCoreAppTree from './components/sidebar/AppTree.vue'
import GlComponentTree from './components/sidebar/ComponentTree.vue'
//import GlIdePluginCorePanelLayout from './components/sidebar/Layout.vue'
import GlIdePluginCoreHistory from './components/sidebar/History.vue'
import GlIdePluginCoreStageFreePage from './components/stage/FreePage.vue'
import GlComponentBuilder from "./components/builder/GlComponentBuilder.vue";
import GlSimpleArrayBuilder from "./components/builder/props-builder/GlSimpleArrayBuilder.vue";
import GlSimpleArraySetter from "./components/setters/property-setters/GlSimpleArraySetter.vue";
import GlComponentSetter from "./components/setters/GlComponentSetter.vue";
import GlComponentPropertiesSetter from "./components/setters/GlComponentPropertiesSetter.vue";
import GlComponentStyleSetter from "./components/setters/GlComponentStyleSetter.vue";
import GlComponentActionsSetter from "./components/setters/GlComponentActionsSetter.vue";
import GlSimpleObjectSetter from "./components/setters/property-setters/GlSimpleObjectSetter.vue";
import GlPropertySetter from './components/setters/GlPropertySetter.vue'
import GlPropertySetterCard from './components/setters/GlPropertySetterCard.vue'
import GlIconfontSetter from "./components/setters/property-setters/GlIconfontSetter.vue";
import GlIconfontSetterForSlot from "./components/setters/property-setters/GlIconfontSetterForSlot.vue";
import GlHtmlSetter from "./components/setters/property-setters/GlHtmlSetter.vue";
import GlSelectSetter from "./components/setters/property-setters/GlSelectSetter.vue";
import GlRadioGroupSetter from "./components/setters/property-setters/GlRadioGroupSetter.vue";
import GlFieldSelect from "./components/setters/property-setters/GlFieldSelect.vue";
import GlEntitySelect from "./components/setters/property-setters/GlEntitySelect.vue";
import GlComponentSelect from "./components/setters/property-setters/GlComponentSelect.vue";
import GlEntityReaderSetter from "./components/setters/property-setters/entity-reader-setter/GlEntityReaderSetter.vue";
import GlToolbarBreadcrumbs from './components/gl-toolbar-breadcrumbs/Index.vue'
import GlX from './components/gl-x/GlX.vue'
import GlComponentRecursion from './components/gl-component-recursion/ComponentRecursion.vue'
import "./assets/style.css"
import GlArrayBaseSetter from "./components/setters/property-setters/GlArrayBaseSetter.vue";
import GlArrayNumberSetter from "./components/setters/property-setters/GlArrayNumberSetter.vue";
import GlArrayNumberBuilder from "./components/builder/props-builder/GlArrayNumberBuilder.vue";
import GlArrayStringSetter from "./components/setters/property-setters/GlArrayStringSetter.vue";
import GlArrayBooleanSetter from "./components/setters/property-setters/GlArrayBooleanSetter.vue";

const plugin = new GlPlugin('gl-plugin-arco')

plugin.sidebar.push(new Panel({
    title: '应用结构',
    name: '应用结构',
    iconType: 'gl-tree',
    componentName: GlIdePluginCoreAppTree.name
}))
plugin.sidebar.push(new Panel({
    title: '组件',
    name: 'components',
    iconType: 'gl-component',
    componentName: 'GlIdePluginCoreComponents'
}))

plugin.sidebar.push(new Panel({
    title: '页面结构',
    name: '页面结构',
    iconType: 'gl-tree-structure',
    componentName: GlComponentTree.name
}))

plugin.sidebar.push(new Panel({
    title: '历史记录',
    name: '历史记录',
    iconType: 'gl-history',
    componentName: GlIdePluginCoreHistory.name
}))


plugin.stage.push(new Panel({
    title: '页面',
    name: 'freePage',
    iconType: 'LayoutOutlined',
    componentName: GlIdePluginCoreStageFreePage.name
}))


plugin.stage.push(new Panel({
    title: '页面',
    name: 'Page',
    iconType: 'LayoutOutlined',
    componentName: GlIdePluginCoreStageFreePage.name
}))


// plugin.setter.push(new Panel({
//     title: '属性',
//     name: '属性',
//     iconType: 'LayoutOutlined',
//     componentName: GlIdePluginCoreSettingProperties.name
// }))
//
// plugin.setter.push(new Panel({
//     title: '样式',
//     name: '样式',
//     iconType: 'LayoutOutlined',
//     componentName: GlIdePluginCoreSettingStyle.name
// }))

const component: Plugin = {
    install: function (app: App) {
        // 注册组件
        // if (!app.config.globalProperties.$ide) {
        //     console.error('必须先注册安装GlIde插件.')
        //     return
        // }

        // 注册组件
        app.component('GlIdePluginCoreComponents', GlIdePluginCoreComponents)
        app.component(GlComponentTree.name, GlComponentTree)
        app.component(GlIdePluginCoreAppTree.name, GlIdePluginCoreAppTree)
        app.component(GlIdePluginCoreHistory.name, GlIdePluginCoreHistory)
        // app.component(GlIdePluginCorePanelLayout.name, GlIdePluginCorePanelLayout)
        app.component(GlIdePluginCoreStageFreePage.name, GlIdePluginCoreStageFreePage)
        // app.component(GlIdePluginCoreSettingProperties.name, GlIdePluginCoreSettingProperties)
        // app.component(GlIdePluginCoreSettingStyle.name, GlIdePluginCoreSettingStyle)
        app.component(GlToolbarBreadcrumbs.name, GlToolbarBreadcrumbs)
        app.component(GlX.name, GlX)
        app.component(GlComponentRecursion.name, GlComponentRecursion)
        // app.config.globalProperties.$ide.usePlugin(plugin)

        // 注册组件构建器
        app.component(GlComponentBuilder.name, GlComponentBuilder)
        app.component(GlSimpleArrayBuilder.name, GlSimpleArrayBuilder)
        // 注册属性设置组件
        app.component('GlComponentSetter', GlComponentSetter)
        app.component(GlComponentPropertiesSetter.name, GlComponentPropertiesSetter)
        app.component(GlComponentStyleSetter.name, GlComponentStyleSetter)
        app.component(GlComponentActionsSetter.name, GlComponentActionsSetter)
        app.component(GlSimpleArraySetter.name, GlSimpleArraySetter)
        app.component(GlArrayBaseSetter.name, GlArrayBaseSetter)
        app.component(GlArrayNumberBuilder.name, GlArrayNumberBuilder)
        app.component(GlArrayNumberSetter.name, GlArrayNumberSetter)
        app.component(GlArrayStringSetter.name, GlArrayStringSetter)
        app.component(GlArrayBooleanSetter.name, GlArrayBooleanSetter)
        app.component(GlSimpleObjectSetter.name, GlSimpleObjectSetter)
        // app.component(GlSettingOptions.name, GlSettingOptions)
        // app.component(GlSettingProperty.name, GlSettingProperty)
        app.component(GlPropertySetter.name, GlPropertySetter)
        app.component(GlPropertySetterCard.name, GlPropertySetterCard)
        app.component('GlIconfontSetter', GlIconfontSetter)
        app.component(GlIconfontSetterForSlot.name, GlIconfontSetterForSlot)
        app.component(GlSelectSetter.name, GlSelectSetter)
        app.component('GlEntitySelect', GlEntitySelect)
        app.component('GlFieldSelect', GlFieldSelect)
        app.component('GlComponentSelect', GlComponentSelect)
        app.component(GlEntityReaderSetter.name, GlEntityReaderSetter)
        app.component(GlRadioGroupSetter.name, GlRadioGroupSetter)
        app.component(GlHtmlSetter.name, GlHtmlSetter)

        // 注册组件元数据
        // ide.componentMetaManager.registerManyComponentRuntimeMeta(componentMeta.runtimeMeta)
        // ide.componentMetaManager.registerManyComponentDesignMeta(componentMeta.designMeta)

        // 组件别名
        app.config.globalProperties.$gl.alias[GlX.name] = 'glx'
        app.config.globalProperties.$gl.alias[GlToolbarBreadcrumbs.name] = 'crumbs'

        // 安装插件
        // useIdeStore().usePlugin(plugin)
    }
}

// 默认导出组件
export default component
export {plugin}
