import type Action from "./actions/Action";
import type BindField from "./model/BindField";
import type BlockInstance from "./actions/BlockInstance";

export interface FieldRule<FieldValue = any> {
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'email' | 'url' | 'ip';
    required?: boolean;
    message?: string;
    length?: number;
    maxLength?: number;
    minLength?: number;
    match?: RegExp;
    uppercase?: boolean;
    lowercase?: boolean;
    min?: number;
    max?: number;
    equal?: number;
    positive?: boolean;
    negative?: boolean;
    true?: boolean;
    false?: boolean;
    includes?: any[];
    deepEqual?: any;
    empty?: boolean;
    hasKeys?: string[];
    validator?: (value: FieldValue | undefined, callback: (error?: string) => void) => void;
}

export class ComponentInstanceProps {
    // 标题，如用于formItem的标题
    label?: string = ''
    // 绑定字段，对于输入组件，需要用到该属性
    bindField?: BindField

    // 组件个性化属性
    [key: string]: any

    // 默认值表达式，在值为null或undefined时生效。注：应叫_defaultValue，名称上合理
    _valueExpression?: any
    // 是否禁用
    disabled?: boolean
    // 只读
    readonly?: boolean
    // 是否渲染
    unRender?: boolean
    // 是否隐藏(渲染但不可见)
    _hidden?: boolean
    // 验证规则，适用于表单项组件，如AInput
    rules?: FieldRule<any> | FieldRule<any>[]
}

export class I18nItem {
    [key: string]: any

    'zh-CN': string
    'en-US': string
}

/**
 *  "__"开头的属性有多外来源
 *  1、动态产生用于内部计算使用
 *  2、作为源代码属性且不需要在发布运行版本中出现
 *  在保存为release版本时，"__"开头的属性会被删除掉，以减小文件的大小
 *  source版本，仍保存该属性信息
 */
export default class ComponentInstance {
    id: string = ''
    // 创建id时的id前缀
    __idPrefix?: string = ''
    title?: string = ''
    componentName: string = ''
    // 如dataEntry，可以来用区分是否为表单输入项，在渲染时展示label
    group?: string = ''
    // 组件的值绑定属性名，默认为modelValue,特殊的，如tabs为activeKey
    vModelName?: string
    // 组件属性
    props: ComponentInstanceProps = {}
    // 属性值表达式，通过变量绑定、函数计算等，动态计算属性的值
    propsExpressions?: ComponentInstanceProps = {}
    slots: { [key: string]: any, propsTarget?: string, propsName?: string } = {}
    // 插槽值表达式，通过变量绑定、函数计算等，动态计算属性的值
    slotsExpressions?: ComponentInstanceProps = {}
    children: Array<ComponentInstance> = []
    actions: Array<Action> = []
    // 额外，如用于GlCard
    extra?: ComponentInstance
    style?: Object = {}
    propsWrapper?: string = ''
    // 多语言，表单配置中默认的为zh-CN，这里只需配置en-US，如果需要繁体，则可配置增加zh-TW或zh-HK
    i18n?: Array<I18nItem> = []
    // 运行时的值，如对于input等表单组件，可用于v-model绑定值
    value?: undefined | string | number | boolean | object | Array<any>
    // 禁用拖放 默认为false，不禁止
    // 如在渲染工作流画布的场景中，禁止工作流画布可拖动，可设置为true
    disabledDnd?: Boolean
    // 如在渲染工作流画布的场景中，禁止设选择该组件，如点击选择无效，避免子组件冒泡触发
    disabledSelect?: Boolean
    // 映射引用的组件id，这个属性用于图元映射到组件实例的场景，如设计页面是一个工作流程图，图元的id映射到组件refId
    refId?: string
    // 用于组件映射到外部的组件或外部的图元素等。如组件实例为GlPage时，可以在此存储当前页面对应的graph对象
    refObject?: Object
    // 值表达式，用于结合上下文的信息、相关逻辑计算得出value
    // valueExpression?: string = ''
    // 是否禁用，默认为启用，用于设计时
    _disabled?: boolean
    // 是否为模板实例
    __isTemplateInst?: boolean

    // 运行时产生，用于指令块组件
    // 是否为被调用的指令块
    __isInvokeBlock?: boolean
    // 作为被调用的指令块占位符
    __invokeBlockPlaceholder?: string
    // 字段验证之后的错误信息
    __validateError? = null

    // 拖动标识，通过监控该标识的变化，可以判断整个页面是否有变化
    __dragFlag? = ''

    // 脚本块
    __commandBlock?: BlockInstance

    // 组件是否启用权限控制，用于在渲染时，确定是否需要检查权限，perms为空、为r为0或空、w为0或空都表示不需要检查
    perms?: { r?: number, w?: number }
    // 组件的权限控制配置，用于设计时配置
    __perms?: { r: {id:string,name:string,enabled:number}, w: {id:string,name:string,enabled:number} }

}
