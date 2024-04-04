import ResultMapping from './ResultMapping'
import utils from '../utils/Utils'

const copDict = {
  eq: '等于',
  neq: '不等于',
  lt: '小于',
  lte: '小于等于',
  gt: '大于',
  gte: '大于等于',
  sw: '开头包括',
  ew: '结尾包括',
  contains: '包括',
  nil: '是否空',
  bt: '在...两值之间',
  in: '在数组范围',
  nin: '不在数组范围'
}
const cops = [
  { text: '等于', value: 'eq' },
  { text: '不等于', value: 'neq' },
  { text: '小于', value: 'lt' },
  { text: '小于等于', value: 'lte' },
  { text: '大于', value: 'gt' },
  { text: '大于等于', value: 'gte' },
  { text: '开头包括', value: 'sw' },
  { text: '结尾包括', value: 'ew' },
  { text: '包括', value: 'contains' },
  { text: '在数组范围', value: 'in' },
  { text: '不在数组范围', value: 'nin' },
  { text: '是否空', value: 'nil' },
  { text: '在...两值之间', value: 'bt' }
]

export const compareMeta = { cops, copDict }

export const keyFiledName = 'id'

/**
 *   字段元数据示例：{
 *   charMaxLength: '19',
 *   comment: '所属流程定义',
 *   defaultValue: '5043740024504455168',
 *   name: 'proceDefId',
 *   nullable: false,
 *   precision: 0,
 *   scale: 0,
 *   selectType: 'ENTITY',
 *   title: '所属流程定义',
 *   type: 'String',
 *   typeExtra: '5043739996989820928'
 *   }
 */
export class FieldMeta {
  name: string = ''
  title: string = ''
  alias: string = ''
  // 是否本地计算字段，即基于查询回来的结果在本进行计算，该字段不传到服务端
  isLocalComputeFiled: boolean = false
  valueExpression?: string = '';

  [key: string]: any
  // charMaxLength: '19'
  // charMaxLength: string
  // // comment: '所属流程定义'
  // comment: string
  // // defaultValue: '5043740024504455168'
  // efaultValue: any
  // // name: 'proceDefId'
  // name: string
  // // nullable: false
  // nullable: boolean
  // // recision: 0
  // precision: number
  // // cale: 0
  // scale: number
  // // selectType: 'ENTITY'
  // selectType: string
  // // title: '所属流程定义'
  // title: string
  // // type: 'String'
  // type: string
  // // typeExtra: '5043739996989820928'
  // typeExtra: string

  constructor(name?: string, alias?: string, title?: string) {
    this.title = title || ''
    this.name = name || ''
    this.alias = alias || ''
  }
}

export class EntityLiteMeta {
  entityName: string = ''
  entityTitle: string = ''
}

export class EntityMeta extends EntityLiteMeta {
  fieldMetas: Array<FieldMeta> = [];

  [key: string]: any
}

export class EntityReaderParam {
  groupName: string = ''
  name: string = ''
  // cop的值为：eq,neq,lt,lte,gt,gte,sw(startwith),ew(endwith),contains,in,between,nil中的一个
  cop: string = 'eq'
  value: string | number | boolean | Array<string | number | boolean> | undefined
  // 值表达式
  valueExpression?: string

  constructor(
    name?: string,
    cop?: string,
    value?: string | number | boolean | Array<string | number | boolean>,
    groupName?: string,
    valueExpression?: string
  ) {
    this.name = name || ''
    this.cop = cop || 'eq'
    this.value = value
    this.setGroupName(groupName)
    this.valueExpression = valueExpression
  }

  getGroupName() {
    return this.groupName
  }

  setGroupName(groupName?: string) {
    this.groupName = groupName || ''
  }

  isGroup() {
    return false
  }

  /**
   *  转换成Mql格式的参数名
   */
  static getMqlParamName(param: EntityReaderParam) {
    return `${param.name}|${param.cop || 'eq'}`
  }

  /**
   *  转换成Mql格式的参数值
   *  将boolean转成tinyint，和服务端数据库存储的数据一致
   */
  static getMqlParamValue(param: EntityReaderParam) {
    // console.log('getMqlParamValue>param:',param)
    const valueType = typeof param.value
    switch (valueType) {
      case 'boolean':
        return param.value ? 1 : 0
      case 'object':
        if (param.value && param.cop === 'in' && utils.isArray(param.value)) {
          // const valueItems: Array<string|number> = []
          // param.value.forEach((valueItem:string|number)=>{
          //
          // })
          // @ts-ignore
          return JSON.stringify(param.value)
        }
        return param.value
      default:
        return param.value
    }
  }

