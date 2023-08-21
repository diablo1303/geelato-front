import type IBlockHandler from "../BlockHandler";
import ParseResult from "../ParseResult";
import type {Param} from "@geelato/gl-ui";

export default class ComponentInvokeBlockHandler implements IBlockHandler {

    parseToScript(props: Props): ParseResult {
        // console.log("ComponentInvokeBlockHandler > parseToScript > props:", props)
        const params = props.params || []

        if (props.resultVar) {
            return new ParseResult(
                `
                ${props.resultVar} = ${props.enableAwait ? 'await ' : ''} $gl.fn.invokeComponentMethod("${props.componentId}","${props.methodName}",${JSON.stringify(params)});
                ${props.enableReturn ? 'return ' + props.resultVar : ''}
                `
            ).setBlockName('ComponentInvokeBlock');
        } else {
            return new ParseResult(
                `
                ${props.enableReturn ? 'return ' : ''} ${props.enableAwait ? 'await ' : ''} $gl.fn.invokeComponentMethod("${props.componentId}","${props.methodName}",${JSON.stringify(params)})
                `
            ).setBlockName('ComponentInvokeBlock');
        }

    }
}

export class Props {
    appId: string = "";
    // 调用的组件Id
    componentId: string = "";
    // 组件definedExpose出来的方法名
    methodName: string = "";
    // 调用方法的参数
    params?: Array<Param>;
    // 执行该方法后，返回执行结果
    enableReturn: Boolean = true
    // 是否启用同步执行
    enableAwait: Boolean = false
    // 返回结果，存储到变量
    resultVar?: string
}
