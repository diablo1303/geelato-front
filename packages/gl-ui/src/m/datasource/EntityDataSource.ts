import ResultMapping from "./ResultMapping";

const copDict = {
  eq: '等于',
  neq: '不等于',
  lt: '小于',
  lte: '小于等于',
  gt: '大于',
  gte: '大于等于',
  sw: '开头包括',
  ew: '结尾包括',
  contains: '包括'
}
const cops = [
  {text: '等于', value: 'eq'},
  {text: '不等于', value: 'neq'},
  {text: '小于', value: 'lt'},
  {text: '小于等于', value: 'lte'},
  {text: '大于', value: 'gt'},
  {text: '大于等于', value: 'gte'},
  {text: '开头包括', value: 'sw'},
  {text: '结尾包括', value: 'ew'},
  {text: '包括', value: 'contains'}
]
export const compareMeta = {cops, copDict}

export class FieldMeta {
  name:string = '';
  title:string = '';
  [key: string]: any
}

export class EntityLiteMeta{
  entityName:string = '';
  entityTitle:string = '';
}

export class EntityMeta extends EntityLiteMeta{
  fieldMetas:Array<FieldMeta> = [];
  [key: string]: any
}

export class EntityReaderParam {
  name: string = '';
  cop: string = 'eq';
  value: string = '';
}
export class EntityReaderOrder{
  // 排序字段
  field:string='';
  // 上降序 '+' | '-'
  order:string='+'
}
export class EntityReader {
  // 实体名称
  entity: string = '';
  // 实体标题
  // title:string = ''
  // 查询的字段(列)
  fields: Array<FieldMeta> = [];
  // 查询过滤参数
  params: Array<EntityReaderParam> = [];
  // 第几页
  pageNo: number = 0;
  // 每页记录数
  pageSize: number = 15;
  // 排序字段
  order:Array<EntityReaderOrder> = [];
  // 查询时，是否同时加载元数据信息，默认为否
  withMeta: boolean = false;
  // 查询结果转换 TODO
  resultMapping: ResultMapping = new ResultMapping();
  // 实体数据查询描述
  description: string = '';
}

export default {
}
// export default interface EntityReader {
//   clazz?: string;
//   entity: string;
//   fields: string;
//   params?: Array<EntityReaderParam>;
//   lazy: boolean;
//   pageNo: number;
//   pageSize: number;
//   order: string;
//   withMeta: boolean;
//   resultMapping: ResultMapping;
//   description: string;

  /**
   * @param entity 实体名称
   * @param lazy 是否懒加载，默认为是
   * @param fields e.g. 'name,code'
   * @param params e.g. [{name:'provinceCode',cop:'eq',value:'gs:$ctx.form.province'}]，该信息会自动加入计算属性中，当province的值变动时，该数据源会重新加载计算
   * @param resultMapping 查询返回结果字段的转换映射
   * @param description
   */
  // constructor(info: EntityDataReaderInfo) {
  //     // 实体数据源
  //     this.clazz = 'EntityDataReaderInfo'
  //     // 实体编码
  //     this.entity = info.entity
  //     this.fields = info.fields
  //     // 带参数查询的数据源
  //     this.params = info.params
  //     this.lazy = info.lazy
  //     this.pageNo = info.pageNo
  //     this.pageSize = info.pageSize
  //     this.order = info.order
  //     // 查询结果是否返回元数据（schema）
  //     this.withMeta = info.withMeta
  //     this.resultMapping = info.resultMapping
  //     this.description = info.description
  // }
// }
