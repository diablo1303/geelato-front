import {jsScriptExecutor} from "@geelato/gl-ui";
import type {Param} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";

export interface Params {
    [key: string]: string;
}

export default class BlockUtils {

    static highlightVariables = (str: string | undefined) => {
        if (!str) return ''
        const regex = /\${(\w+)}/g;
        return str.replace(regex, "<span class='gl-var'>$&</span>");
    }

    static replaceVariables = (message: string, params: Params): string => {
        let result: string = message;
        Object.keys(params).forEach((paramKey: string) => {
            let paramValue = params[paramKey]
            if (paramValue !== undefined) {
                // 尝试看是不是组件，如果是否组件，取组件label进行展示
                const componentInst: ComponentInstance = jsScriptExecutor.getComponentInst(paramValue)
                // console.log('BlockUtils > try to find inst by paramKey:', paramKey, ' paramValue:', paramValue, ',and get', componentInst)
                if (componentInst) {
                    if (componentInst.componentName === 'GlEntityTablePlus') {
                        paramValue = componentInst.props.base.label || componentInst.id;
                    } else {
                        paramValue = componentInst.props.label || componentInst.id
                    }
                }
                result = result.replace(new RegExp('\\${' + paramKey + '}', 'g'), paramValue);
                result = result.replace(new RegExp('{' + paramKey + '}', 'g'), `"${paramValue}"`);
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