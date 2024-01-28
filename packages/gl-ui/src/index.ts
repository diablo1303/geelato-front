import { reactive, type App, type Plugin } from 'vue'
import emitter from './m/mix/emitter'
import PageProvideProxy, { type PageCustomType } from './components/PageProvideProxy'
import type { PageParamConfigType } from './components/PageProvideProxy'
import GlHtml from './components/gl-html/Index.vue'
import GlIconfont from './components/gl-iconfont/Index.vue'
import GlVirtual from './components/gl-virtual/Index.vue'
import GlDndPlaceholder from './components/gl-dnd-placeholder/Index.vue'
import GlComponent from './components/gl-component/GlComponent.vue'
import GlPageViewer from './components/gl-page-viewer/GlPageViewer.vue'
import { LooseObject } from './m/mix/LooseObject'
import { default as iconsJson } from './assets/iconfont.json'
import { IconsJson } from './components/gl-iconfont/IconsJson'
import { EntityApi, entityApi } from './m/datasource/EntityApi'
import EntityDataSource, {
  EntityReader,
  EntityReaderParam,
  EntityReaderOrder,
  EntityReaderOrderEnum,
  EntityMeta,
  EntityLiteMeta,
  FieldMeta,
  compareMeta,
  EntitySaver,
  GetEntitySaversResult,
  EntityRecordStatus
} from './m/datasource/EntityDataSource'
import utils from './m/utils/Utils'
import mixins from './components/mixins'
import MixUtil from './m/utils/MixUtil'
import PluginUtil from './m/utils/PluginUtil'
import AllUtils from './m/utils/AllUtils'
import CheckUtil from './m/utils/CheckUtil'
import ConvertUtil from './m/utils/ConvertUtil'
import useGlobal from './m/hooks/useGlobal'
import useApiUrl from './m/hooks/useApiUrl'
import useMessages from './m/hooks/useMessages'
import jsScriptExecutor from './m/actions/JsScriptExecutor'
import { PageProvideKey, PageParamsKey } from './components/PageProvideProxy'
import AppProvideProxy from './components/AppProvideProxy'
import { AppProvideKey } from './components/AppProvideProxy'
import FormProvideProxy from './components/FormProvideProxy'
import { FormProvideKey } from './components/FormProvideProxy'
import { Schema } from 'b-validate'
import type { ApiPagedResult, ApiResult, ApiResultStatus, Param } from './m/types/global'
import { PageType } from './m/types/global'
import {
  executeArrayExpressions,
  executeObjectPropsExpressions
} from './components/gl-component/GlComponentSupport'
import { paramStringify } from './components/PageProvideProxy'
import * as dictApi from './m/datasource/FileApi'
import * as fileApi from './m/datasource/FileApi'
import * as encodingApi from './m/datasource/EncodingApi'
import GlInsts from './components/gl-component/GlInsts.vue'
import GlLoop from './components/gl-loop/GlLoop.vue'
import GlTemplate from './components/gl-template/GlTemplate.vue'
import GlChart from './components/gl-chart/GlChart.vue'
import './assets/style.css'

const Utils = AllUtils

const component: Plugin = {
  install: function (app: App): any {
    if (PluginUtil.markInstalledPlugin(app, 'gl-ui')) {
      return
    }
    jsScriptExecutor.setApp(app)

    // 注册组件
    app.component(GlInsts.name, GlInsts)
    app.component(GlVirtual.name, GlVirtual)
    app.component(GlIconfont.name, GlIconfont)
    app.component(GlHtml.name, GlHtml)
    app.component(GlDndPlaceholder.name, GlDndPlaceholder)
    app.component(GlComponent.name, GlComponent)
    app.component(GlPageViewer.name, GlPageViewer)
    app.component(GlLoop.name, GlLoop)
    app.component(GlTemplate.name, GlTemplate)
    app.component(GlChart.name, GlChart)

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
  AppProvideKey,
  AppProvideProxy,
  PageParamsKey,
  PageProvideKey,
  PageCustomType,
  PageProvideProxy,
  paramStringify,
  FormProvideKey,
  FormProvideProxy,
  PageType,
  Schema,
  PageParamConfigType,
  ApiResultStatus,
  ApiResult,
  ApiPagedResult,
  Param,
  GlIconfont,
  EntityApi,
  entityApi,
  EntityReader,
  EntityReaderParam,
  EntityReaderOrder,
  EntityReaderOrderEnum,
  EntityMeta,
  EntityLiteMeta,
  EntitySaver,
  EntityRecordStatus,
  GetEntitySaversResult,
  FieldMeta,
  EntityDataSource,
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
  useApiUrl,
  useMessages,
  jsScriptExecutor,
  dictApi,
  fileApi,
  encodingApi,
  executeObjectPropsExpressions,
  executeArrayExpressions
}
// 默认导出组件
export default component
