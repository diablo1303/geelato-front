// 页面类型
// export type PageType = 'freePage' | 'formPage' | 'listPage' | 'blockPage' | 'tableEditPage'
import type {AxiosInstance, AxiosStatic} from 'axios'
import type {App} from 'vue'
import type {Pinia} from "pinia";

export type GeelatoPluginOptions = {
  axios: AxiosStatic | AxiosInstance
  ctx?: Record<string, any>
  router?: any
  pinia?: Pinia
}

export type GeelatoPlugin = {
  // vue插件安装
  install: (app: App) => any
  // 初始化Geelato，需要在vue install之后执行
  setupGeelato: (options?: GeelatoPluginOptions) => any
}

export enum PageType {
  freePage = 'freePage',
  formPage = 'formPage',
  listPage = 'listPage',
  tableEditPage = 'tableEditPage',
  blockPage = 'blockPage',
  emptyPage = 'emptyPage',
  // 流程页面
  flowPage = 'flowPage'
}

export enum PageStatus {
  // 默认的状态，不指定是只读还是编辑状态，如可用在列表页面，在列表页面中查询区域是可编辑的，数据列区域有可能可编辑，也有可能不可编辑。
  none = 'none',
  // 只读，如可用于表单页面，表单的组件可不可编辑
  read = 'read',
  // 创建，如可用于表单页面，表单的组件可编辑
  create = 'create',
  // 复制并创建，如可用于表单页面，表单的组件可编辑，且此时表单无id
  copyCreate = 'copyCreate',
  // 更新，如可用于表单页面，表单的组件可编辑，且此时表单有id
  update = 'update'
}

/**
 * 加载页面的配置信息
 */
export type PageConfig = {
  pageId: string
  extendId?: string
  params: Array<Param>
  pageStatus?: PageStatus
  pageTemplateName?: string
  pageTemplateProps?: object
}

/**
 *  页面接受的参数定义
 *  便于其它页面在调用时，清楚应传入的参数
 */
export interface ParamMeta {
  name: string
  title?: string
  required?: boolean
  type?: any
  description?: string
}

// 页面参数、方法调用参数
export interface Param {
  // 只用于展示不参与计算等
  title?: string
  name: string
  value: any
  valueExpression?: string | object
}

export enum ApiResultStatus {
  SUCCESS = 'ok',
  FAIL = 'fail'
}

/**
 *  api 查询返回结果
 */
export interface ApiResult {
  msg: string
  code: number
  status: ApiResultStatus
  data: any
}

/**
 *  api 分页查询返回结果
 */
export interface ApiPagedResult extends ApiResult {
  total: number
  page: number
  size: number
  dataSize: number
  meta?: Object
}

/**
 * 组件实体权限
 */
export interface InstPermission {
  // instId
  code: string
  // r | w
  rule: string
}

export enum CellValueType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  DATETIME = 'DATETIME'
}

export const CellValueTypeOptions = [
  {label: '字符串', value: 'STRING'},
  {label: '数值', value: 'NUMBER'},
  {label: '日期', value: 'DATE'},
  {label: '时间', value: 'DATETIME'}
]

export interface CellMeta {
  name: string
  valueType: CellValueType
}

export const IMAGE_MIME = [
  "image/pict",
  "image/x-pict",
  "image/bmp",
  "image/x-bmp",
  "image/ico",
  "image/x-icon",
  "image/jpeg",
  "image/jpg",
  "image/tiff",
  "image/x-tiff",
  "image/xbm",
  "image/x-xbm",
  "image/gif",
  "image/png",
  "image/webp",
  "image/svg+xml"
]

export const FILE_MIME = [
  {"label": ".pict", "value": "image/pict"},
  {"label": ".pict", "value": "image/x-pict"},
  {"label": ".bmp", "value": "image/bmp"},
  {"label": ".bmp", "value": "image/x-bmp"},
  {"label": ".ico", "value": "image/ico"},
  {"label": ".ico", "value": "image/x-icon"},
  {"label": ".jpeg", "value": "image/jpeg"},
  {"label": ".jpg", "value": "image/jpg"},
  {"label": ".tiff", "value": "image/tiff"},
  {"label": ".tiff", "value": "image/x-tiff"},
  {"label": ".xbm", "value": "image/xbm"},
  {"label": ".xbm", "value": "image/x-xbm"},
  {"label": ".gif", "value": "image/gif"},
  {"label": ".png", "value": "image/png"},
  {"label": ".webp", "value": "image/webp"},
  {"label": ".svg", "value": "image/svg+xml"}
]
