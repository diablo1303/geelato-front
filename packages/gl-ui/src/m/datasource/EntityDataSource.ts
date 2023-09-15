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
    contains: '包括',
    nil:'是否空'
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
    {text: '包括', value: 'contains'},
    {text: '在范围', value: 'in'},
    {text: '是否空', value: 'nil'}
]


export const compareMeta = {cops, copDict}

export class FieldMeta {
    name: string = '';
    title: string = '';
    alias: string = '';
    // 是否本地计算字段，即基于查询回来的结果在本进行计算，该字段不转到服务端
    isLocalComputeFiled: boolean = false;
    valueExpression?: string = '';

    [key: string]: any

    constructor(name?: string, alias?: string, title?: string) {
        this.title = title || ''
        this.name = name || ''
        this.alias = alias || ''
    }
}

export class EntityLiteMeta {
    entityName: string = '';
    entityTitle: string = '';
}

export class EntityMeta extends EntityLiteMeta {
    fieldMetas: Array<FieldMeta> = [];

    [key: string]: any
}

export class EntityReaderParam {
    name: string = '';
    cop: string = 'eq';
    value: string | number | Array<string | number> | undefined;
    // 值表达式
    valueExpression?: string

    constructor(name?: string, cop?: string, value?: string | number | Array<string | number>) {
        this.name = name || ''
        this.cop = cop || 'eq'
        this.value = value
    }
}

export enum EntityReaderOrderEnum {
    ASE = '+',
    DESC = '-'
}

export class EntityReaderOrder {
    field: string = '';
    order: string = '+'

    /**
     *
     * @param field 排序字段
     * @param order 上降序 '+' | '-'
     */
    constructor(field?: string, order?: string) {
        this.field = field || ''
        this.order = order || '+'
    }
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
    pageSize: number = 500;
    // 排序字段
    order: Array<EntityReaderOrder> = [];
    // 查询时，是否同时加载元数据信息，默认为否
    withMeta: boolean = false;
    // 查询结果转换 TODO
    resultMapping: ResultMapping = new ResultMapping();
    // 实体数据查询描述
    description: string = '';
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
        const ary = fieldStr.split(",")
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
}

/**
 *  实体保存对象，一条记录对应一个EntitySaver
 */
export class EntitySaver {
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

}
