export type TypeProps = "props" | "slots" | "children"

export class PropertySetterBuilderMeta {

    style:object = {}
    // 属性名
    name:string = ''
    // 属性标题
    title:string = ''
    // 属性分组，用于在设置器页面面进行分组展示
    group:string = 'base'
    // 占位信息
    placeholder:string = ''
    //
    description:string = ''
    // 属性类型
    type:TypeProps = 'props'
    // 属性所采用设置器组件的名称，如：ARadioGroup
    setterComponentName = ''
    // 属性所采用设置器组件的modelValue名，一般的组件为modelValue
    setterComponentVModelName:string = ''
    // 属性所采用设置器组件的属性信息
    setterComponentProps:object = {}
    // 是否在属性设置面板中展示组件设置器及标题，即是否为作为隐藏属性，常与默认值一起使用
    show:boolean = true
    // 是否在属性设置面板中展示组件设置器
    expanded:boolean = true
    // type为slots时，设置器组件配置的结果为作slotComponentName的props，进行渲染
    slotComponentName:string = ''
}

export class  PropertySetterSelectOption{
    // e.g. ARadioGroup
    name: string = ''
    // e.g. 单选(Radio)
    label:string = ''
    // e.g. modelValue
    vModelName:string = ''
    // e.g. String
    type: string = ''
    // e.g. GlRadioGroupSetter
    propsSetter?: string = ''

    slotComponentName?:string = ''
}