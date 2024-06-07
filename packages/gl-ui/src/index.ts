import {type App, type Plugin, reactive} from 'vue'
import emitter from './m/mix/emitter'
import type {PageParamConfigType, PageTemplate} from './components/PageProvideProxy'
import PageProvideProxy, {type PageCustomType, PageParamsKey, PageProvideKey, paramStringify} from './components/PageProvideProxy'
import GlHtml from './components/gl-html/Index.vue'
import GlIconfont from './components/gl-iconfont/Index.vue'
import GlVirtual from './components/gl-virtual/Index.vue'
import GlDndPlaceholder from './components/gl-dnd-placeholder/Index.vue'
import GlComponent from './components/gl-component/GlComponent.vue'
import GlPageViewer from './components/gl-page-viewer/GlPageViewer.vue'
import {LooseObject} from './m/mix/LooseObject'
import {default as iconsJson} from './assets/iconfont.json'
import {IconsJson} from './components/gl-iconfont/IconsJson'
import {EntityApi, entityApi} from './m/datasource/EntityApi'
import EntityDataSource, {
  compareMeta,
  EntityLiteMeta,
  EntityMeta,
  EntityReader,
  EntityReaderOrder,
  EntityReaderOrderEnum,
  EntityReaderParam,
  EntityRecordStatus,
  EntitySaver,
  FieldMeta,
  GetEntitySaversResult
} from './m/datasource/EntityDataSource'
import utils from './m/utils/Utils'
import stringUtil from './m/utils/StringUtil'
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
import AppProvideProxy, {AppProvideKey} from './components/AppProvideProxy'
import FormProvideProxy, {FormProvideKey, SubmitFormResult} from './components/FormProvideProxy'
import {Schema} from 'b-validate'
import type {ApiPagedResult, ApiResult, ApiResultStatus, PageConfig, Param} from './m/types/global'
import {PageStatus, PageType} from './m/types/global'
import {executeArrayExpressions, executeObjectPropsExpressions} from './components/gl-component/GlComponentSupport'
import type {UploadFileParams} from './m/datasource/FileApi'
import * as dictApi from './m/datasource/FileApi'
import * as fileApi from './m/datasource/FileApi'
import type {PageQueryRequest, PageQueryResponse, Pagination, QueryResult, SelectOption} from './m/datasource/Base'
import type {QueryAppForm} from './m/datasource/Application'
import * as applicationApi from './m/datasource/Application'
import type {
  QueryColumnRolePermissionForm,
  QueryDictForm,
  QueryDictItemForm,
  QueryEncodingForm,
  QueryOrgForm,
  QueryPermissionClassifyForm,
  QueryPermissionForm,
  QueryRoleForm,
  QueryRolePermissionForm,
  QueryTableRolePermissionClassifyForm,
  QueryUserForm
} from './m/datasource/Security'
import * as securityApi from './m/datasource/Security'
import {getUserCompany} from './m/datasource/Security'
import type {
  ColumnSelectType,
  QueryAppTableForm,
  QueryAppViewForm,
  QueryConnectForm,
  QueryMultiComponentForm,
  QueryTableColumnForm,
  QueryTableForeignForm,
  QueryTableForm,
  QueryViewForm
} from './m/datasource/Model'
import * as modelApi from './m/datasource/Model'
import * as encodingApi from './m/datasource/EncodingApi'
import GlInsts from './components/gl-component/GlInsts.vue'
import UiEventNames from './components/UiEventNames'
import GlLoop from './components/gl-loop/GlLoop.vue'
import GlTemplate from './components/gl-template/GlTemplate.vue'
import GlChart from './components/gl-chart/GlChart.vue'
import GlLoader from './components/gl-loader/GlLoader.vue'
import './assets/style.css'
import useLogger from './m/hooks/useLogger'
import {loadPageContent} from './components/PageLoader'

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
    app.component(GlLoader.name, GlLoader)

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
  PageTemplate,
  PageCustomType,
  PageProvideProxy,
  PageConfig,
  PageStatus,
  loadPageContent,
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
  stringUtil,
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
  useLogger,
  jsScriptExecutor,
  dictApi,
  fileApi,
  UploadFileParams,
  PageQueryRequest,
  PageQueryResponse,
  QueryResult,
  SelectOption,
  Pagination,
  applicationApi,
  QueryAppForm,
  securityApi,
  QueryOrgForm,
  QueryUserForm,
  QueryDictItemForm,
  QueryDictForm,
  QueryPermissionForm,
  QueryPermissionClassifyForm,
  QueryRoleForm,
  QueryRolePermissionForm,
  QueryTableRolePermissionClassifyForm,
  QueryColumnRolePermissionForm,
  QueryEncodingForm,
  modelApi,
  QueryConnectForm,
  QueryTableForm,
  QueryMultiComponentForm,
  QueryTableColumnForm,
  QueryTableForeignForm,
  QueryViewForm,
  QueryAppTableForm,
  QueryAppViewForm,
  ColumnSelectType,
  encodingApi,
  executeObjectPropsExpressions,
  executeArrayExpressions,
  SubmitFormResult,
  UiEventNames,
  getUserCompany
}
// 默认导出组件
export default component
