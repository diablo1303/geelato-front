import {StyleSetterMeta} from "./StyleSetterMeta";

export default interface PropertySetterMeta {
    // 属性名
    name: String

    // 属性标题
    title: String

    // 分组,用于在设置面板中分组展示，包括：base 基础 | view 外观 | 数据 data
    group: String

    // 类型默认为normal， props 普通 | slots 插槽 | children 子组件 | innerHTML | JsonArray | JsonObject
    type?: String

    // 占位符
    placeholder?: String

    // 配置该属性的配置器组件名称
    setterComponentName: String

    // 配置器组件属性
    setterComponentProps: Object

    // 是否在设置面板中展示，TODO
    show: Boolean

    // 绑定的值字段名称, 如 value、checked、modelValue
    vModelName: String

    // 样式
    style?: StyleSetterMeta

    // 是否可以展开 TODO
    expanded: Boolean

    // xx
    // result: Object

    // 属性描述，用于在配置属性时，可以了解该属性的详细信息
    description?: String

    // 子属性，适用于Json结构配置的组件，如echarts中的组件
    properties?: Array<PropertySetterMeta>

    // 默认值，可用于压缩配置文件时，检查是否等于默认值，若等于默认值，则可以删除该配置的属性
    defaultValue?:any
}

export class PropertySetterMetaImpl implements PropertySetterMeta {
    expanded: Boolean;
    group: String;
    name: String;
    type: String;
    setterComponentName: String;
    setterComponentProps: Object;
    show: Boolean;
    title: String;
    vModelName: String;
    properties: Array<any>;

    constructor() {
        this.expanded = true
        this.group = 'base'
        this.name = ''
        this.setterComponentName = ''
        this.setterComponentProps = {}
        this.show = true
        this.title = ''
        this.type = ''
        this.vModelName = 'value'
        this.properties = []
    }

}
