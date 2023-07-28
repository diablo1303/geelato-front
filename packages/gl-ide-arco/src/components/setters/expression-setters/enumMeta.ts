// @ts-nocheck
import {entityApi} from "@geelato/gl-ui";

let dict: any[] = []
let loading = false
const dictConst = {
    title: '数据字典',
    children: [],
    _description: ''
}
export const useEnumTreeData = async () => {
    const sysConst = {
        title: '系统常量',
        children: [
            {
                title: 'page.status 页面状态',
                _description: '',
                children: [
                    {title: '只读', _code: '"read"', _type: 'string', _description: '页页面各组件为只读状态'},
                    {
                        title: '编辑',
                        _code: '"edit"',
                        _type: 'string',
                        _description: '页页面各组件为编辑状态，此为默认状态'
                    }
                ],
            }
        ],
        _description: ''
    }

    if (dict.length === 0) {
        loading = true
        try {
            dict = await entityApi.query('platform_dict', 'id,dictCode,dictName', {}).then((res) => {
                return res.data?.data
            })
            dictConst.children.length = 0
            dict.forEach((dictOne) => {
                dictConst.children.push({
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

    return [sysConst, dictConst]
}

const getDictItems = async (dictId: string) => {
    const items = await entityApi.query('platform_dict_item', 'id,itemCode,itemName', {
        dictId,
        delStatus: 0
    }).then((res) => {
        return res.data?.data
    })
    const result = {}
    items?.forEach((item: any) => {
        result[item.itemCode] = item.itemName
    })
    return result
}