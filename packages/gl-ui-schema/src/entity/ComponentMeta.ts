import type IPropertySetterMeta from "./IPropertySetterMeta";
import Action from "./actions/Action";

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
    // 事件动作
    actions: Array<Action> = []

    // 引用的组件名称，如AButton
    // componentRefName: String
    propsWrapper?: String = ''
    alias?: String = ''

    // 为作命令块组件时，在设计器中，展示的描述该命令块的。
    // 如：打开第三方网页，地址为：{url}。其中url为属性properties中的其中一直属性，在展示时动态渲染
    blockContent?: string = ''

    constructor() {
    }
}