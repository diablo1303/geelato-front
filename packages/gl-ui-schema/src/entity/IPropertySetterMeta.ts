import type StyleSetterMeta from "./StyleSetterMeta";
import {SetterComponentPropsMetaImpl} from "./SetterComponentPropsMetaImpl";

export default interface IPropertySetterMeta {
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

    setterComponentDefaultValue?: any

    // 配置器组件属性
    setterComponentProps: SetterComponentPropsMetaImpl

    // 配置器组件默认值
    setterDefaultValue?: any

    // 是否在设置面板中展示，不显示时，常与默认值配合使用
    show?: Boolean

    // 展示模式 tile | collapse
    displayMode?: String

    // 绑定的值字段名称, 如 value、checked、modelValue
    setterComponentVModelName: String

    // 样式
    style?: StyleSetterMeta

    // 是否可以展开 TODO
    expanded?: Boolean

    // 配置的数据内容
    dataItems?: Array<any>

    // 属性描述，用于在配置属性时，可以了解该属性的详细信息
    description?: String

    // 子属性，适用于Json结构配置的组件，如echarts中的组件
    properties?: Array<IPropertySetterMeta>

    // 默认值，可用于压缩配置文件时，检查是否等于默认值，若等于默认值，则可以删除该配置的属性
    defaultValue?: any

    // 在属性设置器中，若该属性为数组对象属性时，指定数组中对象的某一属性作为标题
    titleField?: String

    // 子标题，与titleField配合使用
    subTitleField?: String

    // 配置了子标题字段，但获取不到子标题时告警
    alarmIfNoSubTitle?: string;

    // type为slots时有值
    slotComponentName?: String

    // 将配置该的结果绑定到槽渲染组件的v-model中还是v-bind中,默认为v-model
    slotComponentBindTarget?: String

    // 绑定的名称xxxName，结合slotComponentBindTarget使用，如v-bind:xxxName，v-model:xxxName
    slotComponentBindName?: String

    subComponentName?: String;

    subComponentCount?: Number

    // 是否启用值表达式，用于结合上下文的信息、相关逻辑计算得出value
    enableValueExpress?: Boolean

    // 是否为变量属性，脚本编排中使用
    isBlockVarProp?:boolean

}

export class PropertySetterMetaImpl implements IPropertySetterMeta {
    expanded: boolean;
    group: string;
    name: string;
    type: string;
    setterComponentName: string;
    setterComponentProps: SetterComponentPropsMetaImpl;
    setterDefaultValue: undefined;
    show: boolean;
    displayMode?: string;
    title: string;
    setterComponentVModelName: string;
    dataItems: Array<any>;
    properties: Array<any>;
    titleField: string;
    subTitleField?: string;
    alarmIfNoSubTitle?: string;
    slotComponentName: string;
    slotComponentBindTarget: string;
    slotComponentBindName?: string;
    subComponentName?: string;
    subComponentCount?: number
    placeholder?: string
    style?: StyleSetterMeta
    description?: string
    enableValueExpress?: boolean

    constructor() {
        this.expanded = true
        this.group = 'base'
        this.name = ''
        this.setterComponentName = ''
        this.setterComponentProps = new SetterComponentPropsMetaImpl()
        this.show = true
        this.title = ''
        this.type = ''
        this.setterComponentVModelName = 'modelValue'
        this.properties = []
        this.dataItems = []
        this.titleField = 'title'
        this.slotComponentName = ''
        this.slotComponentBindTarget = 'v-model'
        this.slotComponentBindName = ''
        this.placeholder = ''
        this.style = {}
        this.enableValueExpress = false
    }

}
