import ComponentInstance from "../ComponentInstance";

// 动作、方法调用参数元数据定义
export class ParamMeta {
    // 字段名
    title: string = ''
    // dataIndex
    name: string = ''
    // 是否必需
    required: boolean = true
    // String
    type: string = 'string'
    // 需要求和的字段名称
    description?: 'string'
}

export class ActionMeta {
    name: string = '' //  "fetchSuccess"
    title: string = '' //  "成功加载完数据"
    description? = '' //  从服务端成功加数据（0到多条）后触发。
    params?: ParamMeta[] = []
}

export class MethodMeta {
    async?: boolean = false
    name: string = '' //  "fetchSuccess"
    title: string = ' ' // "成功加载完数据"
    description? = '' // 从服务端成功加数据（0到多条）后触发。
    params?: ParamMeta[] = []
    defaultValue? = undefined
}


export default class Action {

    id?: string;

    // 动作挂载的事件，有统一的命名规范，用户不可修改，如change、click
    eventName: string;

    // 动作名，这个名称可以自定义
    name: string

    // 动作标题
    title: string

    // 方法体
    body?: string

    // 命令块，可基于命令块生成body的内容，在最终发布版中，可以压缩去掉该字段
    __commandBlock?: ComponentInstance

    constructor(option?: Action) {
        this.id = option?.id || ''
        this.eventName = option?.eventName || ''
        this.name = option?.name || ''
        this.title = option?.title || ''
        this.body = option?.body || ''
        // @ts-ignore
        this.__commandBlock = option?.__commandBlock || new ComponentInstance()
    }

}