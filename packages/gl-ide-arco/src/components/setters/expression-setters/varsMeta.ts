import {jsScriptExecutor} from "@geelato/gl-ui";
import {useComponentStore} from "@geelato/gl-ide";
import {getLabel} from "@geelato/gl-ui-arco";
import type {MethodMeta} from "@geelato/gl-ui-schema";
import {downloadFileById} from "@geelato/gl-ui/src/m/datasource/FileApi";

type TreeItem = {
    title: string,
    key?: string,
    _code?: string,
    _type?: string,
    _value?: any,
    _brackets?: string,
    _description?: string,
    // 特殊标记，用于在点击节点时进行特殊处理
    _flag?: string,
    children?: TreeItem[]
}

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
        {title: '页面状态', _code: 'status', _type: 'string'},
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
    const componentStore = useComponentStore()
    const useCtxRecord = () => {
        const record = {
            title: '当前记录',
            _code: 'record',
            _type: 'object',
            _description: '表格的行数据记录',
            children: <any>[]
        }

        if (componentStore.currentSelectedComponentInstance && ['GlEntityTablePlus', 'GlEntityTableSub'].indexOf(componentStore.currentSelectedComponentInstance.componentName) != -1) {
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

    const useCtxArgs = () => {
        return {
            title: '事件参数',
            _code: 'args',
            _type: 'array',
            _description: '事件参数，假设onItemClick事件传了两个参数一个item，一个index，则可通过args[0]来获取item，通过args[1]来获取index。',
            children: <any>[]
        }
    }
    const ctx = {
        title: '当前组件上下文',
        _code: 'ctx',
        _type: 'object',
        children: [useCtxRecord(), useCtxArgs()],
        _description: '表格、表单等组件的正下文环境'
    }


    const insts = jsScriptExecutor.getComponentInsts()

    const instTreeItem = {
        title: '当前页面组件实例（数据）',
        _code: 'inst',
        _type: 'object',
        children: <any>[],
        _description: '当前页面组件实例（数据），以组件id为key，通过inst.xxxInstId获取对应的组件'
    }
    if (insts.inst) {
        for (const instKey in insts.inst) {
            if (instKey.indexOf('ph_') !== -1) {
                continue
            }
            const inst = insts.inst[instKey]
            const instMeta: TreeItem = {
                title: getLabel(inst), key: inst.id, _code: inst.id,
                children: [{
                    title: '值',
                    _code: 'value',
                    _description: '组件值',
                    _value: inst.value,
                    _type: 'any',
                    children: []
                }]
            }
            // {title: '获取组件实例', _code: 'xxxInstId', _type: 'object'},
            // props 属性
            const props = []
            for (const propKey in inst.props) {
                props.push({
                    title: propKey, _code: propKey, _value: inst.props[propKey]
                })
            }
            instMeta.children!.push(
                {title: '属性', _code: 'props', _type: 'object', _description: '组件属性', children: props}
            )

            instTreeItem.children.push(instMeta)
        }
    }

    const refs = jsScriptExecutor.getRefs()
    const refTreeItem = {
        title: '当前页面组件引用',
        _code: 'ref',
        _type: 'object',
        children: <any>[],
        _description: '当前页面组件引用，以组件id为key，通过ref.xxxRefId获取对应的组件对象的引用'
    }
    if (refs.ref) {
        for (const instKey in refs.ref) {
            if (instKey.indexOf('ph_') !== -1) {
                continue
            }
            // 注意这里是inst不是ref
            const inst = insts.inst[instKey]
            const instMeta: TreeItem = {
                title: getLabel(inst), key: inst.id, _code: inst.id,
                children: []
            }

            // methods 方法
            const methods: any[] = []
            const meta = componentStore.getComponentMeta(inst.componentName)
            meta.methods?.forEach((m: MethodMeta) => {
                methods.push({
                    title: m.title,
                    _code: m.name,
                    _flag: 'ref',
                    _description: m.description || m.title,
                    _brackets: '()'
                })
            })
            instMeta.children!.push(
                {title: '方法', _code: 'methods', _type: 'object', _description: '组件方法', children: methods}
            )

            refTreeItem.children.push(instMeta)
        }
    }

    const moreInstTree = {
        title: '更多组件实例',
        _description: '展示更多的组件实例，这些实例不在当前IDE打开的页面中。',
        key: 'showMoreComponentInsts',
        _code: 'inst',
        _flag: 'moreInsts'
    }

    const fn = {
        title: '方法',
        _code: 'fn',
        _type: 'object',
        children: [
            {
                title: '页面参数值等于某值',
                _code: 'isPageParamEquals',
                _type: 'boolean',
                _brackets: '("参数名",参数值)',
                _description: '页面参数值是否等于某值',
            },
            {
                title: '页面是否为只读状态',
                _code: 'isPageStatusRead',
                _type: 'boolean',
                _brackets: '()',
                _description: '页面是否为只读状态',
            },
            {
                title: '页面是否为新增状态',
                _code: 'isPageStatusCreate',
                _type: 'boolean',
                _brackets: '()',
                _description: '页面是否为新增状态',
            },
            {
                title: '页面是否为更新状态',
                _code: 'isPageStatusUpdate',
                _type: 'boolean',
                _brackets: '()',
                _description: '页面是否为更新状态',
            },
            {
                title: '获取页面参数值',
                _code: 'getPageParam',
                _type: 'any',
                _brackets: '("参数名")',
                _description: '获取页面参数值',
            },
            {
                title: '设置组件的属性值',
                _code: 'setComponentProps',
                _type: 'void',
                _brackets: '("组件ID",{ "属性名": 属性值 })',
                _description: '设置组件的属性值，例如：setComponentProps("aDjnainSRp359kLJHhbc", { _hidden: true });',
            },
            {
                title: '调用组件方法',
                _code: 'invokeComponentMethod',
                _type: 'any',
                _brackets: '("组件ID","方法名",[{"参数名":参数值}])',
                _description: '调用组件方法，例如：invokeComponentMethod: (componentId: string, methodName: string, params: Array<Param>)'
            }
        ],
        _description: ''
    }

    return [ctx, instTreeItem, refTreeItem, fn, moreInstTree]
}


export const useSrvTreeData = () => {
    const srv = {
        title: '服务',
        _code: 'srv',
        _type: 'object',
        // 在构建path时的内容
        _pathName: '',
        children: [
            // _brackets 对于方法，需要同时生成参数内容
            {
                title: '实体API',
                _code: 'entityApi',
                _type: 'object',
                _description: '基于实体的增删改查接口',
                children: [
                    {
                        title: '保存实体',
                        _code: 'saveEntity',
                        _type: 'Promise',
                        _brackets: '({entity:"",pidName:"",record:{},children:[]})',
                        _description: '保存实体，entitySaver为实体保存对象，格式如：{entity:"实体名称",pidName:"作为子表时需填写该值，即子表单中指向父表单id的字段名",record:"{},实体的记录数据对象",children:"[],有子表单时，可设置子表单entitySaver在此"}',
                    },
                    {
                        title: '批量保存实体',
                        _code: 'saveBatchEntity',
                        _type: 'Promise',
                        _brackets: '([{entity:"批量实体同一名称",pidName:"",record:{},children:[]}])',
                        _description: '批量保存实体(同一实体名称)，entitySaver为实体保存对象，格式如：{entity:"实体名称",pidName:"作为子表时需填写该值，即子表单中指向父表单id的字段名",record:"{},实体的记录数据对象",children:"[],有子表单时，可设置子表单entitySaver在此"}',
                    }
                ]
            },
            {
                title: '文件API',
                _code: 'fileApi',
                _type: 'object',
                _description: '文件操作接口，如导出excel、导出word等',
                children: [
                    {
                        title: '导出excel',
                        _code: 'exportExcel',
                        _type: 'void',
                        _brackets: '("文件名","文件模板ID","导出数据GQL")',
                        _description: '导出excel',
                    },
                    {
                        title: '下载文件',
                        _code: 'downloadFileById',
                        _type: 'void',
                        _brackets: '("文件id")',
                        _description: '下载文件',
                    }
                ]
            },
        ],
    }
    return [srv]
}

const date = {
    title: '日期时间',
    _code: 'datetime',
    _type: 'object',
    // 在构建path时的内容
    _pathName: 'fn',
    children: [
        // _brackets 对于方法，需要同时生成参数内容
        {
            title: '当前时间格式化',
            _code: 'dateText',
            _type: 'string',
            _brackets: '()',
            _description: '无参数时默认为当前时间，格式为YYYY-MM-DD HH:mm:ss，也可以指定两个参数(Date.now(), "YYYY-MM-DD HH:mm:ss")。',
        }
    ],
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
            title: '键值转换',
            _code: 'keyValue',
            _type: 'string',
            _brackets: '(keys,{key1:value1,key2:value2})',
            _description: '依据字典的键keys，从键值对{key1:value1,key2:value2}中获取值，keys可为单值或多值，' +
                '如字符串key1,key2,key3，可为[key1,key2,key3],可为key1。value1可为string，也可为object，当前object时，支持多语言翻译，格式为{cn:value11,en:value12}',
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


export const functionalFormulaTreeData = [date, text, logic]