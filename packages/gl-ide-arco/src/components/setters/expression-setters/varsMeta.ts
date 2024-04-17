import type {ComponentCustomProperties} from 'vue'
import {entityApi, jsScriptExecutor} from '@geelato/gl-ui'
import {useComponentStore, useActionStore, type VarMeta, usePageStore} from '@geelato/gl-ide'
import {getLabel} from '@geelato/gl-ui-arco'
import type {MethodMeta, ParamMeta, ComponentInstance} from '@geelato/gl-ui-schema'

type TreeItem = {
    title: string
    key?: string
    _code?: string
    _type?: string
    _value?: any
    _brackets?: string
    _description?: string
    // 特殊标记，用于在点击节点时进行特殊处理
    _flag?: string
    // 有该属性时，在生成代码时替换_code的内容
    _pathName?: string
    children?: TreeItem[]
}

/**
 *  获取当前已选中的实体
 */
const getCurrentSelectedInst = () => {
    const componentStore = useComponentStore()
    return componentStore.currentSelectedComponentInstance
}

const user = {
    title: '当前用户',
    _code: 'user',
    _type: 'object',
    children: [
        {
            title: '用户ID',
            _code: 'id',
            _type: 'string'
        },
        {
            title: '用户名称',
            _code: 'name',
            _type: 'string'
        },
        {
            title: '员工工号',
            _code: 'jobNumber',
            _type: 'string'
        },
        {
            title: '手机号码',
            _code: 'mobilePhone',
            _type: 'string'
        },
        {
            title: '邮箱',
            _code: 'email',
            _type: 'string'
        },
        {
            title: '部门ID',
            _code: 'orgId',
            _type: 'string'
        },
        {
            title: '部门名称',
            _code: 'orgName',
            _type: 'string'
        },
        {
            title: '公司ID',
            _code: 'corpId',
            _type: 'string',
            _description: '如果是外部单位用户，此ID仍为该应用所有企业的ID（组织树中的公司节点ID）'
        },
        {
            title: '公司名称',
            _code: 'corpName',
            _type: 'string',
            _description: '如果是外部单位用户，此名称仍为该应用所有企业的名称（组织树中的公司节点名称）'
        },
        {
            title: '外部组织ID',
            _code: 'cooperatingOrgId',
            _type: 'string',
            _description: '如果是外部单位用户时才有该值'
        }
    ]
}

/**
 *  平台参数
 */
const useSys = (global: ComponentCustomProperties & Record<string, any>) => {
    console.log('useSys > global:', global)
    const sys = {
        title: '平台配置',
        _code: 'sys',
        _type: 'object',
        _description: '平台的配置信息',
        children: <Record<string, any>>[]
    }

    if (global.$gl?.sys) {
        Object.keys(global.$gl?.sys).forEach((sysKey: string) => {
            sys.children.push({
                title: sysKey,
                _code: sysKey,
                _type: 'string|number',
                _description: global.$gl?.sys[sysKey]
            })
        })
    }

    return sys
}

const tenant = {
    title: '租户',
    _code: 'tenant',
    _type: 'object',
    _description: '当前租户的信息',
    children: [
        {
            title: '租户ID',
            _code: 'id',
            _type: 'string'
        },
        {
            title: '租户名称',
            _code: 'name',
            _type: 'string'
        }
    ]
}

const app = {
    title: '当前应用信息',
    _code: 'app',
    _type: 'object',
    children: [
        {title: '应用ID', _code: 'id', _type: 'string'},
        {title: '应用名称', _code: 'name', _type: 'string'},
        {title: '应用版本', _code: 'version', _type: 'string'}
    ]
}

const page = {
    title: '当前页面信息',
    _code: 'page',
    _type: 'object',
    children: [
        {title: '页面ID', _code: 'id', _type: 'string'},
        {title: '页面名称', _code: 'label', _type: 'string'},
        {title: '页面状态', _code: 'status', _type: 'string'},
        {title: '页面参数', _code: 'params', _type: 'array', children: []}
        // {title: '页面树节点ID', _code: 'treeNodeId', _type: 'string'},
    ]
}

const device = {
    title: '设备信息',
    _code: 'device',
    _type: 'object',
    children: [
        {
            title: '窗口',
            _code: 'viewport',
            _type: 'object',
            children: [
                {title: '窗口宽度', _code: 'width', _type: 'string'},
                {title: '窗口高度', _code: 'height', _type: 'string'}
            ]
        },
        {title: '网络类型', _code: 'networkType', _type: 'string'}
    ]
}

