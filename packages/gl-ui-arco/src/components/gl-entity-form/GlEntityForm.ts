import type { PageProvideProxy } from '@geelato/gl-ui'

// export interface EntitySavingObject {
//   key: string
//   value: Array<Record<string, any>>
// }

export const getFormParams = (
  pageProvideProxy: PageProvideProxy,
  bindEntity?: Record<string, any>
) => {
  const formParams = pageProvideProxy.getParamsByPrefixAsObject('form')
  // 这种带$的关键字来替换上面的form，避免实休名为form时冲突
  const formParamsByKeywordFlag = pageProvideProxy.getParamsByPrefixAsObject('$form')
  // 通过绑定实体名获取参数，确保多层的表单嵌套时，各层表单都能获取到各自的表单参数
  const formParamsByEntityName = bindEntity
    ? pageProvideProxy.getParamsByPrefixAsObject(bindEntity.entityName)
    : {}
  // console.log('formParams', formParams, 'formParamsByEntityName', formParamsByEntityName)
  // 合并两种模式下的传值
  Object.assign(formParams, formParamsByKeywordFlag, formParamsByEntityName)
  return formParams || {}
}


export interface ValidatedError {
  label: string;
  field: string;
  value: any;
  type: string;
  isRequiredError: boolean;
  message: string;
}

/**
 *  表单、子表单等验证返回结果
 *  默认值为失败
 */
export class ValidateResult {
  // 如果在获取时，组件对数据验证不通过，则为true
  error: boolean = true
  // 获取的结果
  values: any[] = []
  // 数据验证不通过，未能成功构建并获取保存对象！
  message: string = '数据验证不通过'
}