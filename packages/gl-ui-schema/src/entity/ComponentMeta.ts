import type IPropertySetterMeta from "./IPropertySetterMeta";

export default class ComponentMeta {
    // 组件英文名称，注册到全局环境的名称GlButton
    componentName: string = ''
    // 组件中文名称
    title: string = ''
    // 在属性配置面板中，是以哪种模式来展示属性，值为：Tile|Collapse
    displayMode: string = ''
    // 组件图标
    iconType: string = ''
    // 组件分组，用于在组件选择栏目中进行区分，如form、base
    group: string = ''
    // 使用于哪些类型的页面，如Page、Dbm...，以便于在编辑相应的页面时从sidebar中过滤掉不合适的组件
    useBy: Array<string> = []
    // 属性数组
    properties: Array<IPropertySetterMeta> = []
    // 事件动作 TODO any to Action
    actions: Array<any> = []

    // 引用的组件名称，如AButton
    // componentRefName: String
    propsWrapper?: String = ''
    alias?: String = ''

    constructor() {
    }
}