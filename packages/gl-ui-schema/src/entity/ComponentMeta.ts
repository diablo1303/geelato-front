import type IPropertySetterMeta from "./IPropertySetterMeta";
import type {ActionMeta} from "./actions/Action";
import type {MethodMeta} from "./actions/Action";

/**
 *  记录组件中哪些信息需要进行多语言配置
 *  同时定义多语言信息
 */
export class ComponentI18nMeta {
    props?: Object = {}
}

/**
 *  组件的内置组件在整个组件实例配置文件中的位置定义
 */
export class InnerComponentPosition {
    title: string = ''
    // 访问的属性路径如 x?.y?.z
    propPath: string = ''
    // 通过一个函数来获取，输入为基于path获取的节点数据，用于处理复杂的内置组件场景，如果配置了该pathFn，则以此为准
    // (data)=>{return []}
    // propPathFn?: Function = undefined
}

export default class ComponentMeta {
    // 组件英文名称，注册到全局环境的名称GlButton
    componentName: string = ''
    // 组件中文名称
    title: string = ''
    // 组件的值绑定属性名，默认为modelValue,特殊的，如tabs为activeKey
    vModelName?: string
    // 在舞台中是以块状还是行内样式进行展示
    displayOnStage?: string = 'inline-block'
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
    // 记录需要进行多语言翻译的字段
    i18n?: ComponentI18nMeta = {
        props: {}
    }
    // 事件动作
    actions?: Array<ActionMeta> = []

    // 组件方法，对应组件defineExpose的内容
    methods?: Array<MethodMeta> = []

    // 引用的组件名称，如AButton
    // componentRefName: String
    propsWrapper?: String = ''

    // 别名简称，用于在生成id时作为前缀
    alias?: String = ''

    // 为作命令块组件时，在设计器中，展示的描述该命令块的。
    // 如：打开第三方网页，地址为：{url}。其中url为属性properties中的其中一直属性，在展示时动态渲染
    // 如果blockContent的默认以 @language开始，即格式为 @language:xxx 则需进行格式化显示
    blockContent?: string = ''
    // 块内容的语言，如javascript，默认为空，表示普通的文本
    blockContentLanguage?: string
    // 用于设计时，标识是否弃用true，默认为启用即false。弃用时，在sidebar中不可以选择，但在已应用的页面中还可以使用
    deprecated?: Boolean = false

    /**
     *  该组件内置的组件说明
     *
     */
    innerComponents?: InnerComponentPosition[] = []

}
