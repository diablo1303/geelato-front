import {jsScriptExecutor} from "@geelato/gl-ui";
import {useComponentStore} from "@geelato/gl-ide";

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
        {title: '页面参数', _code: 'params', _type: 'array', children: []},
        // {title: '页面树节点ID', _code: 'treeNodeId', _type: 'string'},
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
export const useSystemVarsTreeData = () => {
    return [user, app, page, device]
}


// const inst = {
//     title: '当前组件实例集',
//     _code: 'inst',
//     _type: 'object',
//     children: [
//         {title: '获取组件实例', _code: 'xxxInstId', _type: 'object'},
//     ],
//     _description: 'ComponentInstance'
// }
//
// const ctx = {
//     title: '当前组件上下文',
//     _code: 'ctx',
//     _type: 'object',
//     children: [
//         {title: '当前记录', _code: 'record', _type: 'object', _description: '表格的行数据记录'},
//     ],
//     _description: 'ComponentInstance'
// }


/**
 *  组件实例
 */
export const useComponentInstTreeData = () => {
    const useCtxRecord = () => {
        const record = {
            title: '当前记录',
            _code: 'record',
            _type: 'object',
            _description: '表格的行数据记录',
            children: <any>[]
        }
        const componentStore = useComponentStore()
        if (['GlEntityTablePlus', 'GlEntityTableSub'].indexOf(componentStore.currentSelectedComponentInstance.componentName) != -1) {
            const columns = componentStore.currentSelectedComponentInstance.props.columns
            if (columns && columns.length > 0) {
                columns.forEach((col: any) => {
                    record.children.push({
                        title: col.title, _code: col.dataIndex, _description: ''
                    })
                })
            }
        }
        return record
    }

    const ctx = {
        title: '当前组件上下文',
        _code: 'ctx',
        _type: 'object',
        children: [useCtxRecord()],
        _description: '表格、表单等组件的正下文环境'
    }


    const insts = jsScriptExecutor.getComponentInsts()

    const instTreeItem = {
        title: '当前组件实例集',
        _code: 'inst',
        _type: 'object',
        children: <any>[],
        _description: '当前组件的实体集，以组件id为key，通过inst.xxxInstId获取对应的组件'
    }
    if (insts.inst) {
        for (const instKey in insts.inst) {
            // @ts-ignore
            const inst = insts.inst[instKey]
            // {title: '获取组件实例', _code: 'xxxInstId', _type: 'object'},
            const propItems = []
            for (const propKey in inst.props) {
                propItems.push({
                    title: propKey, _code: propKey, _value: inst.props[propKey]
                })
            }
            instTreeItem.children.push({
                title: inst.props?.label || inst.title, key: inst.id, _code: inst.id,
                children: [
                    {title: '值', _code: 'value', _description: '组件值', _value: inst.value},
                    {title: '属性', _code: 'props', _type: 'object', _description: '组件属性', children: propItems}
                ]
            })
            console.log('instTreeItem....', instTreeItem)
        }
    }

    const fn = {
        title: '方法',
        _code: 'fn',
        _type: 'object',
        children: [
            {
                title: '页面参数值是否等于某值',
                _code: 'isPageParamEquals',
                _type: 'boolean',
                _brackets: '("参数名",参数值)',
                _description: '页面参数值是否等于某值',
            }
        ],
        _description: ''
    }

    return [ctx, instTreeItem, fn]
}

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

const logic = {
    title: '逻辑',
    _code: 'logic',
    _type: 'object',
    // 在构建path时的内容
    _pathName: 'fn',
    children: [
        // _brackets 对于方法，需要同时生成参数内容
        {
            title: '如果',
            _code: 'if',
            _type: 'boolean',
            _brackets: '(表达式,trueValue,falseValue)',
            _description: '依据表达式执行的结果，若为true返回trueValue，若为false返回falseValue',
        }
    ]
}


export const functionalFormulaTreeData = [text, logic]