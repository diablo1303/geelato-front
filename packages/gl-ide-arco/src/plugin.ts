import type { App, Plugin } from 'vue'
import { GlPlugin, Panel, usePageStore } from '@geelato/gl-ide'
import GlIdePluginCoreAppTree from './components/sidebar/AppTree.vue'
import GlComponentTree from './components/sidebar/ComponentTree.vue'
import GlComponentsSidebar from './components/sidebar/components/ComponentsSidebar.vue'
import GlPageOpHistory from './components/sidebar/GlPageOpHistory.vue'
import GlBasePage from './components/stage/BasePage.vue'
import GlFormPage from './components/stage/FormPage.vue'
import GlFreePage from './components/stage/FreePage.vue'
import GlListPage from './components/stage/ListPage.vue'
import GlFlowPage from './components/stage/FlowPage.vue'
import GlEntityReaderBuilder from './components/builder/props-builder/GlEntityReaderBuilder.vue'
import GlComponentBuilder from './components/builder/GlComponentBuilder.vue'
import GlSimpleArrayBuilder from './components/builder/props-builder/GlSimpleArrayBuilder.vue'
import GlSimpleArraySetter from './components/setters/property-setters/GlSimpleArraySetter.vue'
import GlComponentSetter from './components/setters/GlComponentSetter.vue'
import GlComponentPropertiesSetter from './components/setters/GlComponentPropertiesSetter.vue'
import GlComponentStyleSetter from './components/setters/GlComponentStyleSetter.vue'
import GlComponentActionsSetter from './components/setters/GlComponentActionsSetter.vue'
import GlSimpleObjectSetter from './components/setters/property-setters/GlSimpleObjectSetter.vue'
import GlPropertySetter from './components/setters/GlPropertySetter.vue'
import GlPropertySetterCard from './components/setters/GlPropertySetterCard.vue'
import GlIconfontTextSetter from './components/setters/property-setters/GlIconfontTextSetter.vue'
import GlHtmlSetter from './components/setters/property-setters/GlHtmlSetter.vue'
import GlSelectSetter from './components/setters/property-setters/GlSelectSetter.vue'
import SwitchPropsBuilder from './components/builder/props-builder/SwitchPropsBuilder.vue'
import GlRadioGroupSetter from './components/setters/property-setters/GlRadioGroupSetter.vue'
import GlFieldSelect from './components/setters/property-setters/GlFieldSelect.vue'
import GlEntitySelect from './components/setters/property-setters/GlEntitySelect.vue'
import GlAppSelect from './components/setters/property-setters/GlAppSelect.vue'
import GlPageSelect from './components/setters/property-setters/GlPageSelect.vue'
import GlComponentSelect from './components/setters/property-setters/GlComponentSelect.vue'
import GlEntityReaderSetter from './components/setters/property-setters/entity-reader-setter/GlEntityReaderSetter.vue'
import GlToolbarBreadcrumbs from './components/stage/GlToolbarBreadcrumbs.vue'
import GlExpressionSetter from './components/setters/expression-setters/GlExpressionSetter.vue'
import GlActionList from './components/sidebar/GlActionList.vue'
import GlPermissionList from './components/sidebar/permissions/GlPermissionList.vue'
import GlArrayBaseSetter from './components/setters/property-setters/GlArrayBaseSetter.vue'
import GlArrayNumberSetter from './components/setters/property-setters/GlArrayNumberSetter.vue'
import GlArrayNumberBuilder from './components/builder/props-builder/GlArrayNumberBuilder.vue'
import GlArrayStringSetter from './components/setters/property-setters/GlArrayStringSetter.vue'
import GlArrayBooleanSetter from './components/setters/property-setters/GlArrayBooleanSetter.vue'
import GlArrayColorSetter from './components/setters/property-setters/GlArrayColorSetter.vue'
import GlArrayComponentSetter from './components/setters/property-setters/GlArrayComponentSetter.vue'
import GlDictSetter from './components/setters/property-setters/GlDictSetter.vue'
import GlInst from './components/dnd/GlInst.vue'
import GlInsts from './components/dnd/GlInsts.vue'
import ComponentDnd from './components/dnd/ComponentDnd.vue'
import GlOptionsSetter from './components/setters/property-setters/GlOptionsSetter.vue'
import GlEntityFieldSelect from './components/setters/property-setters/GlEntityFieldSelect.vue'
import GlAppEntitySelect from './components/setters/property-setters/GlAppEntitySelect.vue'
import GlValidateRulesSetter from './components/setters/property-setters/GlValidateRulesSetter.vue'
import GlComponentI18nSetter from './components/setters/GlComponentI18nSetter.vue'
import GlPageComponentSelect from './components/setters/property-setters/GlPageComponentSelect.vue'
import GlPageComponentSelectBuilder from './components/builder/props-builder/GlPageComponentSelectBuilder.vue'
import GlInputSetter from './components/setters/property-setters/GlInputSetter.vue'
import GlOptionsDynamicBuilder from './components/builder/props-builder/GlOptionsDynamicBuilder.vue'
import GlValueTypes from './components/setters/property-setters/GlValueTypes.vue'
import GlCompareValueSetter from './components/setters/property-setters/GlCompareValueSetter.vue'
import GlComponentMethodSelect from './components/setters/property-setters/GlComponentMethodSelect.vue'
import GlComponentParamSetter from './components/setters/property-setters/GlComponentParamSetter.vue'
import GlComponentReturnSetter from './components/setters/property-setters/GlComponentReturnSetter.vue'
import GlComponentActionSelect from './components/setters/property-setters/GlComponentActionSelect.vue'
import GlAppFileTemplateSelect from './components/setters/property-setters/GlAppFileTemplateSelect.vue'
import GlExpressionBuilder from './components/builder/props-builder/GlExpressionBuilder.vue'
import GlPageSaveLog from './components/sidebar/GlPageSaveLog.vue'
import GlVueEditor from './components/setters/property-setters/GlVueEditor.vue'
import GlSlotSetter from './components/setters/property-setters/GlSlotSetter.vue'
import GlModelList from './components/sidebar/model/GlModelList.vue'
import GlDictList from './components/sidebar/dict/GlDictList.vue'
import GlServiceList from './components/sidebar/services/GlServiceList.vue'
import './assets/style.css'

