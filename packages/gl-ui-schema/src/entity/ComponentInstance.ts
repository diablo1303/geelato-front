import type Action from "./actions/Action";

export class ComponentInstanceProps {
    [key: string]: any

    // 标题，如用于formItem的标题
    label?: string = ''
    // 只读
    readonly?: boolean = false
    // 验证规则，适用于表单项组件，如AInput
    rules?: Array<any>
}

export class I18nItem {
    [key: string]: any

    'zh-CN': string
    'en-US': string
}

export default class ComponentInstance {
    id: string = ''
    title?: string = ''
    componentName: string = ''
    props: ComponentInstanceProps = {}
    // 属性值表达式，通过变量绑定、函数计算等，动态计算属性的值
    propsExpress?: ComponentInstanceProps = {}
    slots: { [key: string]: any } = {}
    // 插槽值表达式，通过变量绑定、函数计算等，动态计算属性的值
    slotsExpress?: ComponentInstanceProps = {}
    children: Array<ComponentInstance> = []
    actions: Array<Action> = []
    style?: Object = {}
    propsWrapper?: string = ''
    // 多语言，表单配置中默认的为zh-CN，这里只需配置en-US，如果需要繁体，则可配置增加zh-TW或zh-HK
    i18n?: Array<I18nItem> = []
    // 运行时的值，如对于input等表单组件，可用于v-model绑定值
    value?: undefined
    // 值表达式，用于结合上下文的信息、相关逻辑计算得出value
    valueExpress?: string = ''
    // 是否禁用，默认为启用，用于设计时
    _disabled?: boolean
    // 是否为模板实例
    _isTemplateInst?: boolean

    // 运行时产生，用于指令块组件
    // 是否为被调用的指令块
    __isInvokeBlock?: boolean
    // 作为被调用的指令块占位符
    __invokeBlockPlaceholder?: string
}
