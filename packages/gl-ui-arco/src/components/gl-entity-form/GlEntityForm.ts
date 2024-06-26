import type { PageProvideProxy, Param } from '@geelato/gl-ui'

// export interface EntitySavingObject {
//   key: string
//   value: Array<Record<string, any>>
// }

/**
 *
 * 取值方式A、通过默认通用关键字form获取的表单值，好处就是在配置打开页面传参时，不需要配置具体表单名，配置方便
 * 取值方式B、同时支持通过关键字$form来获取表单值
 * 取值方式C、同时支持通过当前表单绑定的对象实体名称来获取表单值, 比如：il_eco.id,il_eco为实体名称
 * 取值方式D、同时支持通过组件属性传参，比如：params=[{name: 'id', value: 1}]
 * 取值方式D，会覆盖方式C、会覆盖B方式，会覆盖A方式
 * ！！！注意，该方式在同一页面多表单嵌套时，通过form或$form很可能会污染子级表单的值，没法做到精确控制表单传值
 * @param pageProvideProxy
 * @param bindEntity
 * @param params
 */
export const getFormParams = (
  pageProvideProxy: PageProvideProxy,
  bindEntity?: Record<string, any>,
  params?: Array<Param>
) => {
  const formParams = pageProvideProxy.getParamsByPrefixAsObject('form')
  // 这种带$的关键字来替换上面的form，避免实休名为form时冲突
  const formParamsByKeywordFlag = pageProvideProxy.getParamsByPrefixAsObject('$form')
  // 通过绑定实体名获取参数，确保多层的表单嵌套时，各层表单都能获取到各自的表单参数
  const formParamsByEntityName = bindEntity
    ? pageProvideProxy.getParamsByPrefixAsObject(bindEntity.entityName)
    : {}
  // 通过组件属性传参，获取参数值
  const propsParams: Record<string, any> = {}
  if (params) {
    for (const param of params) {
      propsParams[param.name] = param.value
    }
  }

  console.log(
    'GlEntityForm > 获取的表单参数，来源1，form.xxx:',
    formParams,
    '来源2，$form.xxx:',
    formParamsByKeywordFlag,
    '来源3,' + (bindEntity?.entityName || 'entityName') + '.xxx:',
    formParamsByEntityName,
    '来源4，props.params:',
    propsParams
  )
  // 合并四种模式下的传值
  Object.assign(formParams, formParamsByKeywordFlag, formParamsByEntityName, propsParams)
  console.log('GlEntityForm > 获取的表单参数，4个来源合并为：', formParams)
  return formParams || {}
}

export interface ValidatedError {
  label: string
  field: string
  value: any
  type: string
  isRequiredError: boolean
  message: string
  // 列表时，附上列表记录
  records?: any
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
