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
