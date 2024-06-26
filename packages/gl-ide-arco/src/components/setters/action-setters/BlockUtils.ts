import { jsScriptExecutor, utils } from '@geelato/gl-ui'
import type {Param} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";

export interface Params {
    [key: string]: string;
}
const regex = /\${(\w+)}/g;
export default class BlockUtils {

    static highlightVariables = (str: string | undefined) => {
        if (!str) return ''

        // title='$t$&' 这里用于后续替换展示完整的代码信息
        return str.replace(regex, "<span class='gl-var' title='$t$&'>$&</span>");
    }

    /**
     *
     * @param message
     * @param props
     * @param propsExpressions
     */
    static replaceVariables = (message: string, props: Params, propsExpressions?: Record<string, any>): string => {
        let result: string = message;
        // 合并props和propsExpressions的所有key，因为没设置值时，key不会出现在props和propsExpressions中。
        const keys = Object.keys(props)
        if (propsExpressions) {
            Object.keys(propsExpressions).forEach((key: string) => {
                if (!keys.includes(key)) {
                    keys.push(key)
                }
            })
        }
        // 获取每个key进行替换
        keys.forEach((propKey: string) => {
            let propExpression = propsExpressions ? (propsExpressions[propKey] || '') : ''
            let simpleParamExpression = ''
            if (propExpression) {
                let maxLength = 30
                let moreInfo = propExpression.length > maxLength ? '...' : ''
                simpleParamExpression = propExpression.toString().substring(0, maxLength) + moreInfo
            }
            // 脚本优先
            let propValue = simpleParamExpression || utils.getNestedProperty(props,propKey)
            let titleValue = propExpression || utils.getNestedProperty(props,propKey) || ''
            console.log('BlockUtils > replaceVariables:', propKey, 'propValue:', propValue,'titleValue:',titleValue)
            result = result.replace(new RegExp('\\$t\\${' + propKey + '}', 'g'), titleValue);
            if (propValue !== undefined && typeof propValue != 'object') {
                // 尝试看是不是组件，如果是否组件，取组件label进行展示
                const componentInst: ComponentInstance = jsScriptExecutor.getComponentInst(propValue)
                // console.log('BlockUtils > try to find inst by propKey:', propKey, ' propValue:', propValue, ',and get', componentInst)
                if (componentInst) {
                    if (componentInst.componentName === 'GlEntityTablePlus' || componentInst.componentName === 'GlEntityTableEdit') {
                        propValue = componentInst.props.base.label || componentInst.id;
                    } else {
                        propValue = componentInst.props.label || componentInst.id
                    }
                }
                // @ts-ignore
                result = result.replace(new RegExp('\\${' + propKey + '}', 'g'), propValue);
                result = result.replace(new RegExp('{' + propKey + '}', 'g'), `"${propValue}"`);
            }
        });
        return result;
    }

    static paramStringify = (params: Param[]) => {

        const strArray = []
        strArray.push("[")
        params.forEach((param) => {
            const valueType = typeof param.value
            let newValue = undefined
            switch (valueType) {
                case "undefined" :
                case "boolean" :
                case "number" :
                case "object" :
                    newValue = `${param.value}`
                    break
                default:
                    newValue = `"${param.value}"`
                    break
            }
            strArray.push("{")
            strArray.push("name:")
            strArray.push(`"${param.name}"`)
            strArray.push(",value:")
            strArray.push(newValue)
            strArray.push(",valueExpression:")
            strArray.push(`${param.valueExpression}`)
            strArray.push("},")
        })
        strArray.push("]")
        return strArray.join('')
    }
    /**
     * 参数据对象序列化，形成代码块
     * 将数组参数转成对象参数
     */
    // static convertParam = (params?: Param[]) => {
    //     if (!params) return {}
    //     const ary = []
    //     ary.push('{')
    //     params.forEach((param, index) => {
    //         ary.push(`"${param.name}":${param.valueExpression || param.value}${index === params.length - 1 ? "" : ","}`)
    //     })
    //     ary.push('}')
    //     return ary.join('\r\n');
    // }

    /**
     * 参数据对象序列化，形成代码块
     *
     * @param params
     */
    // static paramStringify = (params: Param[]) => {
    //     return JSON.stringify(params, (key, value) => {
    //         if (key === 'name'||key === 'id') {
    //             return `"${value}"`
    //         }
    //         return value
    //     })
    // }

    /**
     * 参数据对象序列化，形成代码块
     * @param params
     */
    // static paramStringify = (params: Array<PageParamConfigType>) => {
    //     const strArray = []
    //     strArray.push("[")
    //     let index = 1
    //     params.forEach((param) => {
    //         strArray.push("{")
    //         strArray.push(`"${param.pName}":`)
    //         switch (param.pType) {
    //             case undefined:
    //                 strArray.push(`"${param.pValue}"`)
    //                 break
    //             case "string" :
    //                 strArray.push(`"${param.pValue}"`)
    //                 break
    //             case "number" :
    //                 strArray.push(param.pValue)
    //                 break
    //             case "boolean" :
    //                 strArray.push(param.pValue)
    //                 break
    //             case "express" :
    //                 strArray.push(param.pValue)
    //                 break
    //             case "array" :
    //                 strArray.push(param.pValue)
    //                 break
    //             case "object" :
    //                 strArray.push(param.pValue)
    //                 break
    //             default:
    //                 strArray.push(`"${param.pValue}"`)
    //                 break
    //         }
    //         strArray.push("}")
    //         if (index !== params.length) {
    //             strArray.push(",")
    //         }
    //         index++
    //     })
    //     strArray.push("]")
    //     return strArray.join('')
    // }

}