const plugin = new GlPlugin('gl-plugin-arco')

plugin.sidebar.push(
  new Panel({
    title: '模块',
    name: '模块',
    iconType: 'gl-tree',
    componentName: GlIdePluginCoreAppTree.name
  })
)

plugin.sidebar.push(
  new Panel({
    title: '组件',
    name: 'components',
    iconType: 'gl-component',
    componentName: 'GlComponentsSidebar'
  })
)

plugin.sidebar.push(
  new Panel({
    title: '结构',
    name: '结构',
    iconType: 'gl-tree-structure',
    componentName: GlComponentTree.name
  })
)

plugin.sidebar.push(
  new Panel({
    title: '动作',
    name: '动作',
    iconType: 'gl-thunderbolt',
    componentName: GlActionList.name
  })
)

plugin.sidebar.push(
  new Panel({
    title: '模型',
    name: '模型',
    iconType: 'gl-entity-query',
    componentName: GlModelList.name
  })
)

plugin.sidebar.push(
  new Panel({
    title: '字典',
    name: '字典',
    iconType: 'gl-dict',
    componentName: GlDictList.name
  })
)

plugin.sidebar.push(
  new Panel({
    title: '服务',
    name: '服务',
    iconType: 'gl-api',
    componentName: GlServiceList.name
  })
)

// plugin.sidebar.push(
//   new Panel({
//     title: '流程',
//     name: '流程',
//     iconType: 'gl-flow',
//     componentName: GlComponentTree.name
//   })
// )

plugin.sidebar.push(
  new Panel({
    title: '权限',
    name: '权限',
    iconType: 'gl-security',
    componentName: GlPermissionList.name
  })
)

plugin.sidebar.push(
  new Panel({
    title: '操作',
    name: '操作',
    iconType: 'gl-history',
    componentName: GlPageOpHistory.name
  })
)

plugin.sidebar.push(
  new Panel({
    title: '保存',
    name: '保存',
    iconType: 'gl-history',
    componentName: GlPageSaveLog.name
  })
)

plugin.stage.push(
  new Panel({
    title: '自定页面',
    name: 'freePage',
    iconType: 'LayoutOutlined',
    componentName: GlFreePage.name
  })
)

plugin.stage.push(
  new Panel({
    title: '表单页面',
    name: 'formPage',
    iconType: 'LayoutOutlined',
    componentName: GlFormPage.name
  })
)

plugin.stage.push(
  new Panel({
    title: '列表页面',
    name: 'listPage',
    iconType: 'LayoutOutlined',
    componentName: GlListPage.name
  })
)

plugin.stage.push(
  new Panel({
    title: '流程页面',
    name: 'flowPage',
    iconType: 'LayoutOutlined',
    componentName: GlFlowPage.name
  })
)

// 显示的设置面板，默认显示所有：props 属性、actions 动作、permission 权限、lang 多语言
plugin.pushPageTypeAndSetterPanelNames('freePage', ['props', 'actions', 'permission', 'lang'])
plugin.pushPageTypeAndSetterPanelNames('formPage', ['props', 'actions', 'permission', 'lang'])
plugin.pushPageTypeAndSetterPanelNames('listPage', ['props', 'actions', 'permission', 'lang'])
plugin.pushPageTypeAndSetterPanelNames('emptyPage', ['props', 'actions', 'permission', 'lang'])
plugin.pushPageTypeAndSetterPanelNames('flowPage', ['props'])

