/*
 *  打包引用的入口
 */
import { type App, type Plugin, ref } from 'vue'
import { PluginUtil } from '@geelato/gl-ui'
import GlPlugin from './entity/GlPlugin'
import Panel from './entity/Panel'
import EventNames from './entity/EventNames'
import GlIde from './components/Index.vue'
import Ide from './entity/Ide'
import BaseDesignMeta from './entity/meta/BaseDesignMeta'
import PropertyMeta from './entity/meta/PropertyMeta'
import TypeEnums from './entity/meta/TypeEnums'
import Page from './entity/Page'
import { useIdeStore } from './stores/UseIdeStore'
import { useEntityStore } from './stores/UseEntityStore'
import { usePageStore } from './stores/UsePageStore'
import {
  useComponentStore,
  componentStoreFactory,
  useComponentBpmnStore,
  useComponentBlockStore
} from './stores/UseComponentStore'
import { useThemeStore } from './stores/UseThemeStore'
import { useAppStore } from './stores/UseAppStore'
import uiLibAdapter from './utils/UiLibAdapter'
import GlMonacoEditor from './components/monaco/Index.vue'
import GlBpmnEditor from './components/bpmn/GlBpmnEditor.vue'
import ComponentSetterProvideProxy from './stores/ComponentSetterProvideProxy'
import { ComponentSetterProvideKey } from './stores/ComponentSetterProvideProxy'
import './assets/gl-root.css'
import './assets/gl-table-form.css'
import useCodePrettier from './hooks/codePrettier'

const ide = ref(new Ide())
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
    app.component(GlMonacoEditor.name, GlMonacoEditor)
    app.component(GlBpmnEditor.name, GlBpmnEditor)
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
  useCodePrettier,
  componentStoreFactory,
  usePageStore,
  useComponentStore,
  useComponentBlockStore,
  useComponentBpmnStore,
  useThemeStore,
  uiLibAdapter,
  ComponentSetterProvideProxy,
  ComponentSetterProvideKey
}
// 默认导出组件
export default component
