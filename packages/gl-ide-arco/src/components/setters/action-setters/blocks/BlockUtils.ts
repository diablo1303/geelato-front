import type {PageParamType} from "@geelato/gl-ui";

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
        Object.keys(params).forEach((key: string) => {
            if (params[key] !== undefined) {
                result = result.replace(new RegExp('\\${' + key + '}', 'g'), params[key]);
                result = result.replace(new RegExp('{' + key + '}', 'g'), `"${params[key]}"`);
            }
        });
        return result;
    }

    /**
     * 参数据对象序列化，形成代码块
     * @param params
     */
    static paramStringify = (params: Array<PageParamType>) => {
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