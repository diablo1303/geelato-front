// 页面类型
// export type PageType = 'freePage' | 'formPage' | 'listPage' | 'blockPage' | ''

export enum PageType {
  freePage = 'freePage',
  formPage = 'formPage',
  listPage = 'listPage',
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
  name:string
  title?:string
  required?:boolean
  type?:any
  description?:string
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
