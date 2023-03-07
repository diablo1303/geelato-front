import TypeEnums from "./TypeEnums";

/**
 *  属性元数据
 */
export default class PropertyMeta {

    // 属性分组，用于在设计器中分组展示属性，便于配置
    group?: string
    // 显示名称。显示在设计器中
    title: string
    // 属性名（key），存储在配置中
    name: string
    // 默认为value，对于Radio则为checked，使用时v-model:checked
    vModelName?: string
    // 属性类型，如String | Number | Boolean
    type: TypeEnums
    // 配置该属性的组件名A
    componentName?: string
    // 可选值，如对于size属性[{label: 'medium', value: 'medium'}, {label: 'small', value: 'small'}, {label: 'mini', value: 'mini'}
    data?: Array<any>
    // 若数据是动态生产成，可配置ds(dataSource)，基于ds加载的数据最终会设置到data中
    ds?: object
    // 默认值
    defaultValue?: any
    // 描述
    description?: string
    // 样式
    style?: object

    props?: object

    // 子属性
    properties?:Array<PropertyMeta>


    constructor(options: { title: string, name: string, type: TypeEnums, componentName?: string, vModelName?: string, defaultValue?: any, description?: any, group?: string, data?: Array<any>, ds?: object, props?: object, style?: object }) {
        this.title = options.title
        this.name = options.name
        this.type = options.type
        this.componentName = options.componentName || 'AInput'
        this.defaultValue = options.defaultValue
        this.description = options.description
        this.data = options.data || []
        this.ds = options.ds || {}
        this.vModelName = options.vModelName || (options.type === TypeEnums.Boolean ? 'checked' : 'value')
        this.props = options.props || {}
        this.style = options.style
    }

    static create(){
        return new PropertyMeta({title: '', name: '', type: TypeEnums.String})
    }
}
