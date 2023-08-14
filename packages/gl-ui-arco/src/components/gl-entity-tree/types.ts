export type ContextMenuDataType = {
    title: string,
    iconType: string,
    iconColor?: string,
    _nodeType: string,
    useFor: Array<string>,
    action: string,
    // 节点操作的参数，如action为updateNode,actionsParams为：{flag:'menuItem'}，则处理之后，节点的flag属性，值为'menuItem'
    actionParams?: Object,
    // 节点标识，如用于区分是否为菜单项
    flag?: Object,
    // 基于node节点的show属性作是否展示的检查，这里的show是个表达式
    show?: string
}