  /**
   *  转换成Mql格式的参数对象
   */
  static getMqlParam(param: EntityReaderParam) {
    return { [EntityReaderParam.getMqlParamName(param)]: EntityReaderParam.getMqlParamValue(param) }
  }
}

export class EntityReaderParamGroup {
  static readonly DEFAULT_NAME = '__'
  static readonly GROUP_SPLIT_FLAG = '>'
  // 逻辑运算符 and、or
  readonly logic: string = 'or'
  // 分组名
  readonly name: string = ''
  // 子分组
  readonly children: Array<EntityReaderParamGroup | EntityReaderParam> = []

  /**
   * @param simpleGroupName or:groupA，该groupName为只有一级的分组名称
   */
  constructor(simpleGroupName: string) {
    const items = simpleGroupName.split(':')
    if (items.length === 1) {
      // 表示没有“:”,默认为and
      this.logic = 'and'
      this.name = items[0] || EntityReaderParamGroup.DEFAULT_NAME
    } else if (items.length === 2) {
      this.logic = items[0]
      this.name = items[1] || EntityReaderParamGroup.DEFAULT_NAME
    } else {
      console.error('实体查询参数的分组格式不对，', simpleGroupName)
      throw new Error('实体查询参数的分组格式不对')
    }
  }

  /**
   * 获取组合后的组名
   */
  getGroupName() {
    return `${this.logic}:${this.name}`
  }

  isGroup() {
    return true
  }

  isSameGroup(groupName: string) {
    return this.getGroupName() === groupName
  }

  /**
   * 在push时，会依据当前的groupNamePath和groupLevel来分析是否将param设置到该层（groupLevel），
   * 可能需创建子级EntityReaderParamGroup，再调用push
   * @param param 最终的参数
   * @param groupNamePath 分组名可能是 or:groupA>and:groupB这样的嵌套格式（分组名称路径）
   * @param groupLevel 参数设置到第几层分组，默认为0
   */
  push(param: EntityReaderParam, groupNamePath: string, groupLevel: number = 0) {
    if (!param.groupName) {
      throw new Error('实体查询参数的分组名称不能为空。')
    }
    const groups = groupNamePath.split(EntityReaderParamGroup.GROUP_SPLIT_FLAG)
    // 多级分组，且是有效的分组层次时
    if (groups.length > 1 && groups.length > groupLevel) {
      const simpleGroupName = groups[groupLevel]
      const foundItem = this.children.find((item) => {
        return typeof item.getGroupName === 'function' && item.getGroupName() === simpleGroupName
      })
      if (foundItem) {
        if (foundItem.isGroup()) {
          const foundGroup = foundItem as EntityReaderParamGroup
          foundGroup.push(param, groupNamePath, groupLevel + 1)
        }
      } else {
        // 对于根级，已存在，不需要new，直接push子级即可
        if (groupLevel === 0) {
          this.push(param, groupNamePath, groupLevel + 1)
        } else {
          // 没有找取当前已存在的子分组，则创建一个子分组
          const newGroup = new EntityReaderParamGroup(groups[groupLevel])
          this.children.push(newGroup)
          newGroup.push(param, groupNamePath, groupLevel + 1)
        }
      }
    } else {
      this.children.push(param)
    }
  }
}

export enum EntityReaderOrderEnum {
  ASE = '+',
  DESC = '-'
}

export class EntityReaderOrder {
  field: string = ''
  order: string = '+'

  /**
   *
   * @param field 排序字段
   * @param order 上降序 'ascend' | 'descend' | ''
   */
  constructor(field?: string, order?: string) {
    this.field = field || ''
    this.order = this.convert(order) || '+'
  }

  /**
   * @param order 'ascend' | 'descend' | ''
   */
  convert(order?: string) {
    switch (order) {
      case 'ascend':
        return '+'
      case 'descend':
        return '-'
      default:
        return order
    }
  }
}

