export const useEnumTreeData = () => {
    const sysConst = {
        title: '系统常量',
        children: [
            {
                title: 'page.status 页面状态',
                _description: '',
                children: [
                    {title: '只读', _code: '"read"', _type: 'string', _description: '页页面各组件为只读状态'},
                    {title: '编辑', _code: '"edit"', _type: 'string', _description: '页页面各组件为编辑状态，此为默认状态'}
                ],
            }
        ],
        _description: ''
    }

    return [sysConst]
}