// plugin.stage.push(new Panel({
//     title: '页面',
//     name: 'Page',
//     iconType: 'LayoutOutlined',
//     componentName: GlFreePage.name
// }))

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
    app.component(GlComponentsSidebar.name, GlComponentsSidebar)
    app.component(GlComponentTree.name, GlComponentTree)
    app.component(GlActionList.name, GlActionList)
    app.component(GlModelList.name, GlModelList)
    app.component(GlDictList.name, GlDictList)
    app.component(GlServiceList.name, GlServiceList)
    app.component(GlPermissionList.name, GlPermissionList)
    app.component(GlIdePluginCoreAppTree.name, GlIdePluginCoreAppTree)
    app.component(GlPageOpHistory.name, GlPageOpHistory)
    app.component(GlPageSaveLog.name, GlPageSaveLog)
    app.component(GlBasePage.name, GlBasePage)
    app.component(GlFormPage.name, GlFormPage)
    app.component(GlFreePage.name, GlFreePage)
    app.component(GlListPage.name, GlListPage)
    app.component(GlFlowPage.name, GlFlowPage)
    app.component(GlToolbarBreadcrumbs.name, GlToolbarBreadcrumbs)
    app.component(GlInsts.name, GlInsts)
    app.component(GlInst.name, GlInst)
    app.component(ComponentDnd.name, ComponentDnd)

    // 注册组件构建器
    app.component(GlComponentBuilder.name, GlComponentBuilder)
    app.component(GlSimpleArrayBuilder.name, GlSimpleArrayBuilder)
    app.component(GlPageComponentSelectBuilder.name, GlPageComponentSelectBuilder)
    app.component(GlOptionsDynamicBuilder.name, GlOptionsDynamicBuilder)
    app.component(SwitchPropsBuilder.name, SwitchPropsBuilder)
    app.component(GlExpressionBuilder.name, GlExpressionBuilder)
    app.component(GlEntityReaderBuilder.name, GlEntityReaderBuilder)
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
    app.component(GlArrayComponentSetter.name, GlArrayComponentSetter)
    app.component(GlArrayBooleanSetter.name, GlArrayBooleanSetter)
    app.component(GlArrayColorSetter.name, GlArrayColorSetter)
    app.component(GlSimpleObjectSetter.name, GlSimpleObjectSetter)
    app.component(GlValueTypes.name, GlValueTypes)
    app.component(GlCompareValueSetter.name, GlCompareValueSetter)
    app.component(GlComponentMethodSelect.name, GlComponentMethodSelect)
    app.component(GlComponentParamSetter.name, GlComponentParamSetter)
    app.component(GlComponentReturnSetter.name, GlComponentReturnSetter)
    app.component(GlComponentActionSelect.name, GlComponentActionSelect)
    app.component(GlAppFileTemplateSelect.name, GlAppFileTemplateSelect)
    app.component(GlDictSetter.name, GlDictSetter)
    app.component(GlVueEditor.name, GlVueEditor)
    // app.component(GlSettingOptions.name, GlSettingOptions)
    // app.component(GlSettingProperty.name, GlSettingProperty)
    app.component(GlPropertySetter.name, GlPropertySetter)
    app.component(GlPropertySetterCard.name, GlPropertySetterCard)
    app.component(GlIconfontTextSetter.name, GlIconfontTextSetter)
    // app.component(GlIconfontSetterForSlot.name, GlIconfontSetterForSlot)
    app.component(GlSelectSetter.name, GlSelectSetter)
    app.component(GlOptionsSetter.name, GlOptionsSetter)
    app.component(GlAppSelect.name, GlAppSelect)
    app.component(GlPageSelect.name, GlPageSelect)
    app.component(GlPageComponentSelect.name, GlPageComponentSelect)
    app.component(GlEntitySelect.name, GlEntitySelect)
    app.component(GlFieldSelect.name, GlFieldSelect)
    app.component(GlComponentSelect.name, GlComponentSelect)
    app.component(GlEntityReaderSetter.name, GlEntityReaderSetter)
    app.component(GlRadioGroupSetter.name, GlRadioGroupSetter)
    app.component(GlHtmlSetter.name, GlHtmlSetter)
    app.component(GlEntityFieldSelect.name, GlEntityFieldSelect)
    app.component(GlAppEntitySelect.name, GlAppEntitySelect)
    app.component(GlValidateRulesSetter.name, GlValidateRulesSetter)
    app.component(GlComponentI18nSetter.name, GlComponentI18nSetter)
    app.component(GlInputSetter.name, GlInputSetter)
    app.component(GlExpressionSetter.name, GlExpressionSetter)
    app.component(GlSlotSetter.name, GlSlotSetter)
    // 注册组件元数据
    // ide.componentMetaManager.registerManyComponentRuntimeMeta(componentMeta.runtimeMeta)
    // ide.componentMetaManager.registerManyComponentDesignMeta(componentMeta.designMeta)

    // 组件别名
    // app.config.globalProperties.$gl.alias[GlX.name] = 'glx'
    app.config.globalProperties.$gl.alias[GlToolbarBreadcrumbs.name] = 'crumbs'
  }
}

// 默认导出组件
export default component
export { plugin }