/**
 *  系统变量
 */
export const useSystemVarsTreeData = (
    globalProperties: ComponentCustomProperties & Record<string, any>
) => {
    return [user, page, app, tenant, useSys(globalProperties), device]
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
 *  获取当前动作定义的变量
 */
export const useActionVarsTreeData = () => {
    const actionStore = useActionStore()
    const useActionVars = () => {
        const vars = {
            title: '当前动作变量',
            _code: 'vars',
            _type: 'object',
            _description: '当前动作定义的所有变量集对象',
            children: <any>[]
        }

        actionStore.vars.forEach((varMeta: VarMeta) => {
            vars.children.push({
                title: varMeta.label,
                _code: varMeta.name,
                _description: varMeta.remark
            })
        })
        // if (componentBlockStore.currentSelectedComponentInstance) {
        //   const columns = componentStore.currentSelectedComponentInstance.props.columns
        //   if (columns && columns.length > 0) {
        //     columns.forEach((col: any) => {
        //       record.children.push({
        //         title: col.title,
        //         _code: col.dataIndex,
        //         _description: ''
        //       })
        //     })
        //   }
        // }
        return vars
    }
    const vars = useActionVars()
    return [vars]
}

/**
 *  组件实例
 */
export const useComponentInstTreeData = () => {
    const pageStore = usePageStore()
    // @ts-ignore
    const currentPageInst: ComponentInstance = pageStore.currentPage.sourceContent
    const componentStore = useComponentStore()
    const currentSelectedInst = componentStore.currentSelectedComponentInstance

    const useCtxRecord = () => {
        const record = {
            title: '当前记录',
            _code: 'record',
            _type: 'object',
            _description: '表格的行数据记录，只有表格操作栏上的组件配置动作时，才能拿到该值。',
            children: <any>[]
        }

        if (
            currentSelectedInst &&
            ['GlEntityTablePlus', 'GlEntityTableSub'].indexOf(currentSelectedInst.componentName) != -1
        ) {
            const columns = currentSelectedInst.props.columns
            if (columns && columns.length > 0) {
                columns.forEach((col: any) => {
                    record.children.push({
                        title: col.title,
                        _code: col.dataIndex,
                        _description: ''
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
            _description:
                '事件参数，假设onItemClick事件传了两个参数一个item，一个index，则可通过args[0]来获取item，通过args[1]来获取index。',
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


    // 无脚本块组件，只有前端UI组件
    const instTreeItem = {
        title: '当前页面组件实例（数据）',
        _code: 'inst',
        _type: 'object',
        children: <any>[],
        _description: '当前页面组件实例（数据），以组件id为key，通过inst.xxxInstId获取对应的组件'
    }
    if (insts.inst) {
        for (const instKey in insts.inst) {
            // 过滤掉占位符 ph_
            if (instKey.indexOf('ph_') !== -1) {
                continue
            }
            const inst = insts.inst[instKey]
            // 过滤掉脚本块 block_page
            if (inst.group === 'block_page' || instKey.indexOf('blockPage_')!== -1){
                continue
            }

            const instMeta: TreeItem = {
                title: getLabel(inst),
                key: inst.id,
                _code: inst.id,
                children: [
                    {
                        title: '值',
                        _code: 'value',
                        _description: '组件值',
                        _value: inst.value,
                        _type: 'any',
                        children: []
                    }
                ]
            }
            // {title: '获取组件实例', _code: 'xxxInstId', _type: 'object'},
            // props 属性
            const props = []
            for (const propKey in inst.props) {
                props.push({
                    title: propKey,
                    _code: propKey,
                    _value: inst.props[propKey]
                })
            }
            instMeta.children!.push({
                title: '属性',
                _code: 'props',
                _type: 'object',
                _description: '组件属性',
                children: props
            })

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
                title: getLabel(inst),
                key: inst.id,
                _code: inst.id,
                children: []
            }

            // methods 方法
            const methods: any[] = []
            const meta = componentStore.getComponentMeta(inst.componentName)
            meta?.methods?.forEach((m: MethodMeta) => {
                methods.push({
                    title: m.title,
                    _code: m.name,
                    _flag: 'ref',
                    _description: m.description || m.title,
                    _brackets: '()'
                })
            })
            instMeta.children!.push({
                title: '方法',
                _code: 'methods',
                _type: 'object',
                _description: '组件方法',
                children: methods
            })

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

    const getPageParams = () => {
        const params: any[] = [
            {
                title: '手写参数',
                _code: '手写参数',
                _pathName: 'getPageParams',
                _type: 'any',
                _brackets: `("参数名")`,
                _description: '获取页面参数值'
            }
        ]
        currentPageInst.props.paramsMeta?.forEach((paramMeta: ParamMeta) => {
            params.push({
                title: `填入参数：${paramMeta.name}`,
                _code: `填入参数：${paramMeta.name}`,
                _pathName: 'getPageParams',
                _type: paramMeta.type?.toLowerCase(),
                _brackets: `("${paramMeta.name}")`,
                _description: paramMeta.description || paramMeta.title
            })
        })
        return params
    }

    const hasPageParam = () => {
        const params: any[] = [
            {
                title: '手写参数',
                _code: '手写参数',
                _pathName: 'hasPageParam',
                _type: 'boolean',
                _brackets: `("参数名")`,
                _description: '是否存在参数'
            }
        ]
        currentPageInst.props.paramsMeta?.forEach((paramMeta: ParamMeta) => {
            params.push({
                title: `填入参数：${paramMeta.name}`,
                _code: `填入参数：${paramMeta.name}`,
                _pathName: 'hasPageParam',
                _type: paramMeta.type?.toLowerCase(),
                _brackets: `("${paramMeta.name}")`,
                _description: paramMeta.description || paramMeta.title
            })
        })
        return params
    }

    const isPageParamEquals = () => {
        const params: any[] = [
            {
                title: '手写参数',
                _code: '手写参数',
                _pathName: 'isPageParamEquals',
                _type: 'boolean',
                _brackets: `("参数名",参数值)`,
                _description: '页面参数值等于某值'
            }
        ]
        currentPageInst.props.paramsMeta?.forEach((paramMeta: ParamMeta) => {
            params.push({
                title: `填入参数：${paramMeta.name}`,
                _code: `填入参数：${paramMeta.name}`,
                _pathName: 'isPageParamEquals',
                _type: paramMeta.type?.toLowerCase(),
                _brackets: `("${paramMeta.name}",参数值)`,
                _description: paramMeta.description || paramMeta.title
            })
        })
        return params
    }
    const fn = {
        title: '方法',
        _code: 'fn',
        _type: 'object',
        _description: '',
        children: [
            {
                title: '页面参数',
                _pathName: '',
                _code: 'pageParams',
                _type: '',
                _description: '页面参数',
                children: [
                    {
                        title: '页面参数值等于某值',
                        _code: 'isPageParamEquals',
                        _type: 'any',
                        _pathName: '',
                        _description: '获取页面参数值',
                        children: isPageParamEquals()
                    },
                    {
                        title: '获取页面参数值',
                        _code: 'getPageParam',
                        _type: 'any',
                        _pathName: '',
                        _description: '获取页面参数值',
                        children: getPageParams()
                    },
                    {
                        title: '是否存在页面参数',
                        _code: 'hasPageParam',
                        _type: 'any',
                        _pathName: '',
                        _description: '是否存在页面参数',
                        children: hasPageParam()
                    }
                ]
            },
            {
                title: '页面状态',
                _pathName: '',
                _code: 'pageStatus',
                _type: '',
                _description: '页面状态',
                children: [
                    {
                        title: '页面为新增状态',
                        _code: 'isPageStatusCreate',
                        _type: 'boolean',
                        _brackets: '()',
                        _description: '页面为新增状态'
                    },
                    {
                        title: '页面为复制新增状态',
                        _code: 'isPageStatusCopyCreate',
                        _type: 'boolean',
                        _brackets: '()',
                        _description: '页面为复制新增状态'
                    },
                    {
                        title: '页面为新增或复制新增状态',
                        _code: 'isPageStatusCreateOrCopyCreate',
                        _type: 'boolean',
                        _brackets: '()',
                        _description: '页面为新增或复制新增状态'
                    },
                    {
                        title: '页面为更新状态',
                        _code: 'isPageStatusUpdate',
                        _type: 'boolean',
                        _brackets: '()',
                        _description: '页面为更新状态'
                    },
                    {
                        title: '页面为只读状态',
                        _code: 'isPageStatusRead',
                        _type: 'boolean',
                        _brackets: '()',
                        _description: '页面为只读状态'
                    }
                ]
            },
            {
                title: '组件方法',
                _pathName: '',
                _code: 'component',
                _type: '',
                _description: '页面状态',
                children: [
                    {
                        title: '设置组件的属性值',
                        _code: 'setComponentProps',
                        _type: 'void',
                        _brackets: '("组件ID",{ "属性名": 属性值 })',
                        _description:
                            '设置组件的属性值，例如：setComponentProps("aDjnainSRp359kLJHhbc", { _hidden: true });'
                    },
                    {
                        title: '调用组件方法',
                        _code: 'invokeComponentMethod',
                        _type: 'any',
                        _brackets: '("组件ID","方法名",[{"参数名":参数值}])',
                        _description:
                            '调用组件方法，例如：invokeComponentMethod: (componentId: string, methodName: string, params: Array<Param>)'
                    }
                ]
            }
        ]
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
                        _description:
                            '保存实体，entitySaver为实体保存对象，格式如：{entity:"实体名称",pidName:"作为子表时需填写该值，即子表单中指向父表单id的字段名",record:"{},实体的记录数据对象",children:"[],有子表单时，可设置子表单entitySaver在此"}'
                    },
                    {
                        title: '批量保存实体',
                        _code: 'saveBatchEntity',
                        _type: 'Promise',
                        _brackets: '([{entity:"批量实体同一名称",pidName:"",record:{},children:[]}])',
                        _description:
                            '批量保存实体(同一实体名称)，entitySaver为实体保存对象，格式如：{entity:"实体名称",pidName:"作为子表时需填写该值，即子表单中指向父表单id的字段名",record:"{},实体的记录数据对象",children:"[],有子表单时，可设置子表单entitySaver在此"}'
                    },
                    {
                        title: '查询一组字典项',
                        _code: 'queryDictItems',
                        _type: 'Promise',
                        _brackets: '("字典id")',
                        _description: '通过字典id，查询字典项：[{id: string, value: string, label: string}]'
                    },
                    {
                        title: '查询一个字典项',
                        _code: 'queryDictItem',
                        _type: 'Promise',
                        _brackets: '("字典id","字典项值")',
                        _description:
                            '通过字典id，字典项值，查询字典项：[{id: string, value: string, label: string}]'
                    },
                    {
                        title: '获取请求头Authorization',
                        _code: 'getAuthorization',
                        _type: 'string',
                        _brackets: '()',
                        _description: '获取当前的客户端的Authorization信息（token）'
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
                        _description: '导出excel'
                    },
                    {
                        title: '下载文件',
                        _code: 'downloadFileById',
                        _type: 'void',
                        _brackets: '("文件id")',
                        _description: '下载文件'
                    }
                ]
            },
            {
                title: '系统API',
                _code: 'sysApi',
                _type: 'object',
                _description: '基于系统管理的相关接口',
                children: [
                    {
                        title: '获取用户所在公司',
                        _code: 'getCompanyOfUser',
                        _type: 'Promise',
                        _brackets: '("userId")',
                        _description:
                            '获取用户所在的公司信息，用户在分子公司则返回该分子公司信息，否则返顺总公司信息。'
                    },
                ]
            },
        ]
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
            _description:
                '无参数时默认为当前时间，格式为YYYY-MM-DD HH:mm:ss，也可以指定两个参数(Date.now(), "YYYY-MM-DD HH:mm:ss")。'
        }
    ]
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
            _description:
                '依据字典的键keys，从键值对{key1:value1,key2:value2}中获取值，keys可为单值或多值，' +
                '如字符串key1,key2,key3，可为[key1,key2,key3],可为key1。value1可为string，也可为object，当前object时，支持多语言翻译，格式为{cn:value11,en:value12}'
        },
        {
            title: '数字转中文币值格式',
            _code: 'toChineseCurrency',
            _type: 'string',
            _brackets: '("123123.23")',
            _description:
                '输入可以是数字格式或字符串格式，示例：toChineseCurrency(123456789.12)；//壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元壹角贰分'
        },
        {
            title: '获取文本长度',
            _code: 'len',
            _type: 'number',
            _brackets: '("我是文本ABC", "我是文本A")',
            _description: '判断"我是文本ABC"是否"我是文本A"'
        },
        {
            title: '是否包含指定文本',
            _code: 'contains',
            _type: 'boolean',
            _brackets: '("文本")',
            _description: '获取传入文本的字符数'
        }
    ]
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
            _description: '依据表达式执行的结果，若为true返回trueValue，若为false返回falseValue'
        }
    ]
}

export const functionalFormulaTreeData = [date, text, logic]
