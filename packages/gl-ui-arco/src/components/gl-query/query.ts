import type { ComponentInstance } from '@geelato/gl-ui-schema'
import type {PageProvideProxy} from "@geelato/gl-ui";

export default class QueryItem {
  id: string = ''
  // title: string = "";
  // name: string = "";
  colspan: number = 6
  // 操作
  cop: string = 'eq'
  // 是否在高级查询中展示
  isAdvanceQuery: boolean = false
  // 是否隐藏，不展示的场景示例：作为默认内置的查询条件
  // isHidden: boolean = false
  // 默认值表达式，如果有，则取该值
  // valueExpression?: string
  // 组件
  component?: ComponentInstance
  // 该条件加入分组，和其它同组名的条件形成or条件分组，组合后与其它无组件的条件形成and条件
  groupName?: string
}

/**
 *  查询项的键值对
 */
export class QueryItemKv {
  key: string = ''
  value?: any
}

/**
 *
 * 取值方式A、通过默认通用关键字query获取查询条件值，好处就是在配置打开页面传参时，不需要配置具体实体名，配置方便
 * 取值方式B、同时支持通过关键字$query来获取查询条件值
 * 取值方式C、同时支持通过当前查询绑定的对象实体名称来获取字段值
 * 取值方式C会覆盖B方式，会覆盖A方式
 * ！！！注意，该方式在同一页面多查询列表时，通过query或$query很可能会污染多个查询列表，没法做到精确控制哪个列表的查询是否需要传值
 * 若需要精确控制，可以通过不同的参数名进行区分（如通过将组件id作为参数名），但因id可理解性差，在配置时，可能看不明白该参数名到底对应哪个查询组件
 * 示例如：页面配置参数为：query.axx=1,query.bxx=2，pageQueryParams为{axx:1,bxx:2}
 * @param pageProvideProxy
 * @param entityName
 */
export const getQueryParams = (
    pageProvideProxy: PageProvideProxy,
    entityName?:string
) => {

  const queryParams = pageProvideProxy.getParamsByPrefixAsObject('query')
  // 这种带$的关键字来替换上面的query，避免实休名为query时冲突
  const queryParamsByKeywordFlag = pageProvideProxy.getParamsByPrefixAsObject('$query')
  // 通过绑定实体名获取参数，确保多层的列表嵌套时，各层列表都能获取到各自的列表参数
  const queryParamsByEntityName = entityName
      ? pageProvideProxy.getParamsByPrefixAsObject(entityName)
      : {}
  // console.log(
  //     '获取的列表参数来源，query.xxx:',
  //     queryParams,
  //     '$query.xxx:',
  //     queryParamsByKeywordFlag,
  //     (entityName || 'entityName') + '.xxx:',
  //     queryParamsByEntityName
  // )
  // 合并三种模式下的传值
  Object.assign(queryParams, queryParamsByKeywordFlag, queryParamsByEntityName)
  // console.log('获取的列表参数合并为：', queryParams)
  return queryParams || {}
}