/*
 *  打包引用的入口
 */
import {type App, ref} from 'vue'
import { type GeelatoPlugin, type GeelatoPluginOptions, PluginUtil } from '@geelato/gl-ui'
import GlPlugin from './entity/GlPlugin'
import Panel from './entity/Panel'
import EventNames from './entity/EventNames'
import GlIde from './components/Index.vue'
import Ide from './entity/Ide'
import BaseDesignMeta from './entity/meta/BaseDesignMeta'
import PropertyMeta from './entity/meta/PropertyMeta'
import TypeEnums from './entity/meta/TypeEnums'
import Page from './entity/Page'
import {useIdeStore} from './stores/UseIdeStore'
import {useEntityStore} from './stores/UseEntityStore'
import {usePageStore} from './stores/UsePageStore'
import {useActionStore, type VarMeta} from './stores/UseActionStore'
import {componentStoreFactory, useComponentBrowserBlockStore, useComponentBpmnStore, useComponentStore} from './stores/UseComponentStore'
import {useThemeStore} from './stores/UseThemeStore'
import {useAppStore} from './stores/UseAppStore'
import uiLibAdapter from './utils/UiLibAdapter'
import GlMonacoEditor from './components/monaco/Index.vue'
import GlCopyToClipboard from './components/copyToClipboard/Index.vue'
import GlBpmnEditor from './components/bpmn/GlBpmnEditor.vue'
import ComponentSetterProvideProxy, {ComponentSetterProvideKey} from './stores/ComponentSetterProvideProxy'
import './assets/gl-root.css'
import './assets/gl-table-form.css'
import useCodePrettier from './hooks/codePrettier'

const ide = ref(new Ide())
const component: GeelatoPlugin = {
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
    app.component(GlMonacoEditor.name, GlMonacoEditor)
    app.component(GlCopyToClipboard.name, GlCopyToClipboard)
    app.component(GlBpmnEditor.name, GlBpmnEditor)
  },
  setupGeelato: function (options?: GeelatoPluginOptions) {}
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
  useCodePrettier,
  componentStoreFactory,
  usePageStore,
  useComponentStore,
  useComponentBrowserBlockStore,
  useComponentBpmnStore,
  useThemeStore,
  useActionStore,
  VarMeta,
  uiLibAdapter,
  ComponentSetterProvideProxy,
  ComponentSetterProvideKey
}
// 默认导出组件
export default component
