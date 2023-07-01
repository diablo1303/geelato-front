const user = {
    title: '当前用户',
    _code: 'user',
    _type: 'object',
    children: [{
        title: '用户ID',
        _code: 'id',
        _type: 'string'
    }, {
        title: '用户名称',
        _code: 'name',
        _type: 'string'
    },],
}

const app = {
    title: '当前应用信息',
    _code: 'app',
    _type: 'object',
    children: [
        {title: '应用ID', _code: 'id', _type: 'string'},
        {title: '应用名称', _code: 'name', _type: 'string'},
        {title: '应用版本', _code: 'version', _type: 'string'},
    ],
}

const page = {
    title: '当前页面信息',
    _code: 'page',
    _type: 'object',
    children: [
        {title: '页面ID', _code: 'id', _type: 'string'},
        {title: '页面名称', _code: 'label', _type: 'string'},
        {title: '页面树节点ID', _code: 'treeNodeId', _type: 'string'},
    ],
}

const device = {
    title: '设备信息',
    _code: 'device',
    _type: 'object',
    children: [
        {
            title: '窗口', _code: 'viewport', _type: 'object', children: [
                {title: '窗口宽度', _code: 'width', _type: 'string'},
                {title: '窗口高度', _code: 'height', _type: 'string'},
            ]
        },
        {title: '网络类型', _code: 'networkType', _type: 'string'},
    ],
}


/**
 *  系统变量
 */
export const systemVarsTreeData = [user, app, page, device]


const inst = {
    title: '当前组件实例集',
    _code: 'inst',
    _type: 'object',
    children: [
        {title: '获取组件实例', _code: 'xxxInstId', _type: 'object'},
    ],
    _description: 'ComponentInstance'
}

/**
 *  组件实例
 */
export const componentInstTreeData = [inst]

const text = {
    title: '文本',
    _code: 'text',
    _type: 'object',
    // 在构建path时的内容
    _pathName: 'fn',
    children: [
        // _brackets 对于方法，需要同时生成参数内容
        {
            title: '获取字典值',
            _code: 'dict',
            _type: 'string',
            _brackets: '(key1,{key1:value1,key2:value2})',
            _description: '依据字典的键key1，从字典{key1:value1,key2:value2}中获取值value1。',
        },
        {
            title: '获取文本长度',
            _code: 'len',
            _type: 'number',
            _brackets: '("我是文本ABC", "我是文本A")',
            _description: '判断"我是文本ABC"是否"我是文本A"',
        },
        {
            title: '是否包含指定文本',
            _code: 'contains',
            _type: 'boolean',
            _brackets: '("文本")',
            _description: '获取传入文本的字符数',
        },
    ],
}

export const functionalFormulaTreeData = [text]