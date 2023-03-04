import type ComponentInstance from "./ComponentInstance";
import type ComponentMeta from "./ComponentMeta";

export default class ComponentMaterial {
    /**
     *  物料全局id，material开头，16位
     */
    gid: string = ''

    componentName: string = ''
    // 未设置时，默认取componentName对应组件元数据的值
    iconType: string = ''
    // 未设置时，默认取componentName对应组件元数据的值
    group: string = ''
    // 未设置时，默认取componentName对应组件元数据的值
    title: string = ''
    // 未设置时，默认取componentName对应组件元数据的值
    useBy: Array<string> = []
    // 该物料的组件实例示例
    instance: ComponentInstance | {} = {}
    // 该物料的组件元数据定义
    meta: ComponentMeta | {} = {}

    constructor() {
    }
}