export class EntityReader {
  // 实体名称
  entity: string = ''
  // 实体标题
  // title:string = ''
  // 查询的字段(列)
  fields: Array<FieldMeta> = []
  // 查询过滤参数
  params: Array<EntityReaderParam> = []
  // 第几页
  pageNo: number = 0
  // 每页记录数
  pageSize: number = 500
  // 排序字段
  order: Array<EntityReaderOrder> = []
  // 查询时，是否同时加载元数据信息，默认为否
  withMeta: boolean = false
  // 查询结果转换 TODO
  resultMapping: ResultMapping = new ResultMapping()
  // 实体数据查询描述
  description: string = ''
  // 是否立即加载
  immediate?: boolean = true
  // 懒加载，默认为false，是指用于级联数据加载时，分步加载
  lazyLoad?: boolean = false

  /**
   * 将字符串格式转成数组
   * 字符串支持别名，如：id key
   * @param fieldStr id key,name,age,...
   */
  public setFields(fieldStr: string) {
    if (!fieldStr) return []
    const fields: FieldMeta[] = []
    const ary = fieldStr.split(',')
    ary.forEach((field) => {
      const fieldNameAliasName = field.split(new RegExp('\\s+'))
      if (fieldNameAliasName.length === 2) {
        fields.push(new FieldMeta(fieldNameAliasName[0], fieldNameAliasName[1]))
      } else {
        fields.push(new FieldMeta(field))
      }
    })
    this.fields.length = 0
    this.fields.push(...fields)
    return this.fields
  }

  /**
   * 添加参数
   * @param name
   * @param cop
   * @param value
   * @param groupName
   * @param valueExpression
   */
  public addParam(
    name: string,
    cop: string,
    value: string | number | boolean | Array<string | number | boolean>,
    groupName?: string,
    valueExpression?: string
  ) {
    this.params.push(new EntityReaderParam(name, cop, value, groupName, valueExpression))
  }

  /**
   * 添加排序字段，可以多次调用，添加多个排序
   * @param field 排序字段名
   * @param order 上降序 默认为升序 'ascend' | 'descend' | '+' | ‘-’
   */
  public addOrder(field: string, order?: string){
    this.order.push(new EntityReaderOrder(field,order))
  }
}

export enum EntityRecordStatus {
  // 外部基于id关联push进来的，但还未保存到服务端
  Pushed = 'Pushed',
  // 外部基于id关联，将已push进来的记录unPush，但还未保存到服务端
  UnPushed = 'UnPushed',
  // 从数据库查出来的数据默认状态为Normal或空
  Normal = 'Normal',
  // 新创建，还未保存到服务端
  New = 'New',
  // 有更新，还未保存到服务端
  Update = 'Update'
}

/**
 *  实体保存对象，一条记录对应一个EntitySaver
 */
export class EntitySaver {
  /**
   *  一般同组件id，即该entitySaver是基于哪个组件创建的，则采用该id，如GlEntityForm的id、GlEntityTablePlus的id
   *  在基于脚本编码时可能不会设置该值，此时为空
   */
  id?: string = ''
  /**
   *  实体名称
   */
  entity: string = ''
  /**
   *  本实体作为子实体时，指向父实体id字段的外健字段的名称
   */
  pidName?: string = ''
  /**
   *  保存的记录
   */
  record: Record<string, any> = {}

  /**
   *  数据记录的状态
   */
  recordStatus?: EntityRecordStatus
  /**
   *  子表单
   */
  children: EntitySaver[] = []

  constructor(entity?: string) {
    this.entity = entity || ''
  }
}

/**
 *  调用组件getEntitySavers方法的获取返回结果
 *  默认值为失败
 */
export class GetEntitySaversResult {
  // 如果在获取时，组件对数据验证不通过，则为true
  error: boolean = true
  // 获取的结果
  values: EntitySaver[] = []
  // 数据验证不通过，未能成功构建并获取保存对象！
  message: string = '数据验证不通过，未能成功构建并获取保存对象'
  // 组件名
  componentName: string = ''
  // 验证结果
  validateResult?: object
}

export default {
  EntityReader,
  EntitySaver,
  FieldMeta,
  EntityMeta,
  EntityLiteMeta,
  EntityReaderOrderEnum,
  EntityReaderParam,
  EntityReaderOrder,
  EntityReaderParamGroup,
  GetEntitySaversResult,
  ConstObject: {
    keyFiledName,
    copDict,
    cops
  }
}
