import CommandBlock from "./CommandBlock";

export default class Action {
    // 属性名
    name: String = ''

    // 属性标题
    title: String = ''

    // 方法体
    body: String = ''

    // 命令块，可基于命令块生成body的内容，在最终发布版中，可以压缩去掉该字段
    _commandBlocks: Array<CommandBlock> = []
}