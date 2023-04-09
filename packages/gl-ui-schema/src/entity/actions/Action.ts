import ComponentInstance from "../ComponentInstance";

export default class Action {

    id:string;

    // 属性名
    name: string

    // 属性标题
    title: string

    // 方法体
    body: string

    // 命令块，可基于命令块生成body的内容，在最终发布版中，可以压缩去掉该字段
    _commandBlock: ComponentInstance

    constructor(option?: Action) {
        this.id = option?.id || ''
        this.name = option?.name || ''
        this.title = option?.title || ''
        this.body = option?.body || ''
        this._commandBlock = option?._commandBlock || new ComponentInstance()
    }

}