import type { ComponentInstance } from '@geelato/gl-ui-schema'

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
