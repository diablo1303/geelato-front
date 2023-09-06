// 页面类型
export type PageType = 'freePage' | 'fromPage' | 'listPage' | 'blockPage' | ''

// 页面参数、方法调用参数
export interface Param {
    name: string,
    value: any,
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
    msg: string;
    code: number;
    status: ApiResultStatus;
    data: any;
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