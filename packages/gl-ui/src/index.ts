import {type App, reactive} from 'vue'
import Big from 'big.js'
import emitter from './m/mix/emitter'
import * as authUtil from "./m/utils/Auth";
import * as routeUtil from "./m/utils/RouteListener"
import * as eventUtil from "./m/utils/Event"
import * as monitorUtil from "./m/utils/Monitor"
import type {PageParamConfigType, PageTemplate,PagePermission} from './components/PageProvideProxy'
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
import isUtil from './m/utils/IsUtil'
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
import type {
  ApiPagedResult,
  ApiResult,
  ApiResultStatus,
  CellMeta,
  CellValueType,
  GeelatoPlugin,
  GeelatoPluginOptions,
  PageConfig,
  Param
} from './m/types/global'
import {CellValueTypeOptions, PageStatus, PageType} from './m/types/global'
import {executeArrayExpressions, executeObjectPropsExpressions} from './components/gl-component/GlComponentSupport'
/* 接口 */
import type {AppState, QueryAppForm, QueryMenuForm} from './m/datasource/ApplicationApi'
import * as applicationApi from './m/datasource/ApplicationApi'
import type {
  FormParams,
  FormState,
  HttpResponse,
  ListParams,
  ModelParams,
  PageQueryFilter,
  PageQueryRequest,
  PageQueryResponse,
  Pagination,
  QueryResult,
  SelectOption
} from './m/datasource/Base'
import type {QueryDictForm, QueryDictItemForm} from './m/datasource/DictApi'
import * as dictApi from './m/datasource/DictApi'
import type {EncodingItem, QueryEncodingForm} from './m/datasource/EncodingApi'
import * as encodingApi from './m/datasource/EncodingApi'
import type {AttachmentForm, Base64FileParams, UploadFileParams} from './m/datasource/FileApi'
import * as fileApi from './m/datasource/FileApi'
import type {BusinessMetaData, BusinessRuleData, BusinessTypeData, QueryFileTemplateForm} from './m/datasource/FileTemplateApi'
import * as fileTemplateApi from './m/datasource/FileTemplateApi'
import type {ChatRecord, MessageListType, MessageRecord} from './m/datasource/MessageApi'
import * as messageApi from './m/datasource/MessageApi'
import type {
  ColumnSelectType,
  DataTypeRadius,
  QueryAppTableForm,
  QueryAppViewForm,
  QueryConnectForm,
  QueryMultiComponentForm,
  QueryTableColumnForm,
  QueryTableForeignForm,
  QueryTableForm,
  QueryViewForm
} from './m/datasource/ModelApi'
import * as modelApi from './m/datasource/ModelApi'
import type {QueryAppRestfulForm, QueryRestfulForm, RestfulParams, RestfulRequest} from './m/datasource/RestfulApi'
import * as restfulApi from './m/datasource/RestfulApi'
import type {
  QueryColumnRolePermissionForm,
  QueryOrgForm,
  QueryOrgUserForm,
  QueryPermissionClassifyForm,
  QueryPermissionForm,
  QueryRoleAppForm,
  QueryRoleForm,
  QueryRolePermissionForm,
  QueryRoleTreeNodeForm,
  QueryRoleUserForm,
  QueryTableRolePermissionClassifyForm,
  QueryTableRolePermissionForm,
  QueryTreeNodeForm,
  QueryUserForm,
} from './m/datasource/SecurityApi'
import * as securityApi from './m/datasource/SecurityApi'
import type {QuerySysConfigForm} from './m/datasource/SysConfigApi'
import * as sysConfigApi from './m/datasource/SysConfigApi'
import type {TenantBaseForm, TenantIndexForm, TenantState} from './m/datasource/TenantApi'
import * as tenantApi from './m/datasource/TenantApi'
import type {AccountUserInfo, AuthCodeForm, BindAccountData, LoginData, LoginRes, ResetPasswordForm, UserState} from './m/datasource/UserApi'
import * as userApi from './m/datasource/UserApi'
import type {QueryAppVersionForm} from './m/datasource/VersionApi'
import * as versionApi from './m/datasource/VersionApi'
/* 接口 */
import GlInsts from './components/gl-component/GlInsts.vue'
import UiEventNames from './components/UiEventNames'
import GlLoop from './components/gl-loop/GlLoop.vue'
import GlTemplate from './components/gl-template/GlTemplate.vue'
import GlChart from './components/gl-chart/GlChart.vue'
import GlLoader from './components/gl-loader/GlLoader.vue'
import './assets/style.css'
import useLogger from './m/hooks/useLogger'
import {loadPageContent} from './components/PageLoader'
import {isLogin} from './m/utils/Auth'

