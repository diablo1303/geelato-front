// @ts-nocheck
import {entityApi} from "@geelato/gl-ui";


export const useConstTreeData = async () => {
    // const sysConst = {
    //     title: 'page.status 页面状态',
    //     _description: '',
    //     children: [
    //         {title: '查看', _code: '"read"', _type: 'string', _description: '页页面各组件为只读状态'},
    //         {title: '创建', _code: '"create"', _type: 'string', _description: '页页面各组件为创建状态'},
    //         {title: '修改', _code: '"update"', _type: 'string', _description: '页页面各组件为修改状态'}
    //     ],
    // }
    return []
}


let dict: any[] = []
let loading = false
const dictConst = {
    title: '数据字典',
    children: [],
    _description: ''
}
export const useDictTreeData = async () => {
    if (dict.length === 0) {
        loading = true
        try {
            dict = await entityApi.query('platform_dict', 'id,dictCode,dictName', {}).then((res) => {
                return res.data
            })
            dictConst.children.length = 0
            dict.forEach((dictOne) => {
                dictConst.children.push({
                    _id:dictOne.id,
                    title: dictOne.dictName,
                    _description: '',
                    _type: 'object',
                    _code: async () => {
                        return JSON.stringify(await getDictItems(dictOne.id))
                    },
                })
            })
        } catch (e) {
            throw e
        } finally {
            loading = false
        }
    }
    return dictConst.children
}

const getDictItems = async (dictId: string) => {
    const items = await entityApi.query('platform_dict_item', 'id,itemCode,itemName', {
        dictId,
        delStatus: 0
    }).then((res) => {
        return res.data
    })
    const result = {}
    items?.forEach((item: any) => {
        result[item.itemCode] = item.itemName
    })
    return result
}


let workflows: any[] = []
let loadingWorkflow = true
const workflowConst = {
    title: '流程定义',
    children: [],
    _description: ''
}
export const useWorkflowTreeData = async () => {
    if (workflows.length === 0) {
        loadingWorkflow = true
        try {
            // dict = await entityApi.query('platform_dict', 'id,dictCode,dictName', {}).then((res) => {
            //     return res.data
            // })
            // dictConst.children.length = 0
            // dict.forEach((dictOne) => {
            //     dictConst.children.push({
            //         title: dictOne.dictName,
            //         _description: '',
            //         _type: 'object',
            //         _code: async () => {
            //             return JSON.stringify(await getDictItems(dictOne.id))
            //         },
            //     })
            // })
        } catch (e) {
            throw e
        } finally {
            loadingWorkflow = false
        }
    }
    return workflowConst.children
}