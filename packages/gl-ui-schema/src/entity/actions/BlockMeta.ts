import ComponentMeta from "../ComponentMeta";

export default class BlockMeta extends ComponentMeta{

    // 在设计页面显示的带有变量的字符串内容
    content: string = ''

    // 设计器中的块显示
    color?: string = ''
    // 是否有子项，如if、for有子项，如setVar则没有子项
    hasSub?: boolean = false
}