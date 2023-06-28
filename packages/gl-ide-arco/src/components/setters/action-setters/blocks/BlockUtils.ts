import type {PageParamConfigType} from "@geelato/gl-ui";
import type {PageProvideProxy} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {actionScriptExecutor} from "@geelato/gl-ui";

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
                const componentInst: ComponentInstance = actionScriptExecutor.getComponentInst(paramValue)
                console.log('BlockUtils > try to find inst by paramKey:', paramKey, ' paramValue:', paramValue, ',and get', componentInst)
                if (componentInst) {
                    if (componentInst.componentName === 'GlEntityTablePlus') {
                        paramValue = componentInst.props.base.tableTitle || componentInst.id;
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

    /**
     * 参数据对象序列化，形成代码块
     * @param params
     */
    static paramStringify = (params: Array<PageParamConfigType>) => {
        const strArray = []
        strArray.push("[")
        let index = 1
        params.forEach((param) => {
            strArray.push("{")
            strArray.push(`"${param.pName}":`)
            switch (param.pType) {
                case undefined:
                    strArray.push(`"${param.pValue}"`)
                    break
                case "string" :
                    strArray.push(`"${param.pValue}"`)
                    break
                case "number" :
                    strArray.push(param.pValue)
                    break
                case "boolean" :
                    strArray.push(param.pValue)
                    break
                case "express" :
                    strArray.push(param.pValue)
                    break
                case "array" :
                    strArray.push(param.pValue)
                    break
                case "object" :
                    strArray.push(param.pValue)
                    break
                default:
                    strArray.push(`"${param.pValue}"`)
                    break
            }
            strArray.push("}")
            if (index !== params.length) {
                strArray.push(",")
            }
            index++
        })
        strArray.push("]")
        return strArray.join('')
    }

}