const Utils = AllUtils

const component: GeelatoPlugin = {
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
  },
  setupGeelato: function (options?: GeelatoPluginOptions) {
    // 设置entityApi的依赖库
    if (options?.axios) {
      entityApi.setup(options.axios)
    }
  },
}

/**
 * 选择组件，用于设计时，点击组件的内置组件时，触发选中组件事件
 * @param event
 * @param inst
 */
const selectComponent = (event: any, inst: any) => {
  event.stopPropagation()
  event.preventDefault()
  emitter.emit(UiEventNames.Base.SelectComponent, inst)
}
export {
  PagePermission,
  isLogin,
  GeelatoPlugin,
  GeelatoPluginOptions,
  selectComponent,
  Big,
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
  CellMeta,
  CellValueType,
  CellValueTypeOptions,
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
  authUtil,
  eventUtil,
  monitorUtil,
  routeUtil,
  isUtil,
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
  /* 接口 */
  applicationApi,
  AppState,
  QueryAppForm,
  QueryMenuForm,
  HttpResponse,
  PageQueryRequest,
  PageQueryResponse,
  Pagination,
  QueryResult,
  SelectOption,
  ListParams,
  FormState,
  PageQueryFilter,
  FormParams,
  ModelParams,
  dictApi,
  QueryDictForm,
  QueryDictItemForm,
  encodingApi,
  EncodingItem,
  QueryEncodingForm,
  fileApi,
  AttachmentForm,
  Base64FileParams,
  UploadFileParams,
  fileTemplateApi,
  BusinessTypeData,
  BusinessRuleData,
  BusinessMetaData,
  QueryFileTemplateForm,
  messageApi,
  ChatRecord,
  MessageListType,
  MessageRecord,
  modelApi,
  DataTypeRadius,
  ColumnSelectType,
  QueryAppTableForm,
  QueryAppViewForm,
  QueryConnectForm,
  QueryMultiComponentForm,
  QueryTableColumnForm,
  QueryTableForeignForm,
  QueryTableForm,
  QueryViewForm,
  restfulApi,
  QueryRestfulForm,
  QueryAppRestfulForm,
  RestfulParams,
  RestfulRequest,
  securityApi,
  QueryOrgForm,
  QueryUserForm,
  QueryOrgUserForm,
  QueryPermissionForm,
  QueryPermissionClassifyForm,
  QueryTableRolePermissionClassifyForm,
  QueryTreeNodeForm,
  QueryRoleForm,
  QueryRoleAppForm,
  QueryRoleUserForm,
  QueryRoleTreeNodeForm,
  QueryRolePermissionForm,
  QueryTableRolePermissionForm,
  QueryColumnRolePermissionForm,
  sysConfigApi,
  QuerySysConfigForm,
  tenantApi,
  TenantState,
  TenantBaseForm,
  TenantIndexForm,
  userApi,
  AccountUserInfo,
  AuthCodeForm,
  BindAccountData,
  LoginData,
  LoginRes,
  ResetPasswordForm,
  UserState,
  versionApi,
  QueryAppVersionForm,
  /* 接口 */
  executeObjectPropsExpressions,
  executeArrayExpressions,
  SubmitFormResult,
  UiEventNames,
}
// 默认导出组件
export default component
