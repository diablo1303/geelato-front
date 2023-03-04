import type PropertyMeta from "./PropertyMeta";
import type {LooseObject} from "@geelato/gl-ui"

export default class BaseDesignMeta {
    // 创建时生成id，规则为 组件别名+'_'+补全16位随机字符
    id?:string
    title: string = ''
    group: string = 'base'
    componentName: string = ''
    // 组件别名，可用于id标识的前缀
    alias: string = ''
    props: LooseObject = {}
    innerHtml: string = ''
    children?: Array<any>

    properties: Array<PropertyMeta> = []
    // 该组件有哪些插槽，如['header','footer']
    slot?: Array<string>

    // 使用的设置面板
    panels: Array<string> = ['GlIdePluginCoreSettingProperties', 'style', 'advance']

    constructor(options: { title: string, group?: string, componentName: string, alias: string, props: LooseObject, slot?: Array<string>, children: Array<any> }) {
        Object.assign(this, options)
        this.slot = this.slot || []
        this.properties.push(...this.createProperties())
    }

    createProperties(): Array<any> {
        return []
    